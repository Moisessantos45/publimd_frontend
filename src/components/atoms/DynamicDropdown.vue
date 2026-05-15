<template>
  <div class="relative inline-block text-left">
    <button ref="buttonRef" @click="toggleDropdown" type="button"
      :disabled="disabled"
      :class="[
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border transition-all duration-200 font-inter',
        roundedClass,
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80',
        currentOption?.buttonClass || ''
      ]">
      <component :is="icon" v-if="icon" :size="12" />
      <span v-else-if="currentOption?.dotClass" class="w-1.5 h-1.5 rounded-full" :class="currentOption.dotClass"></span>
      
      {{ currentOption?.label || defaultLabel }}
      
      <ChevronDown :size="12" class="opacity-70 transition-transform duration-200" :class="{ 'rotate-180': isOpen, 'ml-0.5': !icon }" />
    </button>

    <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-40" @click="isOpen = false"></div>

      <div v-if="isOpen"
        class="fixed mt-1.5 min-w-28 bg-canvas-white border border-light-gray-border rounded-md shadow-lg py-1 z-50 animate-fade-in overflow-hidden font-inter"
        :style="dropdownStyle">
        <button v-for="option in options" :key="option.id" type="button" @click="selectOption(option)"
          class="w-full text-left px-3 py-1.5 text-[13px] hover:bg-light-gray-border/20 transition-colors flex items-center gap-2"
          :class="modelValue === option.id ? 'bg-forest-link/10 text-forest-link font-medium' : 'text-slate-text'">
          <span v-if="option.dotClass" class="w-1.5 h-1.5 rounded-full" :class="option.dotClass"></span>
          <span :class="option.textClass || ''">{{ option.label }}</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import type { DropdownOption } from '@/entities/index';

const props = withDefaults(defineProps<{
  modelValue: string | number
  options: DropdownOption[]
  disabled?: boolean
  defaultLabel?: string
  icon?: Component
  align?: 'left' | 'right'
  roundedClass?: string
}>(), {
  defaultLabel: 'Seleccionar...',
  disabled: false,
  align: 'left',
  roundedClass: 'rounded-md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const isOpen = ref(false)
const buttonRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref({ top: '0px', left: 'auto', right: 'auto' })

const currentOption = computed(() => 
  props.options.find(o => o.id === props.modelValue) || props.options[0]
)

const selectOption = (option: DropdownOption) => {
  isOpen.value = false
  emit('update:modelValue', option.id)
  emit('change', option.id)
}

const toggleDropdown = () => {
  if (props.disabled) return

  if (!isOpen.value) {
    const rect = buttonRef.value?.getBoundingClientRect()
    if (rect) {
      if (props.align === 'right') {
        dropdownStyle.value = {
          top: `${rect.bottom + 6}px`,
          right: `${window.innerWidth - rect.right}px`,
          left: 'auto'
        }
      } else {
        dropdownStyle.value = {
          top: `${rect.bottom + 6}px`,
          left: `${rect.left}px`,
          right: 'auto'
        }
      }
    }
  }
  isOpen.value = !isOpen.value
}
</script>
