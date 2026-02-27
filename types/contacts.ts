// Types and interfaces for the contacts system

export type Status = "Proposal" | "Lead" | "Negotiation" | "Deal" | "";

export interface Contact {
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

export interface ApiResponse {
  items: Contact[];
  total: number;
  meta: {
    page: number;
    limit: number;
    skip: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface SortConfig {
  field: string;
  dir: "asc" | "desc" | null;
}

export interface FilterConfig {
  status: string;
  country: string;
  company: string;
}

// Constants for filter options
export const STATUS_OPTIONS = [
  "Proposal",
  "Lead",
  "Negotiation",
  "Deal",
] as const;

export const COUNTRY_OPTIONS = [
  "Canada",
  "United States",
  "Germany",
  "Japan",
  "Sweden",
  "Portugal",
] as const;

export const COMPANY_OPTIONS = [
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
] as const;
