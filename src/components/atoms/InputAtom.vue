<template>
    <input v-model="model" v-bind="$attrs"
        class="block w-full px-3.5 py-2.5 border border-light-gray-border rounded-lg text-slate-text bg-transparent hover:border-forest-link/50 focus:bg-canvas-white focus:outline-none focus:ring-1 focus:ring-forest-link/20 focus:border-forest-link/50 placeholder:text-ash-gray/60 text-sm font-inter transition-all duration-150 caret-forest-link [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#ffffff_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:#334155]" />
</template>

<script setup lang="ts">
const model = defineModel<string | number>();
</script>
