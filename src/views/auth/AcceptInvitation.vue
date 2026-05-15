<template>
  <div class="min-h-screen flex flex-col bg-canvas-white">
    <Header />

    <main class="grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div v-if="!loading"
        class="w-full max-w-md bg-canvas-white rounded-soft shadow-sm border border-light-gray-border overflow-hidden">

        <div class="px-6 pt-10 pb-8 text-center sm:px-10 shrink-0">
          <div
            class="w-16 h-16 bg-forest-link/10 rounded-soft flex items-center justify-center mx-auto mb-6 border border-forest-link/20">
            <svg class="w-8 h-8 text-midnight-pine" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 class="font-pp-mori font-bold text-heading-sm text-midnight-pine tracking-tight mb-2">
            Invitación al Post
          </h1>
          <Alert v-if="alertMessage.msg" :error="alertMessage.error" :msg="alertMessage.msg" />
        </div>

        <div class="px-6 pb-10 sm:px-10 shrink-0">

          <div class="flex justify-center gap-2 sm:gap-3 text-center">
            <p v-if="!alertMessage.error && alertMessage.msg" class="text-slate-text">
              Has aceptado la invitación exitosamente. Ahora puedes colaborar en el post.
            </p>
            <p v-else-if="alertMessage.error" class="text-slate-text">
              Hubo un problema al aceptar la invitación. El enlace podría ser inválido o haber expirado.
            </p>
          </div>

          <div class="mt-8 pt-6 border-t border-light-gray-border space-y-3 text-center">
            <RouterLink :to="{ name: 'login' }"
              class="font-medium text-sm text-ash-gray hover:text-midnight-pine focus:outline-none focus:underline transition-colors inline-flex items-center gap-1.5">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ir al inicio
            </RouterLink>
          </div>
        </div>

      </div>
      <div v-else
        class="w-full max-w-md bg-canvas-white rounded-soft shadow-sm border border-light-gray-border overflow-hidden p-6 text-center">
        <svg class="w-12 h-12 text-midnight-pine animate-spin mx-auto mb-4" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 4v1m0 8v1m0 8v1m0-16a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1zm0 8a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1zm0 8a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z" />
        </svg>
        <p class="text-sm text-ash-gray">Procesando invitación, por favor espera...</p>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import Header from '@/components/Header.vue';
import Alert from '@/components/Alert.vue';
import { useCollaboratorStore } from '@/store/collaborator';

const route = useRoute();

const collaboratorStore = useCollaboratorStore();
const { alertMessage, loading } = storeToRefs(collaboratorStore);

watch(
  () => route.params.token,
  (newToken) => {
    if (typeof newToken === 'string') {
      collaboratorStore.confirmInvitation(newToken);
    }
  },
  { immediate: true }
);

</script>
