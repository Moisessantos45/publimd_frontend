<template>
    <div class="min-h-screen flex flex-col bg-canvas-white text-slate-text font-inter">
        <Header />

        <main class="grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div class="w-full max-w-md bg-canvas-white rounded-soft shadow-lg border border-light-gray-border overflow-hidden">

                <div class="px-6 pt-10 pb-8 text-center sm:px-10 shrink-0">
                    <div
                        class="w-14 h-14 bg-forest-link/10 rounded-soft flex items-center justify-center mx-auto mb-6 text-forest-link">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 class="font-pp-mori font-bold text-heading-sm text-midnight-pine tracking-tight mb-2">
                        Recuperar Contraseña
                    </h1>
                    <p class="text-sm text-ash-gray">
                        Ingresa tu correo institucional y te enviaremos instrucciones para recuperar tu cuenta.
                    </p>
                </div>

                <div class="px-6 pb-10 sm:px-10 shrink-0">
                    <form class="space-y-6" @submit.prevent="handleSubmit">

                        <div class="space-y-2 focus-within:text-forest-link transition-colors">
                            <label for="email" class="block text-[13px] font-medium text-slate-text">
                                Correo de Recuperación
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-ash-gray" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input id="email" type="email" autocomplete="email" placeholder="usuario@ejemplo.com"
                                    v-model="email"
                                    class="block w-full pl-10 pr-3 py-2.5 border border-light-gray-border rounded-md text-slate-text bg-canvas-white placeholder:text-ash-gray focus:outline-none focus:ring-1 focus:ring-blue-400/20 focus:border-blue-400/50 sm:text-sm transition-all"
                                    required />
                            </div>
                        </div>

                        <div class="pt-2">
                            <button type="submit"
                                class="w-full flex justify-center py-2.5 px-4 rounded-md text-[14px] font-medium bg-transparent border border-forest-link text-forest-link hover:bg-forest-link/10 transition-colors">
                                Verificar Correo
                            </button>
                        </div>
                    </form>

                    <div class="mt-8 pt-6 border-t border-light-gray-border">
                        <p class="text-center text-sm text-ash-gray">
                            <RouterLink :to="{ name: 'login' }"
                                class="font-medium text-ash-gray hover:text-slate-text transition-colors inline-flex items-center gap-1.5">
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
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "vue-toastification";
import Header from '@/components/Header.vue';
import useAuthStore from '@/store/auth';

const toast = useToast();
const authStore = useAuthStore();
const email = ref('');

const { alertMessage } = storeToRefs(authStore);

const handleSubmit = async () => {
    const result = await authStore.forgotPassword(email.value);
    if (result.isSuccess) {
        toast.success(alertMessage.value?.msg || "Correo de recuperación enviado exitosamente.");
    } else {
        toast.error(alertMessage.value?.msg || "Error al enviar el correo de recuperación.");
    }
};
</script>