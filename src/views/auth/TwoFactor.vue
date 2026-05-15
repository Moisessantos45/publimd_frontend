<template>
    <div class="min-h-screen flex flex-col bg-canvas-white relative overflow-x-hidden">
        <main class="grow flex flex-col items-center justify-center px-5 sm:p-6 lg:p-8 relative z-10">
            <div v-if="!isTwoFactorEnabled" class="text-center mt-2">
                <button @click="handleNext" type="button"
                    class="w-full px-4 sm:px-6 py-2.5 sm:py-3 border border-light-gray-border text-midnight-pine font-bold text-sm rounded-soft hover:bg-canvas-white transition-all">
                    Configurar más tarde (Omitir por ahora)
                </button>
                <p class="text-xs text-ash-gray mt-3">
                    Si no sabes cómo hacer esto, selecciona <strong>Omitir por ahora</strong>. Podrás
                    configurarlo después desde tu perfil.
                </p>
            </div>

        </main>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue"
import { storeToRefs } from 'pinia';
import { useRouter } from "vue-router";
import useAuthStore from '@/store/auth';

const router = useRouter()
const useAuth = useAuthStore()
const { authData } = storeToRefs(useAuth)

const isTwoFactorEnabled = computed(() => authData.value.twoFactorEnabled)

const handleNext = () => {
    router.push({
        name: authData.value.fullProfile ? "dashboard-home" : "dashboard-profile",
    });
}

onMounted(() => {
    useAuth.getSession()
})
</script>