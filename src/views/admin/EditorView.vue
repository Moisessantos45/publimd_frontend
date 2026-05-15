<template>
  <div class="h-full flex flex-col w-full">
    <EditorHeader @save="handleClickSavePost" @open-full-view="openFullView" :isNewPost="isNewPost" />

    <div class="flex-1 flex flex-col md:flex-row min-h-0 w-full relative">
      <EditorPanel v-if="isNewPost || dataForm.permissionId > 1" class="panel-left"
        :style="{ '--left-width': leftWidth + 'px' }" :slug="slug" />

      <div v-if="isNewPost || dataForm.permissionId > 1"
        class="divider-drag hidden md:flex items-center justify-center cursor-col-resize w-2 bg-canvas-white hover:bg-light-gray-border/50 transition-colors z-10 shrink-0 border-x border-light-gray-border"
        @mousedown="startDrag">
        <div class="w-0.5 h-full bg-light-gray-border pointer-events-none"></div>
      </div>

      <div
        class="h-1/2 md:h-full flex flex-col bg-canvas-white border-t md:border-t-0 border-light-gray-border animate-slide-right min-w-0"
        :class="(isNewPost || dataForm.permissionId > 1) ? 'flex-1' : 'w-full'">

        <div class="h-10 border-b border-light-gray-border flex items-center px-4 bg-canvas-white shrink-0 gap-2">
          <Eye :size="13" stroke-width="1.8" class="text-ash-gray" />
          <span
            class="text-[11px] text-ash-gray font-inter font-medium tracking-[0.08em] uppercase select-none">Preview</span>
          <div class="flex-1"></div>
          <button @click="exportStore.downloadMarkdown" class="toolbar-btn toolbar-btn-lg" title="Descargar Markdown">
            <Download :size="16" stroke-width="1.8" />
          </button>
          <button @click="exportStore.downloadPreviewImage" class="toolbar-btn toolbar-btn-lg"
            title="Descargar Preview (PNG)">
            <ImageDown :size="16" stroke-width="1.8" />
          </button>
        </div>

        <div :ref="setPreviewRef"
          class="flex-1 overflow-y-auto p-8 prose prose-lg max-w-none prose-a:text-forest-link prose-headings:text-midnight-pine prose-headings:font-pp-mori prose-p:text-slate-text prose-p:font-inter prose-li:text-slate-text prose-li:font-inter prose-strong:text-midnight-pine prose-blockquote:bg-midnight-pine/5 prose-blockquote:border-l-4 prose-blockquote:border-forest-link prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:font-inter prose-blockquote:not-italic prose-blockquote:text-slate-text [&_pre]:bg-canvas-white [&_pre]:text-slate-text [&_pre]:border [&_pre]:border-light-gray-border [&_pre]:transition-colors [&_pre:hover]:border-forest-link [&_.hljs]:bg-transparent!"
          v-html="compiledMarkdown"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, onMounted, type ComponentPublicInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from "vue-toastification"
import { Eye, Download, ImageDown } from 'lucide-vue-next'
import usePostStore from '@/store/post'
import useMarkdownExportStore from '@/store/markdownExport'
import useWebSocketStore from '@/store/webSocket'
import { renderMarkdown, useMermaid } from '@/utils/markdown'
import EditorHeader from '@/features/components/EditorHeader.vue'
import EditorPanel from '@/features/components/EditorPanel.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const querySlug = route.query.slug || ''
const slug = typeof querySlug === 'string' ? querySlug : ''
const leftWidth = ref(300)
let dragging = false

const exportStore = useMarkdownExportStore()
const postStore = usePostStore()
const webSocketStore = useWebSocketStore()
const { dataForm, alertMessage } = storeToRefs(postStore)

const isNewPost = computed(() => {
  return !route.query.slug || dataForm.value.id === -1;
})

const setPreviewRef = (el: Element | ComponentPublicInstance | null) => {
  exportStore.previewRef = el instanceof HTMLDivElement ? el : null
}

const previewChannel = new BroadcastChannel('publimd:preview')

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'admin-posts' })
  }
}

const handleClickSavePost = async () => {
  let result;

  if (dataForm.value.id != -1 && typeof querySlug === 'string' && querySlug.length > 0) {
    webSocketStore.lockSave(slug);
    result = await postStore.updatePost(querySlug);
    if (result && result.isSuccess) {
      webSocketStore.unlockSave(slug);
      toast.success("Post actualizado correctamente");
    } else {
      toast.error(alertMessage.value || "Error al guardar el post");
    }
  } else {
    result = await postStore.addPost();
    if (result && result.isSuccess) {
      toast.success("Post creado correctamente");
      goBack();
    } else {
      toast.error(alertMessage.value || "Error al guardar el post");
    }
  }

  setTimeout(() => {
    webSocketStore.unlockSave(slug);
  }, 5000);
};

const broadcastContent = () => {
  previewChannel.postMessage({
    type: 'content',
    payload: dataForm.value.content,
  })
}

const compiledMarkdown = computed(() => {
  return renderMarkdown(dataForm.value.content)
})

useMermaid(compiledMarkdown)

watch(() => dataForm.value.content, () => {
  broadcastContent()
}, { immediate: true })

previewChannel.onmessage = (event) => {
  if (event.data?.type === 'request') {
    broadcastContent()
  }
}

const openFullView = (slug: string) => {
  const routeData = router.resolve({
    name: 'full',
    query: { slug },
  });
  window.open(routeData.href, '_blank', 'noopener,noreferrer');
};

const clearData = () => {
  dataForm.value.tags = [];
  postStore.clearForm();
  router.push({
    query: {
      ...route.query,
      raffle: undefined
    }
  });
};

const getData = () => {
  postStore.getStatePost();
  const slug = route.query.slug;
  if (slug && typeof slug === 'string') {
    postStore.getPostBySlug(slug)
  }
}

let startX = 0
let startWidth = 0

const onMouseMove = (e: MouseEvent) => {
  if (!dragging) return
  const deltaX = e.clientX - startX
  leftWidth.value = Math.max(150, Math.min(startWidth + deltaX, window.innerWidth - 150))
}

const stopDrag = () => {
  dragging = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDrag)
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
}

const startDrag = (e: MouseEvent) => {
  dragging = true
  startX = e.clientX
  startWidth = leftWidth.value
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopDrag)
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'col-resize'
}


const connectSocket = () => {
  if (typeof querySlug === 'string' && querySlug.length > 0) {
    webSocketStore.connect(querySlug)
  }
}

onMounted(() => {
  getData();
  connectSocket();
  if (window.innerWidth > 768) {
    leftWidth.value = window.innerWidth / 2;
  }
});

onBeforeUnmount(() => {
  clearData();
  previewChannel.close()
  webSocketStore.close()
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDrag)
})


</script>

<style scoped>
@media (min-width: 768px) {
  .panel-left {
    width: var(--left-width) !important;
    flex-shrink: 0;
  }
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: #71717a;
  transition: all 0.12s ease;
  flex-shrink: 0;
}

.toolbar-btn-lg {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  color: #a1a1aa;
  background: #2f2f34;
}

.toolbar-sep {
  width: 1px;
  height: 14px;
  background: #3e3e42;
  margin: 0 4px;
  flex-shrink: 0;
  opacity: 0.6;
}

/* Metadata panel slide transition */
.meta-slide-enter-active,
.meta-slide-leave-active {
  transition: max-height 0.22s ease, opacity 0.18s ease, padding 0.22s ease;
  overflow: hidden;
  max-height: 120px;
}

.meta-slide-enter-from,
.meta-slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
