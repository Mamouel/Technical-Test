<template>
  <div>
    <SectionContactsSection />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const seoTitle = computed(() => {
  const title = t("seo.contacts.title");
  return typeof title === "string" && title.trim().length
    ? title
    : "Contacts - Ringover Technical Test";
});

const seoDescription = computed(() => {
  const description = t("seo.contacts.description");
  return typeof description === "string" && description.trim().length
    ? description
    : "Contacts page for the Ringover technical test application.";
});

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  twitterCard: "summary_large_image",
});
</script>
