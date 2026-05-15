<template>
  <div class="max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-canvas-white border border-light-gray-border rounded-[20px] p-4 flex items-center gap-4">
        <div class="w-10 h-10 rounded-circular flex items-center justify-center bg-forest-link/10 text-forest-link">
          <FileText :size="18" stroke-width="2" />
        </div>
        <div class="flex flex-col p-2">
          <span class="text-midnight-pine text-xl font-semibold leading-tight font-pp-mori">
            {{ userDashboardMetrics.totalPosts }}
          </span>
          <span class="text-ash-gray text-[11px] uppercase tracking-widest mt-0.5">Posts Creados</span>
        </div>
      </div>
      <div class="bg-canvas-white border border-light-gray-border rounded-[20px] p-4 flex items-center gap-4">
        <div class="w-10 h-10 rounded-circular flex items-center justify-center bg-midnight-pine/10 text-midnight-pine">
          <Users :size="18" stroke-width="2" />
        </div>
        <div class="flex flex-col p-2">
          <span class="text-midnight-pine text-xl font-semibold leading-tight font-pp-mori">
            {{ userDashboardMetrics.totalCollaborations }}
          </span>
          <span class="text-ash-gray text-[11px] uppercase tracking-widest mt-0.5">Colaboraciones</span>
        </div>
      </div>
      <div class="bg-canvas-white border border-light-gray-border rounded-[20px] p-4 flex items-center gap-4">
        <div class="w-10 h-10 rounded-circular flex items-center justify-center bg-red-500/10 text-red-500">
          <Heart :size="18" stroke-width="2" />
        </div>
        <div class="flex flex-col p-2">
          <span class="text-midnight-pine text-xl font-semibold leading-tight font-pp-mori">
            {{ userDashboardMetrics.totalLikes }}
          </span>
          <span class="text-ash-gray text-[11px] uppercase tracking-widest mt-0.5">Me Gusta</span>
        </div>
      </div>
      <div class="bg-canvas-white border border-light-gray-border rounded-[20px] p-4 flex items-center gap-4">
        <div class="w-10 h-10 rounded-circular flex items-center justify-center bg-amber-500/10 text-amber-500">
          <MessageSquare :size="18" stroke-width="2" />
        </div>
        <div class="flex flex-col p-2">
          <span class="text-midnight-pine text-xl font-semibold leading-tight font-pp-mori">
            {{ userDashboardMetrics.totalComments }}
          </span>
          <span class="text-ash-gray text-[11px] uppercase tracking-widest mt-0.5">Comentarios</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div class="lg:col-span-2 flex flex-col gap-4">
        <h2 class="text-midnight-pine text-sm font-medium tracking-wide uppercase">Posts Recientes</h2>
        <div class="bg-canvas-white rounded-[20px] border border-light-gray-border divide-y divide-light-gray-border overflow-hidden p-[16px]">
          <div v-for="post in postInfoRecent" :key="post.id"
            class="p-4 flex items-center justify-between hover:bg-light-gray-border/20 transition-colors cursor-pointer">
            <div class="flex flex-col gap-1">
              <span class="text-slate-text text-sm font-medium">
                {{ post.title }}
              </span>
              <span class="text-ash-gray text-[11px]">
                Creado {{ post.createdAt }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-ash-gray text-xs">
              <RouterLink :to="{ name: 'full-post', params: { slug: post.slug } }" class="flex items-center gap-1 hover:text-forest-link transition-colors">
                <Eye :size="14" /> 120
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h2 class="text-midnight-pine text-sm font-medium tracking-wide uppercase">
          Información Relevante
        </h2>
        <div class="bg-canvas-white rounded-[20px] border border-light-gray-border p-5 flex flex-col gap-4">
          <div class="bg-forest-link/10 text-forest-link p-3 rounded-xl border border-forest-link/20 text-xs leading-relaxed">
            <strong>Tip:</strong> 
            Puedes usar Markdown avanzado con soporte KaTeX para fórmulas matemáticas.
          </div>
          <div
            class="bg-midnight-pine/10 text-midnight-pine p-3 rounded-xl border border-midnight-pine/20 text-xs leading-relaxed">
            Tus posts han incrementado su visibilidad un 15% esta semana. ¡Sigue así!
          </div>
          <RouterLink to="/admin/editor"
            class="w-full bg-forest-link hover:bg-forest-link/90 text-white text-xs py-2 rounded-circular transition-colors mt-2 text-center font-medium shadow-sm">
            Crear nuevo post
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { FileText, Users, Heart, MessageSquare } from 'lucide-vue-next'
import useUserStore from '@/store/user';
import usePostStore from '@/store/post';

const userStore = useUserStore()
const postStore = usePostStore()
const { userDashboardMetrics } = storeToRefs(userStore)
const { postInfoRecent } = storeToRefs(postStore)

const getData = async () => {
  await Promise.allSettled([
    userStore.getUserDashboardMetrics(),
    postStore.getPostInfoRecent()
  ])
}

onMounted(() => {
  getData()
})
</script>