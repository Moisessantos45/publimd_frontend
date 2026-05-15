<template>
    <div :class="['flex items-center gap-3 border-b py-2 border-background-light', margin]">
        <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold',
            color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary']">
            <slot name="icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            </slot>
        </div>
        <h3 class="text-sm font-bold text-primary uppercase tracking-wide">{{ title }}</h3>
    </div>
</template>

<script setup lang="ts">
interface Props {
    title: string;
    color?: 'primary' | 'secondary';
    margin?: string
}

withDefaults(defineProps<Props>(), { color: 'primary' });
</script>
