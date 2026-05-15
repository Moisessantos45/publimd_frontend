<template>
  <div class="max-w-6xl mx-auto flex flex-col gap-6 sm:px-1 px-5 sm:py-1 py-5">
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
      <!-- <div class="flex items-center gap-3 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-auto">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-ash-gray" />
          <input type="text" placeholder="Buscar posts..."
            class="bg-canvas-white border border-light-gray-border rounded-circular py-1.5 pl-9 pr-4 text-sm text-slate-text placeholder:text-ash-gray/60 outline-none focus:border-forest-link/50 w-full sm:w-64 transition-colors" />
        </div>
        <button
          class="bg-canvas-white border border-light-gray-border rounded-circular py-1.5 px-3 text-ash-gray hover:text-midnight-pine hover:border-steel-border transition-colors flex items-center justify-center gap-2 text-sm shrink-0">
          <Filter :size="14" />
          Filtrar
        </button>
      </div> -->

      <RouterLink to="/admin/editor"
        class="bg-forest-link hover:bg-forest-link/90 text-white rounded-circular py-1.5 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
        <Plus :size="16" />
        Nuevo Post
      </RouterLink>
    </div>

    <div class="bg-canvas-white border border-light-gray-border rounded-[20px] overflow-hidden">
      <div class="w-full overflow-x-auto">
        <table class="min-w-225 w-full text-left text-sm text-ash-gray">
        <thead
          class="bg-light-gray-border/20 text-xs uppercase tracking-wider text-ash-gray border-b border-light-gray-border font-inter font-semibold">
          <tr>
            <th class="px-6 py-3">Título</th>
            <th class="px-6 py-3">Estado</th>
            <th class="px-6 py-3">Fecha</th>
            <th class="px-6 py-3">Invitado</th>
            <th class="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-light-gray-border font-inter">
          <tr v-for="post in postGenerics" :key="post.id"
            class="hover:bg-light-gray-border/10 transition-colors py-[16px]">
            <td class="px-6 py-4">
              <div class="text-slate-text font-medium">
                {{ post.title }}
              </div>
              <div class="text-ash-gray text-xs mt-0.5">
                {{ post.category }} - {{ post.tags.join(", ") }}
              </div>
            </td>
            <td class="px-6 py-4">
              <DynamicDropdown :model-value="post.stateId" :options="postStatusOptions" rounded-class="rounded-circular"
                :disabled="post.collaboratorPermissionId <= 2"
                @change="(s) => changeStatus(post.slug, post.id, s as number)" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-ash-gray">
              {{ post.createdAt }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-ash-gray">
              {{ post.isCollaborative ? "Sí" : "No" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <button @click="vectorizePost(post.slug)" :disabled="post.isVectorized"
                  class="p-1.5 rounded-circular transition-colors"
                  :class="!post.isVectorized ? 'text-forest-link hover:bg-forest-link/10' : 'text-steel-border opacity-50 cursor-not-allowed'"
                  :title="post.isVectorized ? 'Post ya vectorizado' : 'Vectorizar Post'">
                  <Bot :size="16" />
                </button>
                <button @click="openFullView(post.slug)"
                  class="p-1.5 text-ash-gray hover:text-forest-link hover:bg-forest-link/10 rounded-circular transition-colors"
                  title="Compartir">
                  <Share2 :size="16" />
                </button>
                <RouterLink :to="`/admin/posts/${post.slug}/collaborators`"
                  class="p-1.5 text-ash-gray hover:text-forest-link hover:bg-forest-link/10 rounded-circular transition-colors"
                  title="Ver Colaboradores">
                  <Users :size="16" />
                </RouterLink>
                <RouterLink :to="{ name: 'editor', query: { slug: post.slug } }"
                  class="p-1.5 text-ash-gray hover:text-forest-link hover:bg-forest-link/10 rounded-circular transition-colors"
                  title="Editar">
                  <FileEdit :size="16" />
                </RouterLink>
              </div>
            </td>
          </tr>
        </tbody>
        </table>
      </div>
    </div>

    <PageNavigator v-if="paginatedPostGeneric.totalPages > 1" :total="paginatedPostGeneric.total"
      :page="paginatedPostGeneric.page" :totalPages="paginatedPostGeneric.totalPages" :changePage="changePage" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification"
import { FileEdit, Plus, Users, Share2, Bot } from 'lucide-vue-next'
import usePostStore from '@/store/post';
import DynamicDropdown from '@/components/atoms/DynamicDropdown.vue';
import PageNavigator from '@/components/molecules/PageNavigator.vue'
import { DEFAULT_THEME, STATUS_THEMES } from '@/composables/colors';
import type { DropdownOption } from '@/entities/index';

const router = useRouter()
const toast = useToast()
const postStore = usePostStore()
const { postGenerics, paginatedPostGeneric, statePost } = storeToRefs(postStore)

const getThemeByName = (name: string) => {
  const key = name?.toLowerCase()
  return STATUS_THEMES[key] ?? DEFAULT_THEME
}

const postStatusOptions = computed<DropdownOption[]>(() => {
  return statePost.value.map(option => {
    const theme = getThemeByName(option.name)
    return {
      id: option.id,
      label: option.name,
      buttonClass: theme.button,
      dotClass: theme.dot,
      textClass: theme.text
    }
  })
})

const getData = async () => {
  await Promise.allSettled([
    postStore.getPostGenerics(),
    postStore.getStatePost()
  ])
}

const changePage = (page: number) => {
  if (page < 1 || page > paginatedPostGeneric.value.totalPages) return
  paginatedPostGeneric.value.page = page
  getData()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}


const changeStatus = async (slug: string, postId: number, newStatus: number) => {
  const result = await postStore.updatePostState(slug, postId, newStatus)
  if (result.isSuccess) {
    toast.success("Estado actualizado correctamente")
    getData()
  } else {
    toast.error("Error al actualizar el estado")
  }
};

const vectorizePost = async (slug: string) => {
  const result = await postStore.updateEmbeddings(slug)
  if (result.isSuccess) {
    toast.success("Post vectorizado correctamente")
  } else {
    toast.error("Error al vectorizar el post")
  }
};

const openFullView = (slug: string) => {
  const routeData = router.resolve({
    name: 'full-post',
    params: { slug },
  });
  window.open(routeData.href, '_blank', 'noopener,noreferrer');
};


onMounted(() => {
  getData()
})
</script>