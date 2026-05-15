<template>
  <div class="max-w-5xl mx-auto flex flex-col gap-8">

    <div class="flex items-center gap-6 pb-8 border-b border-light-gray-border">
      <div class="relative group">
        <div
          class="w-24 h-24 rounded-full bg-light-gray-border/20 border border-light-gray-border flex items-center justify-center text-ash-gray overflow-hidden">
          <img v-if="dataForm.avatar" :src="dataForm.avatar" class="w-full h-full object-cover" loading="lazy" />
          <User v-else :size="40" stroke-width="1.5" />
        </div>
        <button @click="isAvatarModalOpen = true"
          class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-white cursor-pointer">
          <Camera :size="20" />
        </button>
      </div>
      <div class="flex flex-col">
        <h2 class="text-xl font-semibold text-midnight-pine font-pp-mori">
          {{ dataForm.name || 'John' }} {{ dataForm.lastName || 'Doe' }}
        </h2>
        <span class="text-ash-gray text-sm">Perfil de Usuario</span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <div class="bg-canvas-white border border-light-gray-border rounded-[20px] p-6 flex flex-col gap-5">
        <h3 class="text-midnight-pine font-medium flex items-center gap-2">
          <User :size="16" class="text-forest-link" />
          Información Personal
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <InputField label="Nombre" id="name" required type="text" inputmode="text" v-model="dataForm.name"
              placeholder="John" />
          </div>
          <div class="flex flex-col gap-1.5">
            <InputField label="Apellido" id="lastName" required type="text" inputmode="text" v-model="dataForm.lastName"
              placeholder="Doe" />
          </div>
          <div class="sm:col-span-2 flex flex-col gap-1.5">
            <label class="text-xs text-ash-gray uppercase tracking-wide font-medium">Bio</label>
            <textarea v-model="dataForm.bio"
              class="bg-transparent border border-light-gray-border rounded-md px-3 py-2 text-slate-text text-sm outline-none transition-all duration-200 focus:border-forest-link/50 focus:ring-1 focus:ring-forest-link/10 min-h-20 resize-none placeholder:text-ash-gray/60">
            </textarea>
          </div>
        </div>

        <div class="flex justify-end mt-2">
          <button type="button" @click="handleClick" :disabled="loading"
            class="bg-forest-link text-white rounded-circular px-4 py-2 text-[13px] font-medium transition-colors duration-200 hover:bg-forest-link/90 shadow-sm">
            {{ dataForm.id != -1 ? 'Guardar Cambios' : 'Crear Perfil' }}
          </button>
        </div>
      </div>

      <div class="bg-canvas-white border border-light-gray-border rounded-[20px] p-6 flex flex-col gap-5">
        <h3 class="text-midnight-pine font-medium flex items-center gap-2">
          <Key :size="16" class="text-forest-link" />
          Seguridad
        </h3>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <InputField label="Contraseña Actual" id="currentPassword" required type="password" inputmode="text"
              v-model="currentPassword" placeholder="••••••••" />

          </div>
          <div class="flex flex-col gap-1.5">
            <InputField label="Nueva Contraseña" id="newPassword" required type="password" inputmode="text"
              v-model="newPassword" placeholder="••••••••" />
          </div>
        </div>

        <div class="flex justify-start mt-2">
          <button type="button" :disabled="passwordLoading" @click="handleUpdatePassword"
            class="bg-light-gray-border/50 text-slate-text rounded-circular px-4 py-2 text-[13px] font-medium transition-colors duration-200 hover:bg-light-gray-border hover:text-midnight-pine">
            Actualizar Contraseña
          </button>
        </div>
      </div>
    </div>

  </div>

  <div v-if="isAvatarModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-midnight-pine/20 backdrop-blur-sm p-4">
    <div
      class="bg-canvas-white border border-light-gray-border rounded-[20px] shadow-xl p-6 w-full max-w-md flex flex-col gap-5 relative">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-midnight-pine font-pp-mori">Selecciona un Avatar</h3>
        <button @click="isAvatarModalOpen = false" class="text-ash-gray hover:text-midnight-pine transition-colors">
          <X :size="20" />
        </button>
      </div>
      <div class="grid grid-cols-4 gap-4 max-h-64 p-1">
        <button v-for="(avatar, index) in avatars" :key="index" @click="selectAvatar(avatar)"
          class="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 transition-all duration-200"
          :class="dataForm.avatar === avatar ? 'border-forest-link scale-110 shadow-[0_0_15px_rgba(3,152,97,0.3)]' : 'border-light-gray-border hover:border-forest-link/50 hover:scale-105'">
          <img :src="avatar" class="w-full h-full object-cover" loading="lazy" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from "vue-toastification";
import { User, Camera, Key, X } from 'lucide-vue-next'
import InputField from '@/components/molecules/InputField.vue';
import useUserStore from '@/store/user';
import useAuthStore from '@/store/auth';
import { avatars } from '@/composables/avatars';

const toast = useToast();
const userStore = useUserStore();
const authStore = useAuthStore();
const { dataForm, loading } = storeToRefs(userStore);

const currentPassword = ref('');
const newPassword = ref('');
const passwordLoading = ref(false);

const isAvatarModalOpen = ref(false);

const selectAvatar = (avatar: string) => {
  dataForm.value.avatar = avatar;
  isAvatarModalOpen.value = false;
};

const handleClick = async () => {
  const result = await (dataForm.value.id != -1 ? userStore.updateUser() : userStore.addUser());
  if (result.isSuccess) {
    toast.success("Información del usuario actualizada correctamente.");
  } else {
    toast.error("Error al actualizar la información del organizador.");
  }
};

const handleUpdatePassword = async () => {
  if (!currentPassword.value.trim() || !newPassword.value.trim()) {
    toast.error("Debes completar la contraseña actual y la nueva contraseña.");
    return;
  }

  passwordLoading.value = true;
  const result = await authStore.updatePassword(currentPassword.value, newPassword.value);
  passwordLoading.value = false;

  if (result.isSuccess) {
    toast.success("Contraseña actualizada correctamente.");
    currentPassword.value = '';
    newPassword.value = '';
  } else {
    toast.error(authStore.alertMessage.msg || "No se pudo actualizar la contraseña.");
  }
};
</script>