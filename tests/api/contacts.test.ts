import { describe, it, expect } from "vitest";
import handler from "../../server/api/contacts.get";

function mockEvent(query: Record<string, unknown> = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }

  const qs = params.toString();
  const url = `/api/contacts${qs ? `?${qs}` : ""}`;

  return {
    context: {},
    node: {
      req: {
        url,
        method: "GET",
        headers: {},
      },
      res: {},
    },
  } as any;
}

describe("GET /api/contacts", () => {
  it("returns correct JSON shape", async () => {
    const res: any = await handler(mockEvent());

    expect(res).toHaveProperty("items");
    expect(res).toHaveProperty("total");
    expect(res).toHaveProperty("meta");

    expect(Array.isArray(res.items)).toBe(true);
    expect(res.meta).toHaveProperty("page");
    expect(res.meta).toHaveProperty("hasNextPage");
  });

  it("paginates results correctly", async () => {
    const res: any = await handler(mockEvent({ page: 1, limit: 10 }));

    expect(res.items.length).toBeLessThanOrEqual(10);
    expect(res.meta.page).toBe(1);
    expect(res.meta.limit).toBe(10);
  });

  it("filters contacts with search query", async () => {
    const res: any = await handler(mockEvent({ search: "emma" }));

    const allMatch = res.items.every((c: any) =>
      `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes("emma"),
    );

    expect(allMatch).toBe(true);
  });

  it("sorts contacts by lastName asc", async () => {
    const res: any = await handler(
      mockEvent({ sortBy: "lastName", sortDir: "asc", limit: 20 }),
    );

    const items = res.items;
    const sorted = [...items].sort((a, b) =>
      a.lastName.localeCompare(b.lastName),
    );

    expect(items).toEqual(sorted);
  });

  it("sorts contacts by status desc", async () => {
    const res: any = await handler(
      mockEvent({ sortBy: "status", sortDir: "desc", limit: 20 }),
    );

    const items = res.items;
    const sorted = [...items].sort((a, b) => b.status.localeCompare(a.status));

    expect(items).toEqual(sorted);
  });
});
