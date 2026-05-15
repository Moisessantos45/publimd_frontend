<template>
    <main class="h-full flex flex-col md:flex-row bg-canvas-white text-slate-text font-inter">
        <!-- <slot name="header" /> -->
        <slot name="aside" />

        <section class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <div class="h-14 flex items-center px-5 md:px-8 border-b border-light-gray-border bg-canvas-white">
                <h1 class="text-midnight-pine font-semibold font-pp-mori text-lg">
                    {{ title }}</h1>
            </div>
            <div class="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
                <slot />
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">

defineProps<{ title: string }>();
defineEmits(['closeSidebar']);

// const isDesktop = ref(false);

// function checkDesktop() {
//     isDesktop.value = window.innerWidth >= 896;
// }

// onMounted(() => {
//     checkDesktop();
//     window.addEventListener('resize', checkDesktop);
// });

// onBeforeUnmount(() => {
//     window.removeEventListener('resize', checkDesktop);
// });
</script>
