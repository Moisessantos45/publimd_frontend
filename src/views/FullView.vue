<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center bg-canvas-white text-slate-text font-inter px-5 w-full">
    <svg class="animate-spin h-8 w-8 text-forest-link" xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
      </path>
    </svg>
    <span class="ml-2 font-inter text-body-sm">Cargando...</span>
  </div>
  <article v-else itemscope itemtype="https://schema.org/BlogPosting" class="min-h-screen flex flex-col bg-canvas-white text-slate-text font-inter px-5 sm:px-5 overflow-x-hidden">
    <header class="md:max-w-3xl mx-auto w-full min-w-0 px-4 sm:px-8 pt-6 sm:pt-9 pb-2 not-prose">

      <div v-if="postData.category" class="mb-4">
        <span itemprop="articleSection"
          class="inline-flex bg-transparent border border-forest-link text-xs sm:text-body-sm font-medium px-4 py-1.5 rounded-circular tracking-tight font-inter">
          {{ postData.category }}
        </span>
      </div>

      <h1 v-if="postData.title" itemprop="headline"
        class="font-pp-mori font-bold text-4xl sm:text-heading lg:text-display text-midnight-pine leading-[0.98] sm:leading-[0.95] tracking-tight mb-6 sm:mb-8">
        {{ postData.title }}
      </h1>

      <div class="flex flex-wrap items-center gap-3 font-inter text-xs sm:text-body-sm text-ash-gray mb-5 sm:mb-6">
        <div v-if="authorName" class="flex items-center gap-2" itemprop="author" itemscope itemtype="https://schema.org/Person">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="5" r="2.5" stroke="currentColor" stroke-width="1.4" />
            <path d="M2 12c0-2.21 2.239-4 5-4s5 1.79 5 4" stroke="currentColor" stroke-width="1.4"
              stroke-linecap="round" />
          </svg>
          <span itemprop="name" class="text-ash-gray">{{ authorName }}</span>
        </div>

        <span v-if="authorName && formattedDate" class="w-px h-4 bg-steel-border"></span>

        <div v-if="formattedDate" class="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4" />
            <path d="M1.5 5.5h11M4.5 1v3M9.5 1v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
          </svg>
          <span itemprop="datePublished">{{ formattedDate }}</span>
        </div>
      </div>

      <div v-if="postData.tags.length" class="flex flex-wrap gap-2 mb-8">
        <span v-for="tag in postData.tags" :key="tag"
          class="inline-flex items-center px-3 py-1.5 rounded-circular text-xs sm:text-body-sm font-medium bg-transparent text-ash-gray border border-steel-border font-inter">
          #{{ tag }}
        </span>
      </div>

      <div class="border-t-[3px] border-light-gray-border mb-4"></div>
      <button v-if="slug" @click="goBack"
        class="mt-2 flex items-center gap-2 text-ash-gray hover:text-midnight-pine transition-colors bg-transparent border border-light-gray-border hover:border-steel-border rounded-circular px-4 py-2 text-xs sm:text-body-sm font-inter font-medium">
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 3L5.5 6L8.5 9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <span>Regresar</span>
      </button>
    </header>

    <div itemprop="articleBody"
      class="md:max-w-3xl w-full mx-auto p-4 sm:p-8 min-w-0 overflow-x-hidden prose prose-sm sm:prose-lg wrap-break-word prose-a:text-forest-link prose-headings:text-midnight-pine prose-headings:font-pp-mori prose-p:text-slate-text prose-p:font-inter prose-li:text-slate-text prose-li:font-inter prose-strong:text-midnight-pine prose-blockquote:bg-midnight-pine/5 prose-blockquote:border-l-4 prose-blockquote:border-forest-link prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:font-inter prose-blockquote:not-italic prose-blockquote:text-slate-text [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:bg-canvas-white [&_pre]:text-slate-text [&_pre]:border [&_pre]:border-light-gray-border [&_pre]:transition-colors [&_pre:hover]:border-forest-link [&_code]:wrap-break-word [&_img]:max-w-full [&_img]:h-auto [&_svg]:max-w-full [&_iframe]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_.hljs]:bg-transparent!"
      v-html="compiledMarkdown"></div>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import usePostStore from '@/store/post'
import { renderMarkdown } from '../utils/markdown'

const route = useRoute()
const router = useRouter()
const querySlug = route.params.slug || ""
const slug = typeof querySlug === 'string' ? querySlug.trim() : ""

const postStore = usePostStore()

const { dataForm, postInfoDetailed, loading } = storeToRefs(postStore)

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'home' })
  }
}

const getData = async () => {
  if (!slug) return
  await postStore.getPostInfoDetailed(slug)
}

const postData = computed(() => {
  return dataForm.value || postInfoDetailed.value || {}
})

const compiledMarkdown = computed(() => {
  return renderMarkdown(dataForm.value.content || postInfoDetailed.value.content || '')
})

const authorName = computed(() => {
  return postInfoDetailed.value.author ?? ""
})

const formattedDate = computed(() => {
  const raw = dataForm.value.createdAt || postInfoDetailed.value.createdAt
  if (!raw) return ''
  return new Date(raw).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
})



const previewChannel = new BroadcastChannel('publimd:preview')

previewChannel.onmessage = (event) => {
  if (typeof slug === 'string' && slug.trim() !== "") return
  if (event.data?.type === 'content') {
    dataForm.value.content = event.data.payload ?? ''
  }
}

onMounted(() => {
  previewChannel.postMessage({ type: 'request' })
  getData()
})

onBeforeUnmount(() => {
  previewChannel.close()
})

</script>