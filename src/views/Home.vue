<template>
  <div class="min-h-full flex flex-col bg-canvas-white text-slate-text font-inter p-4">
    <section class="relative overflow-hidden border-b border-light-gray-border max-w-5xl mx-auto w-full">
      <div class="mx-auto w-full px-6 py-4 sm:py-20 flex flex-col items-center gap-10 animate-fade-in">
        <div class="flex flex-col gap-6 w-full items-stretch text-left">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div
              class="inline-flex items-center gap-2 bg-transparent border border-forest-link rounded-circular px-4 py-1.5 text-forest-link text-[12px] sm:text-body-sm font-medium tracking-tight">
              <span class="w-2 h-2 rounded-circular bg-forest-link animate-pulse" />
              Edicion abierta a la comunidad
            </div>
            <RouterLink
              to="/login"
              class="inline-flex items-center gap-2 rounded-circular border border-light-gray-border bg-canvas-white px-4 py-2 text-[12px] sm:text-body-sm font-medium text-midnight-pine transition-colors hover:border-forest-link hover:text-forest-link"
            >
              <LogIn :size="16" />
              Iniciar sesión
            </RouterLink>
          </div>
          <h1
            class="font-pp-mori font-bold text-[2.15rem] sm:text-heading lg:text-display leading-[0.98] sm:leading-[0.95] text-midnight-pine tracking-tight">
            Encuentra articulos con
            <br />
            <span class="text-forest-link">criterio editorial</span>
          </h1>
          <p class="font-inter text-sm sm:text-body text-ash-gray leading-[1.55] sm:leading-subheading tracking-normal sm:tracking-subheading">
            Busqueda clara y ordenada para lectores sin registro. Explora ideas, guias y analisis en una portada que
            prioriza lo que realmente importa.
          </p>
          <div class="relative w-full mt-2">
            <Search :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-ash-gray" />
            <input id="hero-search" v-model="searchQuery" type="text" placeholder="Buscar articulos, temas, autores..."
              class="w-full bg-canvas-white border border-light-gray-border rounded-soft py-[16px] pl-12 pr-4 text-sm sm:text-body-sm text-midnight-pine placeholder:text-ash-gray outline-none focus:border-forest-link transition-colors"
              @input="onSearch" />
            <kbd
              class="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 bg-transparent border border-steel-border rounded px-1.5 py-0.5 text-[12px] text-ash-gray font-inter">
              ⌘K
            </kbd>
          </div>
          <div class="flex flex-wrap items-center gap-2 pt-2">
            <span class="text-[12px] sm:text-body-sm text-ash-gray">Lecturas destacadas:</span>
            <span v-for="topic in quickTopics" :key="topic"
              class="bg-transparent text-ash-gray border border-steel-border text-[12px] sm:text-body-sm px-3 py-0.5 rounded-circular font-inter">
              {{ topic }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <main class="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-6 py-10 flex flex-col gap-8">
      <div
        class="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-light-gray-border pb-4 gap-3">
        <div class="flex flex-col gap-2">
          <p class="font-pp-mori text-xl sm:text-heading-sm text-midnight-pine">Portada de articulos</p>
          <p class="font-inter text-sm sm:text-body text-ash-gray leading-[1.55] sm:leading-subheading">
            <span v-if="searchQuery">
              Resultados para <span class="text-midnight-pine font-medium">"{{ searchQuery }}"</span> —
            </span>
            <span class="text-midnight-pine font-medium">{{ paginated.total }}</span> articulos encontrados
          </p>
        </div>
        <span class="font-inter text-[12px] sm:text-body-sm text-ash-gray">Pagina {{ paginated.page }} de {{ paginated.totalPages
          }}</span>
      </div>

      <div v-if="postPublic.length > 0" class="flex flex-col gap-5 animate-fade-in">
        <RouterLink v-for="post in postPublic" :key="post.id" :to="{ name: 'full-post', params: { slug: post.slug } }"
          class="group relative bg-canvas-white border border-light-gray-border rounded-[20px] px-4.5 py-6 hover:border-forest-link transition-all duration-200 flex flex-col gap-4 no-underline">
          <div class="flex items-center gap-2 flex-nowrap overflow-x-auto sm:flex-wrap sm:overflow-visible">
            <span
              class="bg-transparent text-forest-link border border-forest-link text-[11px] sm:text-body-sm font-medium px-2.5 sm:px-3 py-0.5 rounded-circular tracking-tight font-inter whitespace-nowrap">
              {{ post.category || 'General' }}
            </span>
            <span v-for="tag in post.tags.slice(0, 3)" :key="tag"
              class="bg-transparent text-ash-gray border border-steel-border text-[11px] sm:text-body-sm px-2.5 sm:px-3 py-0.5 rounded-circular font-inter whitespace-nowrap">
              #{{ tag }}
            </span>
          </div>
          <h2
            class="font-pp-mori font-bold text-xl sm:text-[32px] leading-[1.15] sm:leading-heading-sm text-midnight-pine group-hover:text-forest-link transition-colors line-clamp-2">
            {{ post.title }}
          </h2>
          <p class="font-inter text-sm sm:text-body-sm text-slate-text leading-normal line-clamp-3">
            {{ post.content }}
          </p>
          <div class="flex items-center justify-between mt-2 pt-4 border-t border-light-gray-border">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-circular border border-steel-border flex items-center justify-center text-[13px] text-midnight-pine font-medium uppercase">
                {{ post.author?.charAt(0) || '?' }}
              </div>
              <span class="font-inter text-ash-gray text-[12px] sm:text-body-sm">{{ post.author || 'Anonimo' }}</span>
            </div>
            <div class="flex items-center gap-2 font-inter text-ash-gray text-[12px] sm:text-body-sm">
              <Calendar :size="16" />
              <span>{{ post.createdAt }}</span>
            </div>
          </div>
        </RouterLink>
      </div>

      <div v-else-if="!loading" class="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in">
        <div class="w-20 h-20 rounded-circular border border-light-gray-border flex items-center justify-center">
          <SearchX :size="32" class="text-ash-gray" />
        </div>
        <p class="font-inter text-ash-gray text-lg sm:text-subheading text-center leading-[1.35]">No encontramos articulos para esa busqueda.</p>
      </div>

      <div v-if="loading" class="flex flex-col gap-5 animate-pulse">
        <div v-for="i in 4" :key="i" class="bg-canvas-white border border-light-gray-border rounded-[20px] h-48" />
      </div>

      <PageNavigator v-if="paginated.totalPages > 1" :total="paginated.total" :page="paginated.page"
        :totalPages="paginated.totalPages" :changePage="changePage" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Search, Calendar, SearchX, LogIn } from 'lucide-vue-next'
import usePostStore from '@/store/post'
import PageNavigator from '@/components/molecules/PageNavigator.vue'

const postStore = usePostStore()
const { postPublic, paginated, loading } = storeToRefs(postStore)

const searchQuery = ref('')
let searchTimer: ReturnType<typeof setTimeout>

const quickTopics = ['Tendencias', 'Guias', 'Analisis', 'Producto', 'Cultura']

const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    paginated.value.page = 1
    fetchPosts()
  }, 500)
}

const changePage = (page: number) => {
  if (page < 1 || page > paginated.value.totalPages) return
  paginated.value.page = page
  fetchPosts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const fetchPosts = async () => {
  await postStore.getPostPublic(searchQuery.value)
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.card-spine {
  position: absolute;
  left: 16px;
  top: 24px;
  bottom: 24px;
  width: 4px;
  border-radius: 9999px;
  background: var(--color-forest-link);
  opacity: 0.2;
}
</style>