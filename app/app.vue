<template>
  <div>
    <CoreHeader />
    <NuxtPage
      :transition="{
        name: 'page',
        mode: 'out-in',
        onBeforeEnter,
      }"
    />
  </div>
</template>

<script setup lang="ts">
const { finalizePendingLocaleChange, locale } = useI18n();
const onBeforeEnter = async () => {
  await finalizePendingLocaleChange();
};
</script>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
