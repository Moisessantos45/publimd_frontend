<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-midnight-pine/20 backdrop-blur-sm">
    <div class="bg-canvas-white border border-light-gray-border rounded-[20px] p-6 w-full max-w-md shadow-xl">
      <h2 class="text-xl font-semibold text-midnight-pine font-pp-mori mb-4">Agregar Colaborador</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium text-ash-gray font-inter mb-1">Email</label>
        <div class="flex gap-2">
          <input v-model="email" type="email"
            class="w-full bg-transparent border border-light-gray-border rounded-md px-3 py-2 text-slate-text font-inter focus:outline-none focus:border-forest-link/50 transition-colors"
            placeholder="correo@ejemplo.com">
          <button @click="searchUser" :disabled="loading"
            class="bg-light-gray-border/20 hover:bg-light-gray-border/50 text-midnight-pine border border-light-gray-border rounded-circular px-4 py-2 text-sm font-medium transition-colors">Buscar</button>
        </div>
      </div>

      <div v-if="dataForm.id != -1" class="mb-6 flex flex-col gap-4">
        <div class="p-3 bg-light-gray-border/10 border border-light-gray-border rounded-md flex items-center justify-between">
          <div>
            <div class="text-midnight-pine font-medium font-inter">{{ dataForm.name }}</div>
            <div class="text-sm text-ash-gray font-inter">{{ dataForm.email }}</div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-ash-gray font-inter mb-1">Permisos</label>
          <DynamicDropdown v-model="selectedRole" :options="roleOptions" :icon="Shield" align="right" />
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button @click="closeModal"
          class="px-4 py-2 text-sm font-medium text-ash-gray hover:text-midnight-pine transition-colors font-inter">Cancelar</button>
        <button v-if="dataForm.id != -1" @click="confirmInvitation"
          class="bg-forest-link hover:bg-forest-link/90 text-white rounded-circular px-4 py-2 text-sm font-medium transition-colors shadow-sm font-inter">
          Confirmar Invitación
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia';
import { useToast } from "vue-toastification";
import DynamicDropdown from '@/components/atoms/DynamicDropdown.vue';
import { Shield } from 'lucide-vue-next'
import { useCollaboratorStore } from '@/store/collaborator';
import type { DropdownOption } from '@/entities/index';

const props = defineProps<{ isOpen: boolean, roleOptions: DropdownOption[] }>()
const emit = defineEmits(['update:isOpen', 'invite'])

const route = useRoute()
const slug = route.params.slug || ""
const toast = useToast()
const collaboratorStore = useCollaboratorStore()
const { dataForm,loading } = storeToRefs(collaboratorStore)
const email = ref('')
const selectedRole = ref(1)

const searchUser = async () => {
  if (typeof slug !== 'string' || !email.value) {
    toast.error('Por favor, ingresa un email válido.')
    return
  }

  const result = await collaboratorStore.getCollaboratorByEmail(email.value, slug)
  if (result.isSuccess) {
    toast.success('Usuario encontrado. Puedes confirmar la invitación.')
  } else {
    toast.error('No se encontró ningún usuario con ese email.')
  }

}

const closeModal = () => {
  emit('update:isOpen', false)
  email.value = ''

  selectedRole.value = 1
}

const confirmInvitation = () => {
  emit('invite', { id: dataForm.value.id, role: selectedRole.value })
  closeModal()
}

onBeforeUnmount(() => {
  email.value = ''
  selectedRole.value = 1
  collaboratorStore.clearForm()
})
</script>
