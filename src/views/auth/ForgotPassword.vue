<template>
    <div class="min-h-screen flex flex-col bg-canvas-white text-slate-text font-inter">
        <Header />

        <main class="grow flex items-center justify-center px-5 sm:p-6 lg:p-8 relative z-10 py-20">
            <div
                class="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-[-1] opacity-30">
                <svg class="absolute w-[200%] sm:w-[150%] md:w-full max-w-none h-auto text-light-gray-border"
                    style="min-width: 1000px;" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="500" cy="500" r="150" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
                    <circle cx="500" cy="500" r="250" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
                    <circle cx="500" cy="500" r="350" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
                    <circle cx="500" cy="500" r="450" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
                    <circle cx="500" cy="500" r="550" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
                </svg>
            </div>

            <div
                class="w-full max-w-md bg-canvas-white/90 backdrop-blur-md rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-light-gray-border overflow-hidden relative">

                <div class="px-6 pt-10 pb-8 text-center sm:px-10 shrink-0 border-b border-light-gray-border/50">
                    <div
                        class="w-14 h-14 bg-[#12d39d]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#12d39d]">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 class="font-pp-mori font-bold text-3xl sm:text-4xl text-midnight-pine tracking-tight mb-3">
                        Recuperar Contraseña
                    </h1>
                    <p class="text-base text-ash-gray">
                        Ingresa tu correo institucional y te enviaremos instrucciones para recuperar tu cuenta.
                    </p>
                </div>

                <div class="px-6 py-8 sm:px-10 shrink-0">
                    <form class="space-y-6" @submit.prevent="handleSubmit">

                        <div class="space-y-2 focus-within:text-[#12d39d] transition-colors">
                            <label for="email" class="block text-sm font-medium text-slate-text">
                                Correo de Recuperación
                            </label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-ash-gray" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input id="email" type="email" autocomplete="email" placeholder="usuario@ejemplo.com"
                                    v-model="email"
                                    class="block w-full pl-11 pr-4 py-3.5 border border-light-gray-border rounded-full text-slate-text bg-transparent placeholder:text-ash-gray focus:outline-none focus:ring-1 focus:ring-[#12d39d] focus:border-[#12d39d] sm:text-base transition-all"
                                    required />
                            </div>
                        </div>

                        <div class="pt-2">
                            <button type="submit"
                                class="w-full flex justify-center items-center py-3.5 px-6 rounded-full text-[15px] font-semibold transition-all duration-200 shadow-sm bg-[#12d39d] hover:bg-[#0fb889] text-white hover:shadow-md">
                                Verificar Correo
                            </button>
                        </div>
                    </form>

                    <div class="mt-8 pt-6 border-t border-light-gray-border/50">
                        <p class="text-center text-sm text-ash-gray">
                            <RouterLink :to="{ name: 'login' }"
                                class="font-medium text-[#12d39d] hover:text-[#0fb889] transition-colors inline-flex items-center gap-1.5">
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