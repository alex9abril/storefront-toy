export const locales = ["es-MX", "en-US"] as const;

export const DEFAULT_LOCALE = "es-MX";

export type Locale = (typeof locales)[number];
