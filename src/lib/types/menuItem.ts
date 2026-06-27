import type { Locale } from "@lib/i18n/config";

export interface MenuItemDefinition {
  id: "home" | "blog" | "contact";
  order: number;
  labels: Record<Locale, string>;
  descriptions: Partial<Record<Locale, string>>;
  paths: Partial<Record<Locale, string>>;
}

export interface MenuItem {
  id: MenuItemDefinition["id"];
  name: string;
  description?: string;
  slug: string;
}
