/**
 * Client-side persistence helpers shared between the Slide Deck (/)
 * and the Live Python Scratchpad route (/scratchpad).
 */

const THEME_KEY = "python-course-theme";
const LAST_SLIDE_KEY = "python-course-last-slide";
const SCRATCHPAD_DRAFT_KEY = "python-course-scratchpad-draft";

export function readStoredTheme(): "light" | "dark" | null {
  try {
    const val = window.localStorage.getItem(THEME_KEY);
    return val === "dark" || val === "light" ? val : null;
  } catch {
    return null;
  }
}

export function saveThemePreference(isDark: boolean): void {
  try {
    window.localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

export function readLastSlideNumber(): number | null {
  try {
    const raw = window.sessionStorage.getItem(LAST_SLIDE_KEY);
    if (!raw) return null;
    const num = parseInt(raw, 10);
    return Number.isFinite(num) && num >= 1 ? num : null;
  } catch {
    return null;
  }
}

export function saveLastSlideNumber(slideNumber: number): void {
  try {
    window.sessionStorage.setItem(LAST_SLIDE_KEY, String(slideNumber));
  } catch {
    // Ignore storage errors
  }
}

export function readScratchpadDraft(): string | null {
  try {
    return window.localStorage.getItem(SCRATCHPAD_DRAFT_KEY);
  } catch {
    return null;
  }
}

export function saveScratchpadDraft(code: string | null): void {
  try {
    if (code === null) {
      window.localStorage.removeItem(SCRATCHPAD_DRAFT_KEY);
    } else {
      window.localStorage.setItem(SCRATCHPAD_DRAFT_KEY, code);
    }
  } catch {
    // Ignore storage errors
  }
}
