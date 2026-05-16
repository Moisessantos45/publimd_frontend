<template>
  <div class="min-h-full flex flex-col bg-canvas-white text-slate-text font-inter relative overflow-x-hidden">
    <header aria-label="Cabecera principal"
      class="w-full sm:max-w-6xl mx-auto px-6 py-5 flex items-center justify-between z-20 relative bg-canvas-white/80 backdrop-blur-md top-0 border-b border-light-gray-border/50">
      <div class="flex items-center gap-8">
        <div
          class="flex items-center gap-2 text-midnight-pine font-bold text-xl sm:text-2xl font-pp-mori tracking-tight">
          <Cloud class="w-7 h-7 sm:w-8 sm:h-8 text-midnight-pine fill-current" />
          <span>Publimd</span>
        </div>
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-ash-gray font-inter">
          <!-- <a href="#" class="hover:text-midnight-pine transition-colors">Noticias</a>
          <a href="#" class="hover:text-midnight-pine transition-colors">FAQs</a> -->
          <div class="flex items-center gap-1 hover:text-midnight-pine transition-colors cursor-pointer">
            Desarrolladores
            <ChevronDown class="w-4 h-4" />
          </div>
        </nav>
      </div>
      <div class="flex items-center gap-4 sm:gap-6">
        <!-- <a href="#"
          class="hidden sm:flex items-center gap-2 text-sm font-medium text-ash-gray hover:text-midnight-pine transition-colors font-inter">
          <Headset class="w-4 h-4" />
          Soporte
        </a> -->
        <RouterLink to="/register"
          class="bg-[#12d39d] hover:bg-[#0fb889] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-colors font-inter shadow-sm hover:shadow-md">
          Crear cuenta
        </RouterLink>
      </div>
    </header>

    <section class="relative w-full flex flex-col items-center pt-20 pb-24 px-4 text-center z-10">
      <div
        class="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-[-1] opacity-30">
        <svg class="absolute w-[200%] sm:w-[150%] md:w-full max-w-none h-auto text-light-gray-border"
          style="min-width: 1000px;" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="500" r="150" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
          <circle cx="500" cy="500" r="250" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
          <circle cx="500" cy="500" r="350" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
          <circle cx="500" cy="500" r="450" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
          <circle cx="500" cy="500" r="550" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
        </svg>
      </div>

      <div class="flex flex-col items-center max-w-4xl mx-auto animate-fade-in">
        <div class="mb-8">
          <Cloud class="w-20 h-20 sm:w-24 sm:h-24 text-midnight-pine fill-current" />
        </div>

        <h1
          class="font-pp-mori font-bold text-4xl sm:text-5xl md:text-heading-lg text-midnight-pine tracking-tight leading-[1.1] mb-6">
          Crea posts con Markdown
          <br class="hidden sm:block" />
          de forma sencilla y colaborativa
        </h1>

        <p class="font-inter text-base sm:text-xl text-ash-gray max-w-2xl mx-auto mb-10 leading-relaxed">
          Escribe contenido en Markdown fácilmente, trabaja en equipo con otros colaboradores y publica tus posts en
          tiempo real.
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-7/12 px-4 sm:px-0">
          <RouterLink to="/login"
            class="w-full flex items-center justify-center gap-2 bg-canvas-white border border-light-gray-border text-midnight-pine px-7 sm:px-8 py-3.5 rounded-full text-sm font-medium hover:border-ash-gray hover:bg-gray-50 transition-colors font-inter shadow-sm">
            Iniciar sesión
            <LogIn class="w-4 h-4 text-ash-gray" />
          </RouterLink>
          <RouterLink to="/register"
            class="w-full flex items-center justify-center gap-2 bg-[#12d39d] hover:bg-[#0fb889] text-white px-7 sm:px-8 py-3.5 rounded-full text-sm font-medium transition-colors font-inter shadow-sm hover:shadow-md">
            Empezar a escribir
            <ArrowUpRight class="w-4 h-4 opacity-70" />
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="w-full relative flex flex-col items-center">
      <div class="w-full border-t border-dashed border-light-gray-border relative">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas-white px-6">
          <h2 class="text-xl sm:text-2xl font-bold text-midnight-pine font-pp-mori tracking-tight">Todo-en-uno Publimd
          </h2>
        </div>
      </div>

      <div class="w-full max-w-3xl mx-auto px-4 mt-16 mb-12 relative z-10">
        <div
          class="relative w-full shadow-sm hover:shadow-md transition-shadow duration-300 rounded-full bg-canvas-white">
          <Search class="absolute left-6 top-1/2 -translate-y-1/2 text-ash-gray w-5 h-5" />
          <input id="hero-search" v-model="searchQuery" type="text" placeholder="Buscar artículos, temas, autores..."
            class="w-full bg-transparent border border-light-gray-border rounded-full py-4 sm:py-5 pl-14 pr-16 text-base text-midnight-pine placeholder:text-ash-gray outline-none focus:border-[#12d39d] focus:ring-1 focus:ring-[#12d39d] transition-all"
            @input="onSearch" />
          <kbd
            class="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 bg-gray-50 border border-light-gray-border rounded-md px-2 py-1 text-xs text-ash-gray font-inter font-medium">
            ⌘K
          </kbd>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-2 pt-6">
          <span class="text-sm font-medium text-ash-gray mr-2">Lecturas destacadas:</span>
          <span v-for="topic in quickTopics" :key="topic"
            class="bg-canvas-white text-ash-gray border border-light-gray-border text-xs sm:text-sm px-4 py-1.5 rounded-full font-inter hover:border-[#12d39d] hover:text-[#12d39d] transition-colors cursor-pointer"
            @click="searchQuery = topic; onSearch()">
            {{ topic }}
          </span>
        </div>
      </div>
    </section>

    <main class="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-6 pb-20 flex flex-col gap-8 relative z-10">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-4 gap-3">
        <div class="flex flex-col gap-2">
          <h2 class="font-pp-mori text-2xl sm:text-3xl font-bold text-midnight-pine tracking-tight">Portada de artículos
          </h2>
          <p class="font-inter text-sm sm:text-base text-ash-gray">
            <span v-if="searchQuery">
              Resultados para <span class="text-midnight-pine font-medium">"{{ searchQuery }}"</span> —
            </span>
            <span class="text-midnight-pine font-medium">{{ paginated.total }}</span> artículos encontrados
          </p>
        </div>
        <span
          class="font-inter text-xs sm:text-sm text-ash-gray bg-gray-50 px-3 py-1 rounded-full border border-light-gray-border">
          Página {{ paginated.page }} de {{ paginated.totalPages }}
        </span>
      </div>

      <div v-if="postPublic.length > 0" class="flex flex-col gap-6 animate-fade-in" itemscope
        itemtype="https://schema.org/ItemList">
        <RouterLink v-for="post in postPublic" :key="post.id" :to="{ name: 'full-post', params: { slug: post.slug } }"
          itemprop="itemListElement" itemscope itemtype="https://schema.org/BlogPosting"
          class="group relative bg-canvas-white border border-light-gray-border rounded-3xl p-6 sm:p-8 hover:border-[#12d39d] hover:shadow-md transition-all duration-300 flex flex-col gap-5 no-underline">
          <div class="flex items-center gap-2 flex-nowrap overflow-x-auto sm:flex-wrap sm:overflow-visible">
            <span itemprop="articleSection"
              class="bg-[#12d39d]/10 text-[#0fb889] text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full tracking-wide font-inter whitespace-nowrap uppercase">
              {{ post.category || 'General' }}
            </span>
            <span v-for="tag in post.tags.slice(0, 3)" :key="tag"
              class="bg-gray-50 text-ash-gray border border-light-gray-border text-[11px] sm:text-xs px-3 py-1 rounded-full font-inter whitespace-nowrap">
              #{{ tag }}
            </span>
          </div>
          <h3 itemprop="headline"
            class="font-pp-mori font-bold text-2xl leading-tight text-midnight-pine group-hover:text-[#12d39d] transition-colors line-clamp-2 tracking-tight">
            {{ post.title.toUpperCase() }}
          </h3>
          <p itemprop="abstract" class="font-inter text-base text-ash-gray leading-relaxed line-clamp-3">
            {{ post.content }}
          </p>
          <div class="flex items-center justify-between mt-2 pt-5 border-t border-light-gray-border/50">
            <div class="flex items-center gap-3" itemprop="author" itemscope itemtype="https://schema.org/Person">
              <div
                class="w-9 h-9 rounded-full bg-gray-50 border border-light-gray-border flex items-center justify-center text-sm text-midnight-pine font-bold uppercase shadow-sm">
                {{ post.author?.charAt(0) || '?' }}
              </div>
              <span itemprop="name" class="font-inter text-midnight-pine font-medium text-sm">{{ post.author ||
                'Anónimo' }}</span>
            </div>
            <div class="flex items-center gap-2 font-inter text-ash-gray text-sm">
              <Calendar class="w-4 h-4" />
              <span itemprop="datePublished">{{ post.createdAt }}</span>
            </div>
          </div>
        </RouterLink>
      </div>

      <div v-else-if="!loading"
        class="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in bg-canvas-white border border-light-gray-border rounded-3xl">
        <div class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
          <SearchX class="w-8 h-8 text-ash-gray" />
        </div>
        <p class="font-inter text-ash-gray text-lg sm:text-xl text-center leading-relaxed">No encontramos<br />artículos
          para esa búsqueda.</p>
      </div>

      <div v-if="loading" class="flex flex-col gap-6 animate-pulse">
        <div v-for="i in 4" :key="i" class="bg-canvas-white border border-light-gray-border rounded-3xl h-56" />
      </div>

      <PageNavigator v-if="paginated.totalPages > 1" :total="paginated.total" :page="paginated.page"
        :totalPages="paginated.totalPages" :changePage="changePage" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Search, Calendar, SearchX, Cloud, ChevronDown, LogIn, ArrowUpRight } from 'lucide-vue-next'
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
  document.title = "publimd — Editor Markdown en tiempo real";
  document.querySelector('meta[name="description"]')?.setAttribute("content", "Sitio web para crear posts tipo blog usando contenido Markdown (MD). Permite trabajar con colaboradores y publicar en tiempo real.");
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