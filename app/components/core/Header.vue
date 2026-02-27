<template>
  <header class="header">
    <div class="header__container">
      <h1 class="header__container__title">Ringover Technical Test</h1>

      <button class="header__container__button btn" @click="changeTheme">
        {{ theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode" }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const theme = ref("light");
const changeTheme = () => {
  // Logic to change the theme
  document.body.classList.toggle("theme-dark");
  theme.value = theme.value === "light" ? "dark" : "light";
};
</script>

<style lang="scss" scoped>
.header {
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
  }
}
</style>
