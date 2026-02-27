import { vi } from "vitest";
import { config } from "@vue/test-utils";
import { ref } from "vue";

vi.mock("@/assets/svg/", () => ({}));

const translations: Record<string, string> = {
  "contact.table.name": "Name",
  "contact.table.status": "Status",
  "contact.table.company": "Company",
  "contact.table.number": "Number",
  "contact.table.email": "Email",
  "contact.status.active": "Active",
};

const t = (key: string) => translations[key] ?? key;

vi.stubGlobal("useI18n", () => ({
  locale: ref("en"),
  t,
}));

config.global.mocks = {
  ...config.global.mocks,
  $t: t,
};

config.global.stubs = {
  ...config.global.stubs,
  NuxtPicture: true,
  NuxtLink: true,
};
