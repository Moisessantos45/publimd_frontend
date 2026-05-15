<template>
    <div class="h-full w-full bg-canvas-white">
        <Loading v-if="loading" />
        <LayoutAuth v-else-if="authenticated" :title="$route.meta.title || 'Admin'">
            <template #aside>
                <div
                    class="md:hidden flex items-center justify-between sm:px-4 py-3 bg-canvas-white border-b border-light-gray-border z-30 px-5">
                    <span class="text-midnight-pine font-medium text-sm">Menú</span>
                    <button @click="sidebarOpen = true" class="text-midnight-pine hover:text-forest-link">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
                <div v-if="sidebarOpen" @click="sidebarOpen = false" class="md:hidden fixed inset-0 bg-black/60 z-40">
                </div>
                <AdminAside
                    :class="['fixed inset-y-0 left-0 transition-transform duration-300 ease-in-out z-50 md:relative md:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full']"
                    @logout="logout" @close="sidebarOpen = false" />
            </template>
            <RouterView />
        </LayoutAuth>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import LayoutAuth from '@/components/templates/LayoutAuth.vue';
import AdminAside from './AdminAside.vue';
import Loading from '@/components/molecules/Loading.vue';
import useAuthStore from '@/store/auth';
import useUserStore from '@/store/user';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const { authData, authenticated, loading, alertMessage } = storeToRefs(authStore);

const sidebarOpen = ref(false);

const getData = async () => {
    if (!authenticated.value) {
        await authStore.getSession();
    }

    if (authData.value.fullProfile) {
        await userStore.getUser();
    }
};

const logout = async () => {
    await authStore.logout();
    if (!alertMessage.value.error) {
        router.push('/login');
    }
};

onMounted(() => {
    getData();
});

watch(
    authenticated,
    (isAuthenticated) => {
        if (isAuthenticated && authData.value.fullProfile) {
            userStore.getUser();
        }
    }
);
</script>
