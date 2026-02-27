<template>
  <section class="hero">
    <div class="hero__container container">
      <h1 class="hero__container__title">{{ $t("home.welcome") }}</h1>
      <p class="hero__container__description">
        {{ $t("home.description") }}
      </p>
      <NuxtLinkLocale :to="localePath('/contacts')" class="btn">{{
        $t("home.cta")
      }}</NuxtLinkLocale>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>

<style lang="scss" scoped>
.hero {
  background-color: var(--theme-color);
  color: var(--text-color);
  padding: $padding;
  margin-bottom: $margin;
  transition:
    $background-transition,
    color 0.3s ease;

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $gap;
    text-align: center;

    &__description {
      max-width: 600px;
    }
  }
}
</style>
