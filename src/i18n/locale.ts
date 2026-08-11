import { getLocales } from 'expo-localization';

const SUPPORTED = ['en', 'fr'] as const;

export function getLocale(): string {
  const tag = getLocales()[0]?.languageCode ?? 'en';
  return SUPPORTED.includes(tag as (typeof SUPPORTED)[number]) ? tag : 'en';
}
