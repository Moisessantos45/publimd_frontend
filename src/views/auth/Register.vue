<template>
    <div class="min-h-screen flex flex-col bg-canvas-white relative overflow-x-hidden text-slate-text font-inter" itemscope itemtype="https://schema.org/WebPage">
        <meta itemprop="name" content="Crear Cuenta - publimd" />
        <meta itemprop="description" content="Regístrate en publimd para crear posts tipo blog usando Markdown (MD), colaborar con otros y publicar en tiempo real." />
        <Header />

        <main class="grow flex flex-col items-center justify-center px-5 sm:p-6 relative z-10 py-20">
            <div class="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-[-1] opacity-30">
                <svg class="absolute w-[200%] sm:w-[150%] md:w-full max-w-none h-auto text-light-gray-border" style="min-width: 1000px;" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="500" cy="500" r="150" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
                    <circle cx="500" cy="500" r="250" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
                    <circle cx="500" cy="500" r="350" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
                    <circle cx="500" cy="500" r="450" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
                    <circle cx="500" cy="500" r="550" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" />
                </svg>
            </div>

            <div class="w-full max-w-lg bg-canvas-white/90 backdrop-blur-md rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-light-gray-border overflow-hidden relative">
                <div class="px-6 pt-10 pb-6 text-center sm:px-8 border-b border-light-gray-border/50">
                    <div class="w-14 h-14 bg-[#12d39d]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#12d39d]">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h1 class="font-pp-mori font-bold text-3xl sm:text-4xl text-midnight-pine mb-3 tracking-tight">Crear Cuenta</h1>
                    <p class="text-base text-ash-gray max-w-sm mx-auto">
                        Crea tu cuenta en Publimd completando el formulario y empieza a escribir.
                    </p>
                </div>

                <div class="px-6 py-7 sm:px-8">
                    <form @submit.prevent="handleSubmit" class="space-y-5">
                        <InputField label="Ingresa tu correo electrónico" id="email" required type="email"
                            inputmode="email" v-model="email" placeholder="admin@spinluck.com" />

                        <InputField label="Ingresa tu contraseña" id="password" required type="password"
                            inputmode="text" v-model="password" placeholder="••••••••" />

                        <InputField label="Confirmar Contraseña" id="confirmPassword" required type="password"
                            inputmode="text" v-model="confirmPassword" placeholder="••••••••" />

                        <div class="pt-5 border-t border-light-gray-border/50 flex flex-col gap-5">
                            <Alert v-if="alertMessage.msg" :msg="alertMessage.msg" :error="alertMessage.error" />

                            <div class="bg-gray-50 rounded-2xl border border-light-gray-border p-5 space-y-3">
                                <p class="text-[11px] font-bold text-ash-gray uppercase tracking-widest">Requisitos de seguridad</p>
                                <ul class="space-y-2.5">
                                    <li v-for="req in requirements" :key="req.label"
                                        class="flex items-center gap-3 text-sm text-midnight-pine font-medium">
                                        <svg v-if="req.met" class="h-4 w-4 text-[#12d39d] shrink-0" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <svg v-else class="h-4 w-4 text-ash-gray shrink-0" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0" />
                                        </svg>
                                        {{ req.label }}
                                    </li>
                                </ul>
                            </div>

                            <div class="flex flex-col sm:flex-row justify-end gap-3 mt-2">
                                <RouterLink to="/login"
                                    class="flex justify-center items-center py-3.5 px-6 border border-light-gray-border rounded-full text-[15px] font-semibold text-midnight-pine bg-canvas-white hover:bg-gray-50 transition-colors shadow-sm">
                                    Cancelar
                                </RouterLink>
                                <button type="submit" :disabled="loading" :class="[
                                    'flex justify-center items-center py-3.5 px-8 rounded-full text-[15px] font-semibold transition-all duration-200 shadow-sm',
                                    !loading ? 'bg-[#12d39d] hover:bg-[#0fb889] text-white hover:shadow-md' : 'opacity-70 bg-[#12d39d] text-white cursor-not-allowed'
                                ]">
                                    Registrarse
                                </button>
                            </div>
                        </div>

                    </form>
                </div>

                <div class="px-6 py-6 border-t border-light-gray-border/50 bg-gray-50/50 text-center sm:px-8">
                    <p class="text-sm text-ash-gray">
                        ¿Ya estás registrado en la plataforma?
                        <RouterLink to="/login"
                            class="text-[#12d39d] font-semibold hover:text-[#0fb889] transition-colors ml-1">
                            Inicia sesión aquí
                        </RouterLink>
                    </p>
                </div>

            </div>
        </main>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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

onMounted(() => {
    document.title = "Crear Cuenta — publimd";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Regístrate en publimd para crear posts tipo blog usando Markdown (MD), colaborar con otros y publicar en tiempo real.");
});


</script>
