<template>
    <div
        class="h-10 border-b border-light-gray-border flex items-center px-2 bg-canvas-white shrink-0 gap-0.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button class="toolbar-btn" title="Deshacer">
            <Undo :size="14" stroke-width="1.8" />
        </button>
        <button class="toolbar-btn" title="Rehacer">
            <Redo :size="14" stroke-width="1.8" />
        </button>

        <div class="toolbar-sep"></div>

        <button @click="insertFrontmatter" class="toolbar-btn" title="Añadir Metadatos">
            <FileText :size="14" stroke-width="1.8" />
        </button>

        <div class="toolbar-sep"></div>

        <button @click="insertFormat('**', '**')" class="toolbar-btn" title="Negrita">
            <Bold :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('*', '*')" class="toolbar-btn" title="Cursiva">
            <Italic :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('~~', '~~')" class="toolbar-btn" title="Tachado">
            <Strikethrough :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('### ')" class="toolbar-btn" title="Título">
            <Heading :size="14" stroke-width="1.8" />
        </button>

        <div class="toolbar-sep"></div>

        <button @click="insertFormat('`', '`')" class="toolbar-btn" title="Código">
            <Code :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('> ')" class="toolbar-btn" title="Cita">
            <Quote :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('- ')" class="toolbar-btn" title="Lista">
            <List :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('1. ')" class="toolbar-btn" title="Lista numerada">
            <ListOrdered :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('- [ ] ')" class="toolbar-btn" title="Tarea">
            <CheckSquare :size="14" stroke-width="1.8" />
        </button>

        <div class="toolbar-sep"></div>

        <button @click="insertFormat('[', '](url)')" class="toolbar-btn" title="Enlace">
            <Link :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('![alt](', ')')" class="toolbar-btn" title="Imagen">
            <Image :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('\n| Header | Header |\n| ------ | ------ |\n| Cell | Cell |\n')"
            class="toolbar-btn" title="Tabla">
            <Table :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('\n---\n')" class="toolbar-btn" title="Línea">
            <Minus :size="14" stroke-width="1.8" />
        </button>

        <button @click="insertFormat('$', '$')" class="toolbar-btn" title="Fórmula Matemática">
            <Sigma :size="14" stroke-width="1.8" />
        </button>
        <button @click="insertFormat('\n```mermaid\ngraph TD\n  A-->B;\n```\n')" class="toolbar-btn"
            title="Diagrama Mermaid">
            <Workflow :size="14" stroke-width="1.8" />
        </button>

        <div class="toolbar-sep"></div>

        <button class="toolbar-btn" title="Comentario">
            <MessageSquare :size="14" stroke-width="1.8" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { storeToRefs } from 'pinia';
import {
    Undo, Redo, Bold, Italic, Strikethrough, Heading,
    Code, Quote, List, ListOrdered, CheckSquare,
    Link, Image, Table, Minus, MessageSquare,
    Sigma, Workflow, FileText
} from 'lucide-vue-next'
import usePostStore from '@/store/post';
import useMarkdownStore from '@/store/markdown';

const markdownStore = useMarkdownStore();
const postStore = usePostStore()
const { dataForm } = storeToRefs(postStore)
const { editorRef } = storeToRefs(markdownStore)

const insertFormat = (before: string, after: string = '') => {
    if (!editorRef.value) return

    const textarea = editorRef.value
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const text = dataForm.value.content
    const selection = text.substring(start, end)

    const newText = text.substring(0, start) + before + selection + after + text.substring(end)
    dataForm.value.content = newText

    nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, start + before.length + selection.length)
    })
}

const insertFrontmatter = () => {
    const date = new Date().toISOString().split('T')[0]
    const template = `---\ntitle: \nauthor: \ntags: []\ndate: ${date}\n---\n\n`
    dataForm.value.content = template + dataForm.value.content
    nextTick(() => {
        if (editorRef.value) {
            editorRef.value.focus()
            editorRef.value.setSelectionRange(11, 11)
        }
    })
}
</script>


<style>
.divider {
  width: 2px;
  background: var(--color-light-gray-border);
  flex-shrink: 0;
  align-self: stretch;
  opacity: 0.7;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: var(--color-ash-gray);
  transition: all 0.12s ease;
  flex-shrink: 0;
}

.toolbar-btn-lg {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  color: var(--color-ash-gray);
  background: rgba(214, 214, 214, 0.2);
}

.toolbar-btn:hover {
  background: rgba(214, 214, 214, 0.4);
  color: var(--color-midnight-pine);
  transform: translateY(-1px);
}

.toolbar-btn:active {
  transform: scale(0.9) translateY(0);
  background: rgba(214, 214, 214, 0.6);
}

.toolbar-sep {
  width: 1px;
  height: 14px;
  background: var(--color-light-gray-border);
  margin: 0 4px;
  flex-shrink: 0;
  opacity: 0.6;
}
</style>
