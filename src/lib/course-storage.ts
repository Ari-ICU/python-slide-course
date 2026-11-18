/**
 * Client-side persistence helpers shared between the Slide Deck (/)
 * and the Live Python Scratchpad IDE route (/scratchpad).
 */

const THEME_KEY = "python-course-theme";
const LAST_SLIDE_KEY = "python-course-last-slide";
const IDE_WORKSPACE_KEY = "python-course-ide-workspace-v1";

export interface IdeFile {
  name: string;
  content: string;
}

export interface IdeWorkspaceState {
  files: IdeFile[];
  activeFile: string;
  stdin: string;
}

export function createEmptyWorkspace(): IdeWorkspaceState {
  return {
    files: [{ name: "main.py", content: "" }],
    activeFile: "main.py",
    stdin: "",
  };
}

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

export function readIdeWorkspace(): IdeWorkspaceState | null {
  try {
    const raw = window.localStorage.getItem(IDE_WORKSPACE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<IdeWorkspaceState>;
    if (
      !Array.isArray(parsed.files) ||
      parsed.files.length === 0 ||
      !parsed.files.every(
        (f) =>
          typeof f?.name === "string" &&
          f.name.trim().length > 0 &&
          typeof f?.content === "string"
      )
    ) {
      return null;
    }
    const active =
      typeof parsed.activeFile === "string" &&
      parsed.files.some((f) => f.name === parsed.activeFile)
        ? parsed.activeFile
        : parsed.files[0].name;
    return {
      files: parsed.files,
      activeFile: active,
      stdin: typeof parsed.stdin === "string" ? parsed.stdin : "",
    };
  } catch {
    return null;
  }
}

export function saveIdeWorkspace(state: IdeWorkspaceState | null): void {
  try {
    if (state === null) {
      window.localStorage.removeItem(IDE_WORKSPACE_KEY);
    } else {
      window.localStorage.setItem(IDE_WORKSPACE_KEY, JSON.stringify(state));
    }
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}
