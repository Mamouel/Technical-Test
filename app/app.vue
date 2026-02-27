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
const i18nHead = useLocaleHead();

const onBeforeEnter = async () => {
  await finalizePendingLocaleChange();
};

useHead({
  htmlAttrs: {
    lang: () => i18nHead.value.htmlAttrs.lang,
  },
});
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
