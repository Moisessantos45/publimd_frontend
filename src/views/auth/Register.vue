<template>
    <div class="min-h-screen flex flex-col bg-canvas-white relative overflow-x-hidden text-slate-text font-inter">
        <Header />

        <main class="grow flex flex-col items-center justify-center px-5 sm:p-6 relative z-10">
            <div class="absolute inset-0 bg-canvas-white -z-10"></div>

            <div
                class="w-full max-w-lg bg-canvas-white rounded-soft shadow-lg border border-light-gray-border overflow-hidden relative rounded-md p-2">
                <div class="px-6 pt-8 pb-5 text-center sm:px-8 border-b border-light-gray-border">
                    <div
                        class="w-12 h-12 bg-forest-link/10 rounded-soft flex items-center justify-center mx-auto mb-4 text-forest-link">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h1 class="font-pp-mori font-bold text-heading-sm text-midnight-pine mb-2">Crear Cuenta</h1>
                    <p class="text-sm text-ash-gray max-w-sm mx-auto">Crea tu cuenta en Publimd completando el
                        formulario y empieza a escribir.</p>
                </div>

                <div class="px-6 py-7 sm:px-8">
                    <form @submit.prevent="handleSubmit" class="space-y-5">
                        <InputField label="Ingresa tu correo electrónico" id="email" required type="email"
                            inputmode="email" v-model="email" placeholder="admin@spinluck.com" />

                        <InputField label="Ingresa tu contraseña" id="password" required type="password"
                            inputmode="text" v-model="password" placeholder="••••••••" />

                        <InputField label="Confirmar Contraseña" id="confirmPassword" required type="password"
                            inputmode="text" v-model="confirmPassword" placeholder="••••••••" />

                        <div class="pt-4 border-t border-light-gray-border flex flex-col gap-5">
                            <Alert v-if="alertMessage.msg" :msg="alertMessage.msg" :error="alertMessage.error" />

                            <div class="bg-canvas-white rounded-soft border border-light-gray-border p-4 space-y-2.5">
                                <p class="text-[10px] font-bold text-ash-gray uppercase tracking-widest">Requisitos de
                                    seguridad</p>
                                <ul class="space-y-2">
                                    <li v-for="req in requirements" :key="req.label"
                                        class="flex items-center gap-2 text-sm text-slate-text font-medium">
                                        <svg v-if="req.met" class="h-4 w-4 text-emerald-400 shrink-0" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                        <svg v-else class="h-4 w-4 text-ash-gray shrink-0" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0" />
                                        </svg>
                                        {{ req.label }}
                                    </li>
                                </ul>
                            </div>

                            <div class="flex flex-col sm:flex-row justify-end gap-3 mt-1">
                                <RouterLink to="/login"
                                    class="flex justify-center items-center py-2 px-4 border border-light-gray-border rounded-md text-sm font-medium text-slate-text bg-canvas-white hover:bg-canvas-white transition-colors">
                                    Cancelar
                                </RouterLink>
                                <button type="submit" :disabled="loading" :class="[
                                    'flex justify-center items-center py-2 px-6 rounded-md text-[14px] font-medium transition-colors',
                                    !loading ? 'bg-transparent border border-forest-link text-forest-link rounded-full hover:bg-forest-link/10' : 'opacity-50 border border-forest-link text-forest-link rounded-full cursor-not-allowed'
                                ]">
                                    Registrarse
                                </button>
                            </div>
                        </div>

                    </form>
                </div>

                <div class="px-6 py-5 border-t border-light-gray-border bg-canvas-white/50 text-center sm:px-8">
                    <p class="text-xs text-ash-gray">
                        ¿Ya estás registrado en la plataforma?
                        <RouterLink to="/login"
                            class="text-forest-link font-medium hover:text-midnight-pine transition-colors ml-1">
                            Inicia sesión aquí
                        </RouterLink>
                    </p>
                </div>

            </div>
        </main>

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import Header from '@/components/Header.vue';
import Alert from '@/components/Alert.vue';
import InputField from '@/components/molecules/InputField.vue';
import useAuthStore from '@/store/auth';

const useAuth = useAuthStore();
const { alertMessage, loading } = storeToRefs(useAuth);

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const requirements = computed(() => [
    { label: 'Mínimo 8 caracteres', met: password.value.length >= 8 },
    { label: 'Al menos un número', met: /\d/.test(password.value) },
    { label: 'Una letra mayúscula', met: /[A-Z]/.test(password.value) },
    { label: 'Un carácter especial (@, #, $)', met: /[@#$%^&*!]/.test(password.value) },
]);


const handleSubmit = async () => {

    if (password.value !== confirmPassword.value) {
        useAuth.setAlertMessage({ error: true, msg: "Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente." });
        return;
    }

    await useAuth.register(email.value, password.value);
};


</script>
