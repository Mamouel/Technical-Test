<template>
  <div>
    <CoreHero />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const seoTitle = computed(() => {
  const title = t("seo.home.title");
  return typeof title === "string" && title.trim().length
    ? title
    : "Home - Ringover Technical Test";
});

const seoDescription = computed(() => {
  const description = t("seo.home.description");
  return typeof description === "string" && description.trim().length
    ? description
    : "Welcome to the Ringover technical test application.";
});

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  twitterCard: "summary_large_image",
});
</script>
