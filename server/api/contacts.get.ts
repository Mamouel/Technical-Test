import { defineEventHandler } from "h3";

// Types
type Status = "Proposal" | "Lead" | "Negotiation" | "Deal" | "";

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  avatar: string;
  status: Status;
}

// --- Mock data generators ---
const firstNames = [
  "Emma",
  "Liam",
  "Olivia",
  "Noah",
  "Ava",
  "Lucas",
  "Mia",
  "Ethan",
  "Sophia",
  "William",
  "Charlotte",
  "James",
  "Amelia",
  "Benjamin",
  "Isabella",
  "Elijah",
  "Harper",
  "Henry",
  "Evelyn",
  "Alexander",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Brown",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Garcia",
  "Martinez",
  "Robinson",
  "Clark",
  "Lewis",
  "Walker",
  "Hall",
];

const companies = [
  "Figma",
  "Ikea",
  "L'Oréal",
  "Master Card",
  "Boeing",
  "People Zone",
  "Type Form",
  "Johnson & Johnson",
  "Facebook",
  "Universal Studio",
  "Windows corp",
];

const countries = [
  "Canada",
  "United States",
  "Germany",
  "Japan",
  "Sweden",
  "Portugal",
];

const avatars = [
  "images/avatar1.png",
  "images/avatar2.png",
  "images/avatar3.png",
  "images/avatar4.png",
  "images/avatar5.png",
  "images/placeholder.png",
  "images/salesforce-logo.png",
];

const statuses: Status[] = ["Proposal", "Lead", "Negotiation", "Deal", ""];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function generatePhone(): string {
  const part1 = Math.floor(100 + Math.random() * 900);
  const part2 = Math.floor(100 + Math.random() * 900);
  const part3 = Math.floor(1000 + Math.random() * 9000);
  return `+1 ${part1}-${part2}-${part3}`;
}

function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function generateEmail(
  firstName: string,
  lastName: string,
  company: string,
): string {
  const normalizedFirstName = normalizeString(firstName);
  const normalizedLastName = normalizeString(lastName);
  const normalizedCompany = normalizeString(company);

  return `${normalizedFirstName}.${normalizedLastName}@${normalizedCompany}.com`;
}

function generateContacts(count = 200): Contact[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const company = randomItem(companies);
    const avatar = randomItem(avatars);

    return {
      id: i + 1,
      firstName,
      lastName,
      email: generateEmail(firstName, lastName, company),
      phone: generatePhone(),
      company,
      country: randomItem(countries),
      avatar: avatar,
      status: randomItem(statuses),
    };
  });
}

// Mock DB (persistante en mémoire serveur)
const MOCK_CONTACTS: Contact[] = generateContacts(220);

export default defineEventHandler((event) => {
  const rawUrl =
    (event as any)?.node?.req?.url ??
    (event as any)?.req?.url ??
    "/api/contacts";

  const query = Object.fromEntries(
    new URL(rawUrl, "http://localhost").searchParams.entries(),
  ) as Record<string, string>;

  // --- Query params ---
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const skipParam = query.skip ? Number(query.skip) : null;
  const search = (query.search as string)?.toLowerCase() || "";
  const sortBy = (query.sortBy as keyof Contact) || "id";
  const sortDir = (query.sortDir as "asc" | "desc") || "asc";

  // --- Filter params ---
  const statusFilter = query.status as string;
  const countryFilter = query.country as string;
  const companyFilter = query.company as string;

  // --- Pagination logic (page OR skip) ---
  const skip = skipParam !== null ? skipParam : (page - 1) * limit;

  let data = [...MOCK_CONTACTS];

  // --- Search (firstName, lastName, email, company, country) ---
  if (search) {
    data = data.filter((contact) =>
      `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.company} ${contact.country}`
        .toLowerCase()
        .includes(search),
    );
  }

  // --- Filters ---
  if (statusFilter) {
    data = data.filter((contact) => contact.status === statusFilter);
  }

  if (countryFilter) {
    data = data.filter((contact) => contact.country === countryFilter);
  }

  if (companyFilter) {
    data = data.filter((contact) => contact.company === companyFilter);
  }

  // --- Sorting ---
  data.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === bValue) return 0;

    const comparison = aValue! > bValue! ? 1 : -1;

    return sortDir === "asc" ? comparison : -comparison;
  });

  // --- Total after filters ---
  const total = data.length;

  // --- Paginated items ---
  const items = data.slice(skip, skip + limit);

  // --- Meta ---
  const totalPages = Math.ceil(total / limit);
  const currentPage = skipParam !== null ? Math.floor(skip / limit) + 1 : page;

  return {
    items,
    total,
    meta: {
      page: currentPage,
      limit,
      skip,
      totalPages,
      hasNextPage: skip + limit < total,
      hasPreviousPage: currentPage > 1,
    },
  };
});
