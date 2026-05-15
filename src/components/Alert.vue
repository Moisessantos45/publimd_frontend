<template>
    <div :class="[
        'text-center p-3 rounded-lg border uppercase font-bold text-xs tracking-wider mt-2 mb-2',

        error
            ? 'bg-red-50 text-red-600 border-red-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
    ]">
        {{ msg }}
    </div>
</template>

<script setup lang="ts">

defineProps<{
    error: boolean;
    msg: string;
}>();
</script>