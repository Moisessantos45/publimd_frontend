<template>
  <div class="max-w-6xl mx-auto flex flex-col gap-6">
    <div class="flex items-center gap-4">
      <RouterLink to="/admin/posts"
        class="p-2 bg-canvas-white border border-light-gray-border rounded-circular text-ash-gray hover:text-midnight-pine hover:bg-light-gray-border/20 transition-colors shrink-0">
        <ArrowLeft :size="18" />
      </RouterLink>
      <div>
        <h1 class="text-xl font-semibold text-midnight-pine font-pp-mori">Colaboradores del Post</h1>
        <p class="text-sm text-ash-gray mt-1">Gestiona los invitados y sus permisos para este post.</p>
      </div>
      <div class="ml-auto" v-if="postCollaborators.isAuthor || postCollaborators.permissionId > 2">
        <button @click="isModalOpen = true"
          :disabled="loading || (!postCollaborators.isAuthor && postCollaborators.permissionId <= 2)"
          :class="['rounded-circular px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 shadow-sm', (loading || (!postCollaborators.isAuthor && postCollaborators.permissionId <= 2)) ? 'text-steel-border/50 cursor-not-allowed bg-light-gray-border/30 border border-light-gray-border' : 'bg-forest-link hover:bg-forest-link/90 text-white']">
          <Plus :size="16" />
          Agregar Usuario
        </button>
      </div>
    </div>

    <div class="bg-canvas-white border border-light-gray-border rounded-[20px] overflow-x-auto">
      <table class="w-full text-left text-sm text-ash-gray">
        <thead
          class="bg-light-gray-border/20 text-xs uppercase tracking-wider text-ash-gray border-b border-light-gray-border font-inter font-semibold">
          <tr>
            <th class="px-6 py-3">Usuario</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Estado</th>
            <th class="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-light-gray-border font-inter">
          <tr v-for="coll in postCollaborators.collaborators" :key="coll.userId"
            class="hover:bg-light-gray-border/10 transition-colors">
            <td class="px-6 py-4">
              <img :src="coll.avatar" :alt="coll.username" class="w-10 h-10 rounded-full" loading="lazy" />
            </td>
            <td class="px-6 py-4 text-slate-text">{{ coll.email }}</td>
            <td class="px-6 py-4">
              <span v-if="coll.confirmed"
                class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-circular text-xs font-medium bg-forest-link/10 text-forest-link border border-forest-link/20">
                <span class="w-1.5 h-1.5 rounded-full bg-forest-link"></span>
                Confirmado
              </span>
              <span v-else
                class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-circular text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Pendiente
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <DynamicDropdown :model-value="coll.permissionId" :options="roleOptions" :icon="Shield" align="right"
                  :disabled="loading || (!postCollaborators.isAuthor && postCollaborators.permissionId <= 2)"
                  @change="(r) => modifyPermissions(coll.userId, r as number)" />
                <button v-if="!coll.confirmed" @click="resendEmail(coll.userId)"
                  :disabled="loading || (!postCollaborators.isAuthor && postCollaborators.permissionId <= 2)"
                  :class="['p-1.5 rounded-circular transition-colors', (loading || (!postCollaborators.isAuthor && postCollaborators.permissionId <= 2)) ? 'text-steel-border/50 cursor-not-allowed' : 'text-ash-gray hover:text-forest-link hover:bg-forest-link/10']"
                  title="Reenviar Email de Confirmación">
                  <Mail :size="16" />
                </button>
                <button @click="deleteCollaborator(coll.userId)"
                  :disabled="loading || (!postCollaborators.isAuthor && postCollaborators.permissionId <= 2)"
                  :class="['p-1.5 rounded-circular transition-colors', (loading || (!postCollaborators.isAuthor && postCollaborators.permissionId <= 2)) ? 'text-steel-border/50 cursor-not-allowed' : 'text-ash-gray hover:text-red-500 hover:bg-red-500/10']"
                  title="Eliminar">
                  <Trash2 :size="16" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AddCollaboratorModal v-model:isOpen="isModalOpen" :role-options="roleOptions" @invite="handleInvite" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from "vue-toastification";
import { Mail, Trash2, ArrowLeft, Plus, Shield } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import DynamicDropdown from '@/components/atoms/DynamicDropdown.vue';
import AddCollaboratorModal from '@/features/components/AddCollaboratorModal.vue'
import { useCollaboratorStore } from '@/store/collaborator'
import useWebSocketStore from '@/store/webSocket';
import type { DropdownOption } from '@/entities/index';

const route = useRoute()
const slug = route.params.slug || ""
const toast = useToast()


const collaboratorStore = useCollaboratorStore()
const webSocketStore = useWebSocketStore()

const { postCollaborators, loading, permissionsCollaborators } = storeToRefs(collaboratorStore)

const roleOptions = computed<DropdownOption[]>(() => permissionsCollaborators.value.map(p => ({
  id: p.id,
  label: p.name,
  buttonClass: p.id === 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  dotClass: p.id === 1 ? 'bg-emerald-400' : 'bg-amber-400'
})))

const isModalOpen = ref(false)

const handleInvite = async (data: { id: number, role: number }) => {
  if (typeof slug !== 'string' || !data.id || !data.role) {
    toast.error('Por favor, ingresa datos válidos.')
    return
  }

  const result = await collaboratorStore.addCollaborator(slug, data.id, data.role)
  if (result.isSuccess) {
    toast.success('Colaborador invitado exitosamente.')
  } else {
    toast.error('Hubo un error al invitar al colaborador.')
  }
}

const modifyPermissions = async (id: number, role: number) => {
  if (typeof slug !== 'string' || !id) {
    toast.error('Por favor, ingresa datos válidos.')
    return
  }

  const result = await collaboratorStore.updateCollaborator(slug, id, role)
  if (result.isSuccess) {
    toast.success('Permisos actualizados exitosamente.')

    webSocketStore.updatePermissions(
      slug
    )
  } else {
    toast.error('Hubo un error al actualizar los permisos.')
  }
}

const resendEmail = async (id: number) => {
  if (typeof slug !== 'string' || !id) {
    toast.error('Por favor, ingresa datos válidos.')
    return
  }

  const result = await collaboratorStore.resendInvitation(slug, id)
  if (result.isSuccess) {
    toast.success('Email de confirmación reenviado.')
  } else {
    toast.error('Hubo un error al reenviar el email de confirmación.')
  }
}

const deleteCollaborator = async (id: number) => {
  if (typeof slug !== 'string' || !id) {
    toast.error('Por favor, ingresa datos válidos.')
    return
  }

  const result = await collaboratorStore.deleteCollaborator(slug, id)
  if (result.isSuccess) {
    toast.success('Colaborador eliminado exitosamente.')
  } else {
    toast.error('Hubo un error al eliminar al colaborador.')
  }
}

const getCollaborators = () => {
  if (typeof slug === 'string' && slug.trim() !== "") {
    collaboratorStore.getCollaborators(slug)
    if (permissionsCollaborators.value.length === 0) {
      collaboratorStore.getPermissionsCollaborators(slug)
    }
  }
}

onMounted(() => {
  getCollaborators()
})
</script>