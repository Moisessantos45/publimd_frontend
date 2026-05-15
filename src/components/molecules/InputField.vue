<template>
    <div :class="[className]">
        <LabelAtom :label="label" :id="id" />
        <InputAtom :id="id" :required="required" v-model="model" v-bind="$attrs" />
    </div>
</template>

<script setup lang="ts">
import InputAtom from '@/components/atoms/InputAtom.vue';
import LabelAtom from '@/components/atoms/LabelAtom.vue';

defineOptions({
    inheritAttrs: false
});

interface Props {
    label: string;
    id: string;
    required?: boolean;
    className?: string;
}

withDefaults(defineProps<Props>(), {
    required: false,
    className: ''
});

const model = defineModel<string | number>();
</script>
