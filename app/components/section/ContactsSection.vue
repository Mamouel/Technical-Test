<template>
  <div class="contacts flex flex-col gap-4 container">
    <div class="contacts__hero">
      <h1 class="h1-style">{{ $t("contact.title") }}</h1>
      <button class="btn"><SvgoLaunch />{{ $t("contact.cta") }}</button>
    </div>

    <!-- Search and Filters -->
    <div class="contacts__toolbar flex flex-col gap-4">
      <div class="contacts__toolbar__search">
        <div class="contacts__toolbar__search-wrapper">
          <SvgoSearch
            v-show="search.trim() === ''"
            class="contacts__toolbar__search-icon"
          />
          <label for="contact-search" class="sr-only">{{
            $t("contact.searchPlaceholder")
          }}</label>
          <input
            id="contact-search"
            v-model="search"
            type="text"
            :placeholder="$t('contact.searchPlaceholder')"
            class="contacts__toolbar__search-input"
          />
        </div>

        <button class="contacts__toolbar__filters-icon">
          <SvgoSort @click="displayFilters" />
          <span v-show="filtersApplied > 0">{{ filtersApplied }}</span>
        </button>
      </div>

      <!-- Filters -->
      <div
        v-show="filtersVisible"
        class="contacts__toolbar__filters flex items-center gap-4 flex-wrap"
      >
        <div class="filter-group">
          <label for="status-filter" class="filter-label"
            >{{ $t("contact.table.status") }}:</label
          >
          <select
            id="status-filter"
            v-model="filters.status"
            class="filter-select"
            @change="applyFilters"
          >
            <option value="">{{ $t("contact.filters.all") }}</option>
            <option value="Proposal">
              {{ $t("contact.status.proposal") }}
            </option>
            <option value="Lead">{{ $t("contact.status.lead") }}</option>
            <option value="Negotiation">
              {{ $t("contact.status.negotiation") }}
            </option>
            <option value="Deal">{{ $t("contact.status.deal") }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="country-filter" class="filter-label"
            >{{ $t("contact.filters.countryLabel") }}:</label
          >
          <select
            id="country-filter"
            v-model="filters.country"
            class="filter-select"
            @change="applyFilters"
          >
            <option value="">{{ $t("contact.filters.all") }}</option>
            <option value="Canada">{{ $t("contact.countries.ca") }}</option>
            <option value="United States">
              {{ $t("contact.countries.us") }}
            </option>
            <option value="Germany">{{ $t("contact.countries.de") }}</option>
            <option value="Japan">{{ $t("contact.countries.jp") }}</option>
            <option value="Sweden">{{ $t("contact.countries.sw") }}</option>
            <option value="Portugal">{{ $t("contact.countries.pt") }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="company-filter" class="filter-label"
            >{{ $t("contact.filters.companyLabel") }}:</label
          >
          <select
            id="company-filter"
            v-model="filters.company"
            class="filter-select"
            @change="applyFilters"
          >
            <option value="">{{ $t("contact.filters.all") }}</option>
            <option value="Figma">Figma</option>
            <option value="Ikea">Ikea</option>
            <option value="L'Oréal">L'Oréal</option>
            <option value="Master Card">Master Card</option>
            <option value="Boeing">Boeing</option>
            <option value="People Zone">People Zone</option>
            <option value="Type Form">Type Form</option>
            <option value="Johnson & Johnson">Johnson & Johnson</option>
            <option value="Facebook">Facebook</option>
            <option value="Universal Studio">Universal Studio</option>
            <option value="Windows corp">Windows corp</option>
          </select>
        </div>

        <button
          @click="clearFilters"
          class="clear-filters-btn btn"
          :disabled="!hasActiveFilters"
        >
          {{ $t("contact.filters.reset") }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <SectionContactsTable
      :contacts="contacts"
      :sort="sort"
      :isError="isError"
      :isLoading="isLoading"
      @sort="toggleSort"
      @fetchContacts="fetchContacts"
    />

    <!-- Loading more -->
    <div v-if="isLoadingMore" class="contacts__loading-more">
      <p>{{ $t("contact.loadingMore") }}</p>
    </div>

    <!-- Sentinel for infinite scroll -->
    <div ref="sentinel" class="contacts__sentinel" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import SvgoLaunch from "@/assets/svg/icon-launch.svg";
import SvgoSearch from "@/assets/svg/icon-search.svg";
import SvgoSort from "@/assets/svg/icon-sort.svg";
import type {
  Contact,
  ApiResponse,
  SortConfig,
  FilterConfig,
} from "../../../types";

// ---- STATE ----
const contacts = ref<Contact[]>([]);
const total = ref(0);
const page = ref(1);
const limit = 20;
const filtersApplied = ref(0);

const search = ref("");
const debouncedSearch = ref("");

const filtersVisible = ref(false);

const filters: FilterConfig = reactive({
  status: "",
  country: "",
  company: "",
});

const sort: SortConfig = reactive({
  field: "id",
  dir: "asc" as "asc" | "desc",
});

const isLoading = ref(true);
const isLoadingMore = ref(false);
const isError = ref(false);
const hasNextPage = ref(true);

let observer: IntersectionObserver | null = null;

const displayFilters = () => {
  filtersVisible.value = !filtersVisible.value;
};

// Computed property to check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    filters.status !== "" || filters.country !== "" || filters.company !== ""
  );
});

