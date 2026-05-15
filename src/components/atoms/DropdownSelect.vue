<template>
    <div class="w-full relative font-inter" ref="containerRef">
        <button ref="buttonRef" type="button"
            class="w-full px-3.5 py-2.5 border border-light-gray-border rounded-[10px] text-midnight-pine bg-canvas-white hover:border-forest-link/30 focus:bg-canvas-white focus:outline-none focus:ring-1 focus:ring-forest-link/20 focus:border-forest-link/40 text-sm transition-all duration-150 outline-none flex items-center justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            @click="isShow = !isShow" :disabled="disabled">
            <span :class="{ 'text-ash-gray': selectedOption?.name.trim() === '' }">
                {{
                    selectedOption?.name.trim() !== ""
                        ? selectedOption.name
                        : placeholder || "Selecciona un valor..."
                }}
            </span>
            <svg class="w-4 h-4 text-ash-gray transition-transform duration-150"
                :class="{ 'rotate-180': isShow }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <teleport to="body">
            <div v-if="isShow" ref="dropdownMenu"
                class="absolute z-999 w-full bg-canvas-white border border-light-gray-border rounded-[10px] shadow-lg mt-1 py-1 overflow-hidden font-inter"
                :style="dropdownStyles">
                <div class="max-h-60 overflow-y-auto dropdown-scroll">
                    <button v-for="item in list" :key="item.value" type="button"
                        class="w-full px-3.5 py-2.5 text-left text-sm text-slate-text hover:bg-light-gray-border/20 hover:text-midnight-pine focus:bg-light-gray-border/20 focus:text-midnight-pine focus:outline-none transition-colors duration-100"
                        :class="{
                            'bg-forest-link/10 text-forest-link font-medium': selectedOption?.name === item.name,
                        }" @click="changeValue(item)">
                        {{ item.name }}
                    </button>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";

export interface OptionalField {
    name: string;
    value: string | number;
}

const isShow = ref(false);
const option = {
    name: "",
    value: "",
};

const selectedOption = ref<OptionalField>(option);
const dropdownStyles = ref({});
const buttonRef = ref<HTMLElement | null>(null);

const props = defineProps<{
    list: OptionalField[];
    initialValue?: string;
    disabled?: boolean;
    placeholder?: string;
}>();

const emits = defineEmits<{
    (e: "change", value: OptionalField): void;
}>();

const changeValue = (value: OptionalField) => {
    selectedOption.value = value;
    emits("change", value);
    isShow.value = false;
};

watch(isShow, async (val) => {
    if (val) {
        await nextTick();
        const rect = buttonRef.value?.getBoundingClientRect();
        if (rect) {
            dropdownStyles.value = {
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                width: `${rect.width}px`,
                position: "absolute",
            };
        }
    }
});

watch(() => [props.initialValue, props.list], () => {
    if (props.initialValue && props.list?.length > 0) {
        const find = props.list.find(
            (item) => String(item.value) === String(props.initialValue)
        );
        selectedOption.value = find ? find : { name: "", value: "" };
    } else {
        selectedOption.value = { name: "", value: "" };
    }
}, { immediate: true });
</script>

<style scoped>
.overflow-y-auto.dropdown-scroll::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto.dropdown-scroll::-webkit-scrollbar-thumb {
    background-color: var(--color-light-gray-border);
    border-radius: 999px;
}

.overflow-y-auto.dropdown-scroll::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-ash-gray);
    opacity: 0.4;
}

.overflow-y-auto.dropdown-scroll::-webkit-scrollbar-track {
    background-color: transparent;
}
</style>
