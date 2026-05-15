<template>
  <aside class="w-3xs flex flex-col bg-canvas-white border-r border-light-gray-border shrink-0 h-full font-inter">
    <div class="flex h-14 items-center px-6 border-b border-light-gray-border shrink-0">
      <span class="text-midnight-pine font-semibold tracking-wide text-sm uppercase">Publimd Admin</span>
    </div>

    <div class="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
      <RouterLink to="/admin" @click="$emit('close')"
        class="flex items-center gap-3 px-3 py-2 rounded-circular text-ash-gray text-[13px] font-medium transition-all duration-150 hover:bg-light-gray-border/20 hover:text-midnight-pine"
        exact-active-class="bg-forest-link/10 text-forest-link!">
        <LayoutDashboard :size="16" stroke-width="2" />
        <span>Dashboard</span>
      </RouterLink>
      <RouterLink to="/admin/posts" @click="$emit('close')"
        class="flex items-center gap-3 px-3 py-2 rounded-circular text-ash-gray text-[13px] font-medium transition-all duration-150 hover:bg-light-gray-border/20 hover:text-midnight-pine"
        active-class="bg-forest-link/10 text-forest-link!">
        <FileText :size="16" stroke-width="2" />
        <span>Mis Posts</span>
      </RouterLink>
      <RouterLink to="/admin/profile" @click="$emit('close')"
        class="flex items-center gap-3 px-3 py-2 rounded-circular text-ash-gray text-[13px] font-medium transition-all duration-150 hover:bg-light-gray-border/20 hover:text-midnight-pine"
        active-class="bg-forest-link/10 text-forest-link!">
        <User :size="16" stroke-width="2" />
        <span>Perfil</span>
      </RouterLink>
    </div>

    <div class="p-4 border-t border-light-gray-border shrink-0">
      <button type="button" @click="$emit('logout')"
        class="flex items-center gap-3 w-full px-3 py-2 rounded-circular text-red-500 text-[13px] font-medium transition-all duration-150 hover:bg-red-500/10 hover:text-red-600">
        <LogOut :size="16" stroke-width="2" />
        <span>Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, FileText, User, LogOut } from 'lucide-vue-next';

defineEmits<{
  (e: 'logout'): void;
  (e: 'close'): void;
}>();
</script>