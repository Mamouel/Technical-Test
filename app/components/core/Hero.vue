<template>
  <section class="hero">
    <div class="hero__container">
      <h1 class="hero__container__title">Welcome</h1>
      <p class="hero__container__description">
        This is a simple Nuxt 4 application to assess Ringover Technical Test.
        Please explore the contacts page to see the list of contacts fetched
        from the server.
      </p>
      <NuxtLink to="/contact" class="btn">Go to Contacts</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

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
