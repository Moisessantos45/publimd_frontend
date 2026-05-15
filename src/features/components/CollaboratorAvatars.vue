<template>
  <div class="flex items-center -space-x-2">
    <img v-for="i in collaboratorsBasicInfo" :key="i.userId" :src="i.avatar" alt="Collaborator avatar"
      class="w-8 h-8 rounded-full border-2 border-canvas-white object-cover transition-transform hover:scale-110 hover:z-10"
      loading="lazy" />
    <div
      class="w-8 h-8 rounded-full border-2 border-canvas-white bg-light-gray-border/30 flex items-center justify-center text-[11px] text-midnight-pine font-medium z-0 font-inter">
      +{{ collaboratorsBasicInfo.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCollaboratorStore } from '@/store/collaborator';
import { useRoute } from 'vue-router';

const route = useRoute()

const slug = route.query.slug || ''
const collaboratorStore = useCollaboratorStore();
const { collaboratorsBasicInfo } = storeToRefs(collaboratorStore);


const getCollaboratorsBasicInfo = async () => {
  if (typeof slug !== 'string' || slug.trim() === "") return
  await collaboratorStore.getCollaboratorsBasicInfo(slug);
};

onMounted(() => {
  getCollaboratorsBasicInfo();
});

</script>
