<template>
  <div
    class="h-12 border-b border-light-gray-border flex items-center justify-between px-3 md:px-5 shrink-0 bg-canvas-white animate-fade-in w-full gap-2">
    <div class="flex items-center gap-2 md:gap-2.5 shrink-0">
      <RouterLink to="/admin/posts"
        class="inline-flex items-center gap-2 rounded-circular border border-light-gray-border bg-canvas-white px-3 py-2 text-sm font-medium text-ash-gray transition-colors hover:border-steel-border hover:text-midnight-pine hover:bg-light-gray-border/20 shrink-0 justify-self-start">
        <ArrowLeft :size="16" />
        <span>Volver</span>
      </RouterLink>
    </div>

    <nav
      class="flex items-center bg-light-gray-border/20 rounded-circular p-0.5 border border-light-gray-border shrink-0 font-inter">
      <RouterLink to="/admin/editor"
        class="px-2.5 md:px-3.5 py-1 rounded-circular text-[11px] md:text-[12px] font-medium tracking-wide transition-all duration-150 text-ash-gray hover:text-midnight-pine"
        active-class="!bg-white !text-midnight-pine shadow-sm">Editor</RouterLink>
      <button @click="$emit('open-full-view', 'preview')" type="button"
        class="px-2.5 md:px-3.5 py-1 rounded-circular text-[11px] md:text-[12px] font-medium tracking-wide transition-all duration-150 text-ash-gray hover:text-midnight-pine"
        active-class="!bg-white !text-midnight-pine shadow-sm">Full View</button>
    </nav>

    <div class="shrink-0 scale-90 md:scale-100 origin-right flex items-center gap-3">
      <CollaboratorAvatars />
      <button v-if="isNewPost || dataForm.permissionId > 1" @click="$emit('save')" :disabled="lock"
        :class="['text-white px-3 py-1 rounded-circular text-[12px] font-medium transition-colors shadow-sm',
          lock ? 'opacity-50 cursor-not-allowed bg-light-gray-border/50 text-slate-text' : 'bg-forest-link hover:bg-forest-link/90']">
        {{ isNewPost ? 'Create Post' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CollaboratorAvatars from './CollaboratorAvatars.vue'
import usePostStore from '@/store/post'
import { storeToRefs } from 'pinia'
import { ArrowLeft } from 'lucide-vue-next'

defineProps<{
  isNewPost: boolean;
}>()

const postStore = usePostStore()
const { dataForm, lock } = storeToRefs(postStore)

defineEmits<{
  (e: 'save'): void
  (e: 'open-full-view', view: string): void
}>()
</script>
