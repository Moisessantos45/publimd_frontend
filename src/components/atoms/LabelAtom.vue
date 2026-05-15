<template>
    <label :for="id" class="block text-[11px] font-semibold text-ash-gray font-inter uppercase tracking-widest mb-1.5">
        {{ label }}
    </label>
</template>

<script setup lang="ts">
interface Props {
    label: string;
    id: string;
}
defineProps<Props>();
</script>
