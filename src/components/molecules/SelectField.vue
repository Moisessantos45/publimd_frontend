<template>
    <div :class="['mb-5', className]">
        <LabelAtom :label="label" :id="id" />
        <DropdownSelect :list="options" :initial-value="initialValue" :placeholder="placeholder" :disabled="disabled"
            @change="handleChange" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import DropdownSelect from '@/components/atoms/DropdownSelect.vue';
import type { OptionalField } from '@/components/atoms/DropdownSelect.vue';
import LabelAtom from '@/components/atoms/LabelAtom.vue';

interface Props {
    label: string;
    id: string;
    options: OptionalField[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    modelValue?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
    className: '',
    placeholder: 'Selecciona una opción',
    disabled: false
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
}>();

const internalValue = ref(props.modelValue || '');

watch(() => props.modelValue, (newVal) => {
    internalValue.value = newVal || '';
});


const initialValue = computed(() => {
    if (!internalValue.value) return '';
    return internalValue.value.toString();
});

const handleChange = (selectedOption: OptionalField) => {
    internalValue.value = selectedOption.value;
    emit('update:modelValue', selectedOption.value);
};
</script>
