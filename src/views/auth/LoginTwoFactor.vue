<template>
    <div class="min-h-screen flex flex-col bg-canvas-white relative overflow-x-hidden">
        <Header />

        <main class="grow flex flex-col items-center justify-center p-4 sm:p-6 relative z-10">
            <div class="absolute inset-0 bg-canvas-white -z-10"></div>
            <div
                class="absolute top-0 right-0 w-full lg:w-2/5 h-full bg-linear-to-bl from-outline-variant/25 to-transparent -z-10 rounded-bl-[8rem]">
            </div>

            <div
                class="w-full max-w-lg bg-canvas-white backdrop-blur-sm rounded-soft shadow-md border border-light-gray-border overflow-hidden relative">

                <div class="px-6 pt-8 pb-5 text-center sm:px-8 border-b border-light-gray-border">
                    <div
                        class="w-14 h-14 bg-canvas-white rounded-soft flex items-center justify-center mx-auto mb-5 text-midnight-pine">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-8 h-8">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 0h10.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5Z" />
                        </svg>
                    </div>
                    <h1 class="font-pp-mori font-bold text-heading-sm text-midnight-pine mb-2">Verificación 2FA</h1>
                    <p class="text-sm text-ash-gray max-w-sm mx-auto">Ingresa el código TOTP de 6 dígitos para
                        completar tu inicio de sesión.</p>
                </div>

                <div class="px-6 py-7 sm:px-8">
                    <form @submit.prevent="handleSubmit" class="space-y-5">
                        <InputField label="Código de verificación" id="code" required type="text" inputmode="numeric"
                            v-model="code" placeholder="123456" />

                        <div class="pt-4 border-t border-light-gray-border flex flex-col gap-5">
                            <button type="submit" :disabled="loading" :class="[
                                'w-full py-3.5 px-8 border border-forest-link rounded-soft text-base font-bold text-forest-link transition-all active:scale-[0.99] flex justify-center items-center gap-2',
                                !loading ? 'bg-transparent border border-forest-link hover:bg-forest-link/10 shadow-sm' : 'bg-forest-link cursor-not-allowed'
                            ]">
                                Verificar código
                            </button>

                            <RouterLink to="/login"
                                class="w-full py-3.5 px-8 border border-light-gray-border rounded-soft text-base font-bold text-midnight-pine text-center bg-canvas-white hover:bg-canvas-white transition-colors">
                                Volver a login
                            </RouterLink>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import Header from "@/components/Header.vue";
import InputField from "@/components/molecules/InputField.vue";
import useAuthStore from "@/store/auth";

const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();
const { alertMessage, loading } = storeToRefs(authStore);

const code = ref("");

const isExpiredPreAuthSessionMessage = (message: string) => {
    const normalizedMessage = message.toLowerCase();
    return normalizedMessage.includes("pre-autenticación") ||
        normalizedMessage.includes("sesión expirada") ||
        normalizedMessage.includes("session expired") ||
        normalizedMessage.includes("invalid pre-auth") ||
        normalizedMessage.includes("pre_auth");
};

const handleSubmit = async () => {
    const result = await authStore.verifyLoginTwoFactor(code.value.trim());

    if (!result.isSuccess) {
        const msg = alertMessage.value?.msg || "Error al verificar el código 2FA.";
        toast.error(msg);

        if (isExpiredPreAuthSessionMessage(msg)) {
            toast.info("Tu sesión temporal expiró. Inicia sesión nuevamente.");
            router.push({ name: "login" });
        }

        return;
    }

    await authStore.getSession();

    toast.success("¡Verificación 2FA completada! Redirigiendo...");

    if (authStore.authData.firstSession && !authStore.authData.twoFactorEnabled) {
        router.push({ name: "generate-two-factor" });
        return;
    }

    router.push({
        name: authStore.authData.fullProfile ? "dashboard-home" : "dashboard-profile",
    });
};

</script>
