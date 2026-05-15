<template>
  <div class="min-h-screen flex flex-col bg-canvas-white">
    <Header />

    <main class="grow flex items-center justify-center px-5 sm:p-6 lg:p-8">
      <div class="w-full max-w-md bg-canvas-white rounded-md shadow-sm border border-light-gray-border overflow-hidden p-2">

        <div class="px-6 pt-10 pb-8 text-center sm:px-10 shrink-0">
          <div
            class="w-16 h-16 bg-forest-link/10 rounded-md flex items-center justify-center mx-auto mb-6 border border-forest-link/20">
            <svg class="w-8 h-8 text-midnight-pine" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="font-pp-mori font-bold text-heading-sm text-midnight-pine tracking-tight mb-2">
            Cambiar Contraseña
          </h1>
          <p class="text-sm text-ash-gray">
            Ingresa tu nueva clave de acceso institucional para asegurar tu cuenta.
          </p>
        </div>

        <div class="px-6 pb-10 sm:px-10 shrink-0">
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div class="space-y-1.5 focus-within:text-midnight-pine transition-colors">
              <div class="relative">
                <InputField label="Ingresa tu nueva contraseña" id="password" required type="password" inputmode="text"
                  v-model="newPassword" placeholder="••••••••" />
              </div>
            </div>

            <div class="space-y-1.5 focus-within:text-midnight-pine transition-colors">
              <div class="relative">
                <InputField label="Confirmar Contraseña" id="password" required type="password" inputmode="text"
                  v-model="confirmPassword" placeholder="••••••••" />
              </div>
            </div>

            <div class="bg-canvas-white rounded-md border border-light-gray-border p-4 space-y-2.5">
              <p class="text-xs font-semibold text-ash-gray uppercase tracking-wider">Requisitos de seguridad</p>
              <ul class="space-y-1.5">
                <li v-for="req in requirements" :key="req.label" class="flex items-center gap-2 text-xs text-slate-text">
                  <svg v-if="req.met" class="h-4 w-4 text-midnight-pine shrink-0" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="h-4 w-4 text-light-gray-border shrink-0" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0" />
                  </svg>
                  {{ req.label }}
                </li>
              </ul>
            </div>

            <div class="pt-2">
              <button type="submit" :disabled="loading"
                :class="[
                  'w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium transition-all active:scale-[0.98]',
                  !loading ? 'bg-transparent border border-forest-link text-forest-link hover:bg-forest-link/10' : 'opacity-50 border border-forest-link text-forest-link cursor-not-allowed'
                ]">
                Actualizar Contraseña
              </button>
            </div>
          </form>

          <div class="mt-8 pt-6 border-t border-light-gray-border">
            <p class="text-center text-sm text-slate-text">
              <RouterLink :to="{ name: 'login' }"
                class="font-medium text-midnight-pine hover:text-midnight-pine/80 focus:outline-none focus:underline transition-colors inline-flex items-center gap-1.5">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio de sesión
              </RouterLink>
            </p>
          </div>
        </div>

      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useToast } from "vue-toastification";
import Header from '@/components/Header.vue';
import InputField from '@/components/molecules/InputField.vue';
import useAuthStore from '@/store/auth';

const toast = useToast();
const route = useRoute();
const newPassword = ref('');
const confirmPassword = ref('');

const authStore = useAuthStore();
const { alertMessage, loading } = storeToRefs(authStore);


const setToast = (message: string, isError = false) => {
  if (isError) {
    toast.error(message);
  } else {
    toast.success(message);
  }
};

const requirements = computed(() => [
  { label: 'Mínimo 8 caracteres', met: newPassword.value.length >= 8 },
  { label: 'Al menos un número', met: /\d/.test(newPassword.value) },
  { label: 'Una letra mayúscula', met: /[A-Z]/.test(newPassword.value) },
  { label: 'Un carácter especial (@, #, $)', met: /[@#$%^&*!]/.test(newPassword.value) },
]);

const handleSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    setToast("Las contraseñas no coinciden.", true);
    return;
  }

  const token = route.params.token ?? "";
  if (token.toString().length === 0 || !token || typeof token !== 'string') {
    setToast('Token de recuperación no válido.', true);
    return;
  }

  const result = await authStore.resetPassword(token, newPassword.value);
  if (result.isSuccess) {
    setToast(alertMessage.value?.msg || "Contraseña actualizada exitosamente.");
  } else {
    setToast(alertMessage.value?.msg || "Error al actualizar la contraseña.", true);
  }
};
</script>