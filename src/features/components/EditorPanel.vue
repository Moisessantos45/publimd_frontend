<template>
    <div class="w-full h-1/2 md:h-full flex flex-col bg-canvas-white animate-slide-left">
        <EditorToolbar />

        <div class="px-5 pt-3.5 pb-2.5 border-b border-light-gray-border shrink-0 flex items-center gap-2">
            <input v-model="dataForm.title" type="text" placeholder="Post title…"
                class="flex-1 bg-transparent focus:bg-canvas-white border border-light-gray-border focus:border-forest-link/50 px-3 py-1.5 rounded-[10px] transition-colors text-midnight-pine font-pp-mori text-base font-semibold outline-none placeholder:text-ash-gray/50 caret-forest-link min-w-0" />
            <button type="button" @click="isMetaOpen = !isMetaOpen"
                :title="isMetaOpen ? 'Hide post settings' : 'Show post settings'"
                class="shrink-0 w-6 h-6 flex items-center justify-center rounded-md transition-colors"
                :class="isMetaOpen ? 'text-forest-link bg-forest-link/10' : 'text-ash-gray hover:text-midnight-pine hover:bg-light-gray-border/30'">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="1.4" />
                    <path
                        d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.6 2.6l1.06 1.06M10.34 10.34l1.06 1.06M2.6 11.4l1.06-1.06M10.34 3.66l1.06-1.06"
                        stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
                </svg>
            </button>
        </div>

        <Transition name="meta-slide">
            <div v-if="isMetaOpen"
                class="px-5 py-2.5 border-b border-light-gray-border shrink-0 flex flex-wrap items-center gap-2">
                <input v-model="dataForm.category" type="text" placeholder="Category"
                    class="bg-transparent focus:bg-canvas-white border border-light-gray-border focus:border-forest-link/50 transition-colors text-slate-text font-inter text-[12px] px-2.5 py-1.5 rounded-md outline-none focus:ring-1 focus:ring-forest-link/20 placeholder:text-ash-gray/60 w-28" />

                <div
                    class="flex-1 min-w-35 bg-transparent focus-within:bg-canvas-white border border-light-gray-border focus-within:border-forest-link/50 rounded-md px-2 py-1 flex flex-wrap items-center gap-1 focus-within:ring-1 focus-within:ring-forest-link/20 transition-shadow">
                    <span v-for="(tag, i) in dataForm.tags" :key="i"
                        class="inline-flex items-center gap-1 bg-forest-link/10 text-forest-link text-[10px] font-medium px-1.5 py-0.5 rounded-circular border border-forest-link/20 select-none">
                        {{ tag }}
                        <button type="button" @click="removeTag(i)"
                            class="text-forest-link/60 hover:text-red-500 transition-colors leading-none focus:outline-none">
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                                <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </span>
                    <div class="flex items-center gap-1 flex-1 min-w-15">
                        <input v-model="tagInput" @keydown.enter.prevent="addTag" @keydown.tab.prevent="addTag"
                            @keydown.backspace="onTagBackspace" type="text" placeholder="Add tag…"
                            class="bg-transparent text-slate-text font-inter text-[11px] outline-none placeholder:text-ash-gray/50 flex-1 min-w-12 py-0.5" />
                        <button v-if="tagInput.trim()" type="button" @click="addTag"
                            class="text-forest-link hover:text-forest-link/80 transition-colors shrink-0 flex items-center justify-center w-4 h-4">
                            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                <path d="M5 1V9M1 5H9" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="relative">
                    <button type="button" @click="isStatusSelectOpen = !isStatusSelectOpen"
                        class="bg-transparent hover:bg-light-gray-border/20 text-slate-text font-inter text-[12px] px-2.5 py-1.5 rounded-md outline-none focus:ring-1 focus:ring-forest-link/20 border border-light-gray-border focus:border-forest-link/50 flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap">
                        <span>{{statePost.find(o => o.id === dataForm.stateId)?.name}}</span>
                        <ChevronDown :size="12" class="text-ash-gray transition-transform duration-200"
                            :class="{ 'rotate-180': isStatusSelectOpen }" />
                    </button>
                    <div v-if="isStatusSelectOpen" class="fixed inset-0 z-40" @click="isStatusSelectOpen = false"></div>
                    <div v-if="isStatusSelectOpen"
                        class="absolute z-50 right-0 mt-1 w-28 bg-canvas-white border border-light-gray-border rounded-md shadow-lg py-1 overflow-hidden animate-fade-in">
                        <button v-for="option in statePost" :key="option.id" type="button"
                            @click="dataForm.stateId = option.id; isStatusSelectOpen = false"
                            class="w-full text-left px-3 py-1.5 text-[12px] font-inter transition-colors duration-150"
                            :class="dataForm.stateId === option.id ? 'bg-forest-link/10 text-forest-link' : 'text-ash-gray hover:bg-light-gray-border/20 hover:text-midnight-pine'">
                            {{ option.name }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <textarea :ref="setPreviewRef" v-model="dataForm.content" @beforeinput="markdownStore.handleBeforeInput(($event.target as HTMLTextAreaElement).value)"
            @input="sendMessageSocket"
            class="flex-1 w-full bg-transparent text-slate-text p-6 resize-none outline-none font-['JetBrains_Mono',monospace] text-[14px] leading-[1.75] tracking-[0.01em] placeholder:text-ash-gray/60 caret-forest-link/70"
            spellcheck="false" placeholder="Escribe markdown aquí..."></textarea>

        <div class="h-6 border-t border-light-gray-border flex items-center px-4 bg-canvas-white shrink-0 gap-4">
            <span class="text-[10px] text-ash-gray font-inter tracking-wider uppercase">Markdown</span>
            <div class="flex-1"></div>
            <span
                class="text-[10px] text-ash-gray font-inter tabular-nums transition-opacity duration-300">
                {{ wordCount }} palabras
            </span>
            <span
                class="text-[10px] text-ash-gray font-inter tabular-nums transition-opacity duration-300">
                {{ charCount }} chars
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, type ComponentPublicInstance } from 'vue'
import { storeToRefs } from 'pinia';
import { ChevronDown } from 'lucide-vue-next'
import EditorToolbar from '@/features/components/EditorToolbar.vue'
import usePostStore from '@/store/post';
import useMarkdownStore from '@/store/markdown';

const props = defineProps<{
    slug?: string
}>()

const postStore = usePostStore()
const markdownStore = useMarkdownStore()
const { dataForm, statePost } = storeToRefs(postStore)
const { previousValue, editor } = storeToRefs(markdownStore)

const isStatusSelectOpen = ref(false)
const isMetaOpen = ref(false)
const tagInput = ref('')

watch(() => dataForm.value.content, () => {
    editor.value = dataForm.value.content
}, { immediate: true })

const setPreviewRef = (el: Element | ComponentPublicInstance | null) => {
    markdownStore.textareaRef = el instanceof HTMLTextAreaElement ? el : null
}

const addTag = () => {
    const value = tagInput.value.trim().replace(/,+$/, '')
    if (!value) return
    const newTags = value.split(',').map(t => t.trim()).filter(Boolean)
    for (const t of newTags) {
        if (!dataForm.value.tags.includes(t)) dataForm.value.tags.push(t)
    }
    tagInput.value = ''
}

const removeTag = (index: number) => {
    dataForm.value.tags.splice(index, 1)
}

const onTagBackspace = () => {
    if (tagInput.value === '' && dataForm.value.tags.length > 0) {
        dataForm.value.tags.pop()
    }
}

const wordCount = computed(() => {
    const text = dataForm.value.content.trim()
    if (!text) return 0
    return text.split(/\s+/).length
})

const charCount = computed(() => dataForm.value.content.length)

const sendMessageSocket = (e: Event) => {
    if (!props.slug) {
        // console.warn("Slug is required to send WebSocket messages")
        return;
    }

    markdownStore.handleInput(props.slug, (e.target as HTMLTextAreaElement).value)
}

onMounted(() => {
    previousValue.value = editor.value
})
</script>