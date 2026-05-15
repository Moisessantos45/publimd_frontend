<template>

  <RouterView v-slot="{ Component }">
    <Transition name="router-view" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <!-- <main class="h-full bg-[#26262a] text-[#d4d4d8] font-['Inter',system-ui,sans-serif] flex flex-col overflow-hidden">
  </main> -->

</template>
