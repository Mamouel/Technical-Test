import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ContactsTable from "../../app/components/section/ContactsTable.vue";

describe("ContactsTable", () => {
  const contacts = [
    {
      id: 1,
      firstName: "Emma",
      lastName: "Smith",
      email: "emma@test.com",
      phone: "123",
      company: "TechNova",
      country: "Canada",
      avatar: "",
      status: "Active",
    },
  ];

  const baseProps = {
    contacts,
    sort: { field: "id", dir: "asc" as const },
    isLoading: false,
    isError: false,
  };

  it("renders table headers correctly", () => {
    const wrapper = mount(ContactsTable, {
      props: baseProps,
      global: { stubs: { NuxtLink: true } },
    });

    const headers = wrapper
      .findAll("th")
      .map((h) => h.text().trim())
      .filter(Boolean);

    expect(headers).toEqual(
      expect.arrayContaining(["Email", "Company", "Status"]),
    );
  });

  it("renders contacts from props", () => {
    const wrapper = mount(ContactsTable, {
      props: baseProps,
      global: { stubs: { NuxtLink: true } },
    });

    expect(wrapper.text()).toContain("Emma");
    expect(wrapper.text()).toContain("Smith");
    expect(wrapper.text()).toContain("TechNova");
    expect(wrapper.text()).toContain("Active");
  });
});