// ---- FETCH ----
const fetchContacts = async (reset = false) => {
  try {
    if (reset) {
      page.value = 1;
      contacts.value = [];
      hasNextPage.value = true;
    }

    if (!hasNextPage.value && !reset) return;

    isError.value = false;
    reset ? (isLoading.value = true) : (isLoadingMore.value = true);

    const response = await $fetch<ApiResponse>("/api/contacts", {
      query: {
        page: page.value,
        limit,
        search: debouncedSearch.value || undefined,
        sortBy: sort.field,
        sortDir: sort.dir,
        status: filters.status || undefined,
        country: filters.country || undefined,
        company: filters.company || undefined,
      },
    });

    if (!response) {
      throw new Error("API Error");
    }

    if (reset) {
      contacts.value = response.items;
    } else {
      contacts.value.push(...response.items);
    }

    total.value = response.total;
    hasNextPage.value = response.meta.hasNextPage;
    page.value++;
  } catch (e) {
    isError.value = true;
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

// ---- FILTERS ----
const applyFilters = () => {
  fetchContacts(true);
  filtersApplied.value =
    (filters.status ? 1 : 0) +
    (filters.country ? 1 : 0) +
    (filters.company ? 1 : 0);
};

const clearFilters = () => {
  filters.status = "";
  filters.country = "";
  filters.company = "";
  fetchContacts(true);
  filtersApplied.value = 0;
};

// ---- SEARCH (debounce) ----
let debounceTimer: ReturnType<typeof setTimeout>;
watch(search, (val) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedSearch.value = val;
    fetchContacts(true);
  }, 400);
});

// ---- SORT ----
const toggleSort = (field: string) => {
  if (sort.field === field) {
    sort.dir = sort.dir === "asc" ? "desc" : "asc";
  } else {
    sort.field = field;
    sort.dir = "asc";
  }
  fetchContacts(true);
};

// ---- INFINITE SCROLL ----
const sentinel = ref<HTMLElement | null>(null);

const initObserver = () => {
  if (!sentinel.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (
        entry &&
        entry.isIntersecting &&
        hasNextPage.value &&
        !isLoadingMore.value
      ) {
        fetchContacts(false);
      }
    },
    { rootMargin: "200px" },
  );

  observer.observe(sentinel.value);
};

onMounted(async () => {
  await fetchContacts(true);
  initObserver();
});
</script>

<style lang="scss" scoped>
.contacts {
  padding: $margin;
  background-color: var(--theme-color);
  transition: $background-transition;

  &__hero {
    padding-bottom: $padding-bottom;
    gap: calc($gap * 2);
    display: flex;
  }

  &__toolbar {
    margin-bottom: 20px;

    &__search {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    &__filters-icon {
      cursor: pointer;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      :deep(svg) {
        width: 20px;
        height: 20px;
      }

      span {
        position: absolute;
        top: -12px;
        right: -12px;
        background: var(--primary-color, #0066cc);
        color: white;
        font-size: 10px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &__search-wrapper {
      position: relative;

      :deep(svg) {
        width: 16px;
        height: 16px;
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    &__search-input {
      padding: 10px 14px;
      font-family: inherit;
      border: 1px solid #dcdcdc;
      outline: none;
      transition: border 0.2s ease;
      min-width: 200px;
      height: 40px;
      border-radius: var(--border-radius, 8px);

      &::placeholder {
        padding-left: 28px;
      }

      &:focus {
        border-color: #111;
      }
    }

    &__filters {
      padding: calc($gap * 2);
      margin-top: calc($gap * 2);
      background-color: var(--theme-color, #f8f9fa);
      border: 1px solid var(--border-color, #dfe5f3);
      border-radius: var(--border-radius, 8px);
      transition: $background-transition;
    }
  }
}

// Styles pour les filtres
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
  margin: $gap 0;
}

.filter-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-color-secondary, #646e7d);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 6px 12px;
  border: 1px solid var(--border-color, #dcdcdc);
  border-radius: var(--border-radius-sm, 4px);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color, #0066cc);
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }

  &:hover {
    border-color: var(--border-color-hover, #999);
  }
}

.clear-filters-btn {
  background: transparent;
  color: var(--text-color, #3d4753);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: var(--background-hover, #f5f5f5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    border-color: var(--primary-color, #0066cc);
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }
}
</style>
