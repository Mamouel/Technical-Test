<template>
  <!-- Error State -->
  <div
    v-if="isError"
    class="contacts-table__state contacts-table__state--error"
  >
    <p>{{ $t("contact.errorLoading") }}</p>
    <button type="button" @click="retryFetch" class="contacts-table__retry">
      {{ $t("contact.retry") }}
    </button>
  </div>

  <!-- Table -->
  <div
    v-else
    class="contacts-table__table-wrapper"
    role="region"
    :aria-label="$t('contact.aria.tableRegion')"
  >
    <table class="contacts-table__table" role="table">
      <caption class="sr-only">
        {{
          $t("contact.table.contactList")
        }}
        {{
          contacts.length
        }}
        {{
          $t("contact.table.contactListafter")
        }}
      </caption>
      <thead>
        <tr role="row">
          <th
            @click="toggleSort('firstName')"
            @keydown="handleKeydown($event, 'firstName')"
            class="sortable sticky-column"
            role="columnheader"
            tabindex="0"
            :aria-sort="getSortAriaValue('firstName')"
            :aria-label="$t('contact.sort.name')"
          >
            {{ $t("contact.table.name") }}
            <span class="sort-indicator" :aria-hidden="true" />
          </th>
          <th
            @click="toggleSort('status')"
            @keydown="handleKeydown($event, 'status')"
            class="sortable"
            role="columnheader"
            tabindex="0"
            :aria-sort="getSortAriaValue('status')"
            :aria-label="$t('contact.sort.status')"
          >
            {{ $t("contact.table.status") }}
            <span class="sort-indicator" :aria-hidden="true" />
          </th>
          <th
            @click="toggleSort('company')"
            @keydown="handleKeydown($event, 'company')"
            class="sortable"
            role="columnheader"
            tabindex="0"
            :aria-sort="getSortAriaValue('company')"
            :aria-label="$t('contact.sort.company')"
          >
            {{ $t("contact.table.company") }}
            <span class="sort-indicator" :aria-hidden="true" />
          </th>
          <th role="columnheader">{{ $t("contact.table.number") }}</th>
          <th
            @click="toggleSort('email')"
            @keydown="handleKeydown($event, 'email')"
            class="sortable"
            role="columnheader"
            tabindex="0"
            :aria-sort="getSortAriaValue('email')"
            :aria-label="$t('contact.sort.email')"
          >
            {{ $t("contact.table.email") }}
            <span class="sort-indicator" :aria-hidden="true" />
          </th>
        </tr>
      </thead>

      <tbody>
        <!-- Loading -->
        <tr v-if="isLoading" role="row">
          <td
            colspan="5"
            class="contacts-table__state"
            role="cell"
            aria-live="polite"
          >
            <span role="status" :aria-label="$t('contact.aria.loadingContacts')">{{
              $t("contact.table.loading")
            }}</span>
          </td>
        </tr>

        <!-- Empty -->
        <tr v-else-if="!contacts.length" role="row">
          <td
            colspan="5"
            class="contacts-table__state"
            role="cell"
            aria-live="polite"
          >
            <span role="status">{{ $t("contact.table.noContacts") }}</span>
          </td>
        </tr>

        <!-- Rows -->
        <tr
          v-for="(contact, index) in contacts"
          :key="contact.id"
          class="contacts-table__row"
          role="row"
          tabindex="0"
          :aria-rowindex="index + 1"
          :aria-label="
            $t('contact.aria.contactRow', {
              firstName: contact.firstName,
              lastName: contact.lastName,
            })
          "
          @keydown="handleRowKeydown($event, contact)"
        >
          <td class="sticky-column" role="cell">
            <div class="contacts-table__name">
              <NuxtPicture
                :src="contact.avatar"
                :alt="
                  $t('contact.aria.avatarAlt', {
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                  })
                "
                class="contacts-table__avatar"
                role="img"
              />
              {{ contact.firstName }} {{ contact.lastName }}
            </div>
          </td>
          <td role="cell">
            <span
              class="contacts-table__status"
              :class="`contacts-table__status--${contact.status.toLowerCase()}`"
              :aria-label="
                contact.status
                  ? $t('contact.aria.statusValue', {
                      value: $t(`contact.status.${contact.status.toLowerCase()}`),
                    })
                  : ''
              "
              role="status"
            >
              {{
                contact.status
                  ? $t(`contact.status.${contact.status.toLowerCase()}`)
                  : ""
              }}
            </span>
          </td>
          <td role="cell">
            <span
              :aria-label="
                $t('contact.aria.companyValue', { value: contact.company })
              "
              >{{ contact.company }}</span
            >
          </td>
          <td role="cell">
            <div class="contacts-table__phone">
              <component
                v-if="getCountryFlag(contact.country)"
                :is="getCountryFlag(contact.country)"
                class="contacts-table__flag"
                :aria-label="
                  $t('contact.aria.countryFlag', { country: contact.country })
                "
                role="img"
              />
              <span
                class="contacts-table__phone-number"
                :aria-label="
                  $t('contact.aria.phoneValue', { value: contact.phone })
                "
              >
                {{ contact.phone }}
              </span>
            </div>
          </td>
          <td role="cell">
            <a
              :href="`mailto:${contact.email}`"
              :aria-label="
                $t('contact.aria.emailContact', {
                  firstName: contact.firstName,
                  lastName: contact.lastName,
                  email: contact.email,
                })
              "
            >
              {{ contact.email }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import SvgoCanada from "@/assets/svg/icon-canada.svg";
import SvgoGermany from "@/assets/svg/icon-germany.svg";
import SvgoSweden from "@/assets/svg/icon-sweden.svg";
import SvgoJapan from "@/assets/svg/icon-japan.svg";
import SvgoPortugal from "@/assets/svg/icon-portugal.svg";
import type { Contact, SortConfig } from "../../../types";
const ACTIVATION_KEYS = new Set(["Enter", " "]);

const countryFlags = {
  canada: SvgoCanada,
  germany: SvgoGermany,
  sweden: SvgoSweden,
  japan: SvgoJapan,
  portugal: SvgoPortugal,
} as const;

// define props
const props = defineProps<{
  contacts: Contact[];
  sort: SortConfig;
  isError: boolean;
  isLoading: boolean;
}>();

// define emits
const emit = defineEmits<{
  sort: [field: string];
  retry: [];
  "contact-select": [contact: Contact];
}>();

const toggleSort = (field: string) => {
  emit("sort", field);
};

const retryFetch = () => emit("retry");

const getSortAriaValue = (
  field: string,
): "ascending" | "descending" | "none" => {
  if (props.sort.field === field) {
    return props.sort.dir === "asc" ? "ascending" : "descending";
  }
  return "none";
};

const handleKeydown = (event: KeyboardEvent, field: string) => {
  if (ACTIVATION_KEYS.has(event.key)) {
    event.preventDefault();
    toggleSort(field);
  }
};

const handleRowKeydown = (event: KeyboardEvent, contact: Contact) => {
  if (ACTIVATION_KEYS.has(event.key)) {
    event.preventDefault();
    emit("contact-select", contact);
  }
};

const getCountryFlag = (country: string) => {
  const normalizedCountry = country.toLowerCase() as keyof typeof countryFlags;
  return countryFlags[normalizedCountry] ?? null;
};
</script>

<style lang="scss" scoped>
.contacts-table {
  &__table-wrapper {
    width: 100%;
    overflow-x: auto;
    background-color: var(--theme-light, #fff);
    padding: $gap;
    border: 1px solid var(--border-color, #dfe5f3);
    border-radius: var(--8px-basic, 8px);
    position: relative;
    transition: $background-transition;

    @media (max-width: 1024px) {
      padding: 0;
    }
  }

  &__table {
    width: 100%;
    border-collapse: separate;
    padding: 8px;
    background: var(--theme-light, #fff);
    min-width: 700px;
    transition: $background-transition;

    :deep(thead th) {
      text-align: left;
      padding: $cell-title-padding;
      line-height: 1.2;
      user-select: none;
      color: var(--text-color-secondary, #646e7d);
      border-bottom: 1px solid var(--border-color, #dfe5f3);
      border-right: 1px solid var(--border-color, #dfe5f3);
      height: 40px;
      background-color: var(--theme-light, #fff);
      transition: $background-transition;
      box-shadow: none !important;

      &:focus {
        outline: 2px solid var(--focus-color, #0066cc);
        outline-offset: -2px;
      }

      &:last-child {
        border-right: none;
      }

      &.sticky-column {
        position: sticky;
        left: 0;
        z-index: 20;
        min-width: 200px;
        max-width: 200px;
        width: 200px;
        box-shadow: 1px 6px 30px 0 rgba(18, 18, 18, 0.1);
      }
    }

    :deep(tbody td) {
      padding: $cell-padding;
      line-height: 1.2;
      vertical-align: middle;
      color: var(--text-color-intermediate, #3d4753);
      border-right: 1px solid var(--border-color, #dfe5f3);
      border-bottom: 1px solid var(--border-color, #dfe5f3);
      height: 40px;
      transition: $background-transition;
      white-space: nowrap;

      a {
        color: var(--text-color-intermediate, #3d4753);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      &:last-child {
        border-right: none;
      }

      &.sticky-column {
        position: sticky;
        left: 0;
        z-index: 10;
        min-width: 200px;
        max-width: 200px;
        width: 200px;
        box-shadow: 1px 6px 30px 0 rgba(18, 18, 18, 0.1);
      }
    }

    @media (min-width: 1024px) {
      min-width: 100%;

      :deep(thead th.sticky-column),
      :deep(tbody td.sticky-column) {
        position: relative;
        min-width: auto;
        max-width: none;
        width: auto;
      }
    }

    .sortable {
      cursor: pointer;
      transition: $background-transition;

      &:focus {
        outline: 2px solid var(--focus-color, #0066cc);
        outline-offset: 2px;
      }

      &:hover {
        background-color: var(--theme-hover, #f5f5f5);
      }
    }
  }

  &__row {
    transition: $background-transition;
    height: 40px;
    max-height: 40px;

    &:last-child {
      td {
        border-bottom: none;
      }
    }

    &:hover {
      background-color: var(--theme-hover, #f9f9f9);
    }
  }

  &__avatar {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    object-fit: cover;
  }

  &__name {
    display: flex;
    align-items: center;
    gap: $gap;
  }

  &__phone {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__flag {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &__phone-number {
    white-space: nowrap;
  }

  &__status {
    padding: 5px 10px;
    border-radius: 999px;
    display: inline-block;
    color: var(--text-color);

    &--proposal {
      background: var(--proposal-color, #e0f7fa);
      color: $color-primary-dark;

      .theme-dark & {
        color: $color-theme;
      }
    }

    &--deal {
      background: var(--success-color, #18a326);
    }

    &--lead {
      background: var(--lead-color, #e52517);
    }

    &--negotiation {
      background: var(--negotiation-color, #ff8726);
    }
  }

  &__state {
    text-align: center;
    padding: 40px;
    color: #666;

    &--error {
      border: 1px dashed #e0e0e0;
    }
  }

  &__retry {
    margin-top: 12px;
    padding: 8px 16px;
    border: 1px solid #111;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
  }

  &__loading-more {
    text-align: center;
    padding: 20px;
    font-size: 13px;
    color: #888;
  }

  &__sentinel {
    height: 1px;
    width: 100%;
  }

  &__row {
    &:focus {
      outline: 2px solid var(--focus-color, #0066cc);
      outline-offset: -2px;
    }
  }
}
</style>
