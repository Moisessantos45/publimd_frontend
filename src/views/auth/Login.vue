<template>
    <div class="min-h-screen flex flex-col bg-canvas-white relative text-slate-text font-inter" itemscope
        itemtype="https://schema.org/WebPage">
        <meta itemprop="name" content="Iniciar Sesión - publimd" />
        <meta itemprop="description"
            content="Inicia sesión en publimd para crear posts tipo blog usando Markdown (MD), trabajar con colaboradores y publicar en tiempo real." />
        <Header />

        <main class="grow flex flex-col items-center justify-center px-5 sm:p-6 relative z-10 py-20">
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
                class="w-full max-w-lg bg-canvas-white/90 backdrop-blur-md rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-light-gray-border overflow-hidden relative">
                <div class="px-6 pt-10 pb-6 text-center sm:px-8 border-b border-light-gray-border/50">
                    <div
                        class="w-14 h-14 bg-[#12d39d]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#12d39d]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-7 h-7">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <h1 class="font-pp-mori font-bold text-3xl sm:text-4xl text-midnight-pine mb-3 tracking-tight">
                        Iniciar Sesión
                    </h1>
                    <p class="text-base text-ash-gray max-w-sm mx-auto">
                        Ingresa tus credenciales para acceder a tu cuenta de Publimd.
                    </p>
                </div>

                <div class="px-6 py-7 sm:px-8">
                    <form @submit.prevent="handleSubmit" class="space-y-5">
                        <InputField label="Correo electrónico" id="email" required type="email" inputmode="email"
                            v-model="email" placeholder="admin@spinluck.com" />

                        <InputField label="Contraseña" id="password" required type="password" inputmode="text"
                            v-model="password" placeholder="••••••••" />

                        <div class="flex items-center justify-end pt-1">
                            <RouterLink to="/forgot-password"
                                class="text-sm font-medium text-ash-gray hover:text-[#12d39d] transition-colors">
                                ¿Olvidaste tu contraseña?
                            </RouterLink>
                        </div>

                        <div class="pt-5 border-t border-light-gray-border/50 flex flex-col gap-5">
                            <div v-if="accountNotVerified"
                                class="bg-gray-50 rounded-2xl border border-light-gray-border p-5 space-y-3">
                                <p class="text-sm font-medium text-midnight-pine">
                                    Tu cuenta aún no ha sido verificada.
                                </p>
                                <button type="button" @click="resendVerification"
                                    class="px-5 py-2.5 bg-canvas-white hover:bg-gray-50 border border-light-gray-border text-midnight-pine text-xs font-semibold rounded-full transition-colors shadow-sm">
                                    Reenviar correo de verificación
                                </button>
                            </div>

                            <button type="submit" :disabled="loading" :class="[
                                'w-full py-3.5 px-6 rounded-full text-[15px] font-semibold transition-all duration-200 flex justify-center items-center gap-2 shadow-sm',
                                !loading ? 'bg-[#12d39d] hover:bg-[#0fb889] text-white hover:shadow-md' : 'opacity-70 bg-[#12d39d] text-white cursor-not-allowed'
                            ]">
                                Autorizar Acceso
                            </button>
                        </div>
                    </form>
                </div>

                <div class="px-6 py-6 border-t border-light-gray-border/50 bg-gray-50/50 text-center sm:px-8">
                    <p class="text-sm text-ash-gray">
                        ¿Aún no tienes una cuenta?
                        <RouterLink to="/register"
                            class="text-[#12d39d] font-semibold hover:text-[#0fb889] transition-colors ml-1">
                            Regístrate aquí
                        </RouterLink>
                    </p>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, RouterLink } from "vue-router";
import { useToast } from "vue-toastification";
import Header from "@/components/Header.vue";
import InputField from "@/components/molecules/InputField.vue";
import useAuthStore from "@/store/auth";

const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();
const { alertMessage, accountNotVerified, loading } = storeToRefs(authStore);

const email = ref("");
const password = ref("");

const handleSubmit = async () => {
    const result = await authStore.login(email.value, password.value);
    if (!result.isSuccess) {
        toast.error(alertMessage.value?.msg || "Error al iniciar sesión. Por favor, intenta nuevamente.");
        return;
    }

    await authStore.getSession();
    toast.success("¡Inicio de sesión exitoso! Redirigiendo...");

    router.push({
        name: authStore.authData.fullProfile ? "admin-dashboard" : "admin-profile",
    });
};

const resendVerification = () => {
    authStore.forwardEmailVerification(email.value);
};

onMounted(() => {
    document.title = "Iniciar Sesión — publimd";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Inicia sesión en publimd para crear posts tipo blog usando Markdown (MD), trabajar con colaboradores y publicar en tiempo real.");
});
</script>
