<template>
    <nav v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-5 sm:px-1 px-5">
        <button id="prev-page" :disabled="page <= 1"
            class="flex items-center gap-2 bg-transparent border border-light-gray-border rounded-circular sm:px-5 px-2 sm:py-2.5 py-2 text-body-sm text-ash-gray hover:text-midnight-pine hover:border-steel-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-inter"
            @click="changePage(page - 1)">
            <ChevronLeft :size="18" />
            Anterior
        </button>

        <div class="flex items-center gap-1">
            <button v-for="page in visiblePages" :key="page" :id="`page-${page}`"
                class="w-11 h-11 rounded-circular text-body-sm font-medium transition-colors font-inter flex items-center justify-center"
                :class="page === page
                    ? 'bg-transparent text-forest-link border border-forest-link'
                    : 'bg-transparent border border-transparent text-ash-gray hover:border-light-gray-border hover:text-midnight-pine'"
                @click="changePage(page)">
                {{ page }}
            </button>
        </div>

        <button id="next-page" :disabled="page >= totalPages"
            class="flex items-center gap-2 bg-transparent border border-light-gray-border rounded-circular sm:px-5 px-2 sm:py-2.5 py-2 text-body-sm text-ash-gray hover:text-midnight-pine hover:border-steel-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-inter"
            @click="changePage(page + 1)">
            Siguiente
            <ChevronRight :size="18" />
        </button>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
    total: number;
    page: number;
    totalPages: number;
    changePage: (page: number) => void;
}>();


const visiblePages = computed(() => {
    const total = props.totalPages
    const current = props.page
    const pages: number[] = []
    const delta = 2
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
        pages.push(i)
    }
    return pages
})


</script>