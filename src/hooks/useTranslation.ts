/**
 * useTranslation — Shared translation hook.
 * Replaces per-component `t()` definitions.
 */
import { translations } from '../lib/translations';
import { useUIStore } from '../store/uiStore';

export function useTranslation<T extends keyof typeof translations>(
  section: T
): (key: keyof typeof translations[T]) => string {
  const currentLang = useUIStore((s) => s.currentLang);

  return (key: keyof typeof translations[T]) => {
    const entry = translations[section][key];
    if (entry && typeof entry === 'object' && currentLang in entry) {
      return (entry as Record<string, string>)[currentLang];
    }
    return String(key);
  };
}
