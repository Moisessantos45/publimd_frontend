<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="hidden" class="fixed inset-0 z-50 flex items-center justify-center p-4"
                @mousedown.self="$emit('cancel')">
                <div class="absolute inset-0 bg-ink-primary/30 backdrop-blur-[2px]"></div>

                <Transition enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 scale-95 -translate-y-2"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 -translate-y-2">
                    <div v-if="hidden" class="relative z-10 bg-white border border-neutral-gray/20 rounded-[14px]
                               shadow-[0_24px_64px_rgba(0,58,153,0.14)] flex flex-col overflow-hidden"
                        :style="{ width: width, maxWidth: '100%', maxHeight: '90vh' }">
                        <div
                            class="flex items-center justify-between px-6 py-4 border-b border-neutral-gray/15 shrink-0">
                            <h2 class="text-[0.9rem] font-extrabold text-ink-primary tracking-tight m-0">{{ title }}
                            </h2>
                            <button @click="$emit('cancel')"
                                class="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted
                                       transition-colors hover:bg-background-light hover:text-ink-primary outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                    stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div class="overflow-y-auto flex-1 p-6">
                            <slot />
                        </div>

                        <div v-if="!hideFooter"
                            class="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-neutral-gray/15 bg-background-light shrink-0">
                            <button @click="$emit('cancel')"
                                class="px-4 py-2 rounded-lg text-[0.78rem] font-bold
                                       text-ink-muted bg-white border border-neutral-gray/25
                                       transition-all hover:border-neutral-gray/50 hover:text-ink-primary outline-none">
                                {{ cancelLabel }}
                            </button>
                            <button @click="$emit('confirm')" :disabled="disabled" :class="[
                                'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[0.82rem] font-bold text-white bg-primary border-none shrink-0 shadow-[0_2px_8px_rgba(0,58,153,0.22)] transition-all hover:bg-secondary hover:shadow-[0_4px_16px_rgba(0,178,227,0.3)] active:scale-[0.97] outline-none',
                            ]">
                                {{ confirmLabel }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
defineProps({
    hidden: { type: Boolean, default: false },
    title: { type: String, default: '' },
    cancelLabel: { type: String, default: 'Cancelar' },
    confirmLabel: { type: String, default: 'Aceptar' },
    hideFooter: { type: Boolean, default: false },
    width: { type: String, default: '520px' },
    disabled: { type: Boolean, default: false },
});

defineEmits(['cancel', 'confirm']);
</script>
