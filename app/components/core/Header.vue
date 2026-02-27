<template>
  <header class="header">
    <div class="header__container">
      <h1 class="header__container__title">{{ $t("header.title") }}</h1>

      <div class="header__container__links">
        <NuxtLinkLocale :to="localePath('/')" class="nav-link body-l-style">{{
          $t("header.home")
        }}</NuxtLinkLocale>

        <NuxtLinkLocale
          :to="localePath('/contacts')"
          class="nav-link body-l-style"
          >{{ $t("header.contacts") }}</NuxtLinkLocale
        >

        <NuxtLink
          v-for="locale in availableLocales"
          :key="locale.code"
          :to="switchLocalePath(locale.code)"
          class="nav-link body-l-style"
        >
          {{ locale.code }}
        </NuxtLink>
        <button class="header__container__button btn" @click="changeTheme">
          {{
            theme === "light" ? $t("header.themeDark") : $t("header.themeLight")
          }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const theme = ref("light");
const localePath = useLocalePath();

const availableLocales = computed(() => {
  return locales.value.filter((i) => i.code !== locale.value);
});

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

    &__links {
      display: flex;
      gap: calc($gap * 3);
      align-items: center;
      color: var(--text-color);
      width: 100%;
      a {
        color: var(--text-color);
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: var(--accent-color);
        }

        &.router-link-active {
          text-decoration: underline;
        }
      }
      button {
        margin-left: auto;
      }
    }
  }
}
</style>
