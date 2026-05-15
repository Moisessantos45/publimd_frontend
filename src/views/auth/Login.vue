<template>
    <div class="min-h-screen flex flex-col bg-canvas-white relative overflow-x-hidden text-slate-text font-inter">
        <Header />

        <main class="grow flex flex-col items-center justify-center p-4 sm:p-6 relative z-10">
            <div class="absolute inset-0 bg-canvas-white -z-10"></div>

            <div
                class="w-full max-w-lg bg-canvas-white rounded-soft shadow-lg border border-light-gray-border overflow-hidden relative rounded-md p-2">
                <div class="px-6 pt-8 pb-5 text-center sm:px-8 border-b border-light-gray-border">
                    <div
                        class="w-12 h-12 bg-forest-link/10 rounded-soft flex items-center justify-center mx-auto mb-4 text-forest-link">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <h1 class="font-pp-mori font-bold text-heading-sm text-midnight-pine mb-2">Iniciar Sesión</h1>
                    <p class="text-sm text-ash-gray max-w-sm mx-auto">Ingresa tus credenciales para acceder a tu cuenta
                        de Publimd.</p>
                </div>

                <div class="px-6 py-7 sm:px-8">
                    <form @submit.prevent="handleSubmit" class="space-y-5">
                        <InputField label="Correo electrónico" id="email" required type="email" inputmode="email"
                            v-model="email" placeholder="admin@spinluck.com" />

                        <InputField label="Contraseña" id="password" required type="password" inputmode="text"
                            v-model="password" placeholder="••••••••" />

                        <div class="flex items-center justify-end pt-1">
                            <RouterLink to="/forgot-password"
                                class="text-xs font-medium text-ash-gray hover:text-forest-link transition-colors">
                                ¿Olvidaste tu contraseña?
                            </RouterLink>
                        </div>

                        <div class="pt-4 border-t border-light-gray-border flex flex-col gap-5">
                            <div v-if="accountNotVerified"
                                class="bg-canvas-white rounded-soft border border-light-gray-border p-4 space-y-3">
                                <p class="text-sm font-medium text-midnight-pine">Tu cuenta aún no ha sido verificada.
                                </p>
                                <button type="button" @click="resendVerification"
                                    class="px-4 py-2 bg-canvas-white hover:bg-canvas-white text-slate-text text-xs font-medium rounded-full transition-colors">
                                    Reenviar correo de verificación
                                </button>
                            </div>

                            <button type="submit" :disabled="loading" :class="[
                                'w-full py-2.5 px-4 rounded-md text-[14px] font-medium transition-colors flex justify-center items-center gap-2',
                                !loading ? 'bg-transparent border border-forest-link text-forest-link rounded-full hover:bg-forest-link/10' : 'opacity-50 border border-forest-link text-forest-link rounded-full cursor-not-allowed'
                            ]">
                                Autorizar Acceso
                            </button>
                        </div>
                    </form>
                </div>

                <div class="px-6 py-5 border-t border-light-gray-border bg-canvas-white/50 text-center sm:px-8">
                    <p class="text-xs text-ash-gray">
                        ¿Aún no tienes una cuenta?
                        <RouterLink to="/register"
                            class="text-forest-link font-medium hover:text-midnight-pine transition-colors ml-1">
                            Regístrate aquí
                        </RouterLink>
                    </p>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
</script>
