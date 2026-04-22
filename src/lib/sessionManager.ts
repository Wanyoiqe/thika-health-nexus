// Client-side session bookkeeping: tracks "active sessions" in localStorage
// for display in the admin dashboard, plus settings (idle timeout, single
// session enforcement) used by the IdleTimeout hook.
//
// IMPORTANT: Real session invalidation must happen on the Node backend
// (rotate JWT secrets / blacklist tokens). This file only tracks local
// state and triggers logout in this browser.

export interface SessionSettings {
  idleTimeoutMinutes: number; // 0 = disabled
  singleSessionOnly: boolean;
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  device: string;
  ipAddress: string;
  loginTime: string; // ISO
  lastActivity: string; // ISO
}

const SETTINGS_KEY = "thika.security.sessionSettings";
const SESSIONS_KEY = "thika.security.activeSessions";
const FORCE_LOGOUT_KEY = "thika.security.forceLogoutAt";

export const DEFAULT_SESSION_SETTINGS: SessionSettings = {
  idleTimeoutMinutes: 15,
  singleSessionOnly: false,
};

export function loadSessionSettings(): SessionSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SESSION_SETTINGS;
    return { ...DEFAULT_SESSION_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SESSION_SETTINGS;
  }
}

export function saveSessionSettings(settings: SessionSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadActiveSessions(): ActiveSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return seedDemoSessions();
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveActiveSessions(sessions: ActiveSession[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function revokeSession(sessionId: string): ActiveSession[] {
  const remaining = loadActiveSessions().filter((s) => s.id !== sessionId);
  saveActiveSessions(remaining);
  return remaining;
}

export function forceLogoutAllUsers(): void {
  // Bumping this timestamp signals all open tabs to log out via storage event.
  localStorage.setItem(FORCE_LOGOUT_KEY, new Date().toISOString());
  saveActiveSessions([]);
}

export function getForceLogoutTimestamp(): string | null {
  return localStorage.getItem(FORCE_LOGOUT_KEY);
}

function seedDemoSessions(): ActiveSession[] {
  // Seed a few realistic-looking sessions so the table isn't empty on first view.
  const now = Date.now();
  const seeded: ActiveSession[] = [
    {
      id: "sess-001",
      userId: "u-101",
      userName: "Dr. Jane Mwangi",
      userRole: "doctor",
      device: "Chrome • macOS",
      ipAddress: "196.207.142.18",
      loginTime: new Date(now - 1000 * 60 * 42).toISOString(),
      lastActivity: new Date(now - 1000 * 60 * 3).toISOString(),
    },
    {
      id: "sess-002",
      userId: "u-202",
      userName: "Mary Wanjiku",
      userRole: "receptionist",
      device: "Edge • Windows 11",
      ipAddress: "41.89.10.55",
      loginTime: new Date(now - 1000 * 60 * 15).toISOString(),
      lastActivity: new Date(now - 1000 * 60 * 1).toISOString(),
    },
    {
      id: "sess-003",
      userId: "u-303",
      userName: "John Otieno",
      userRole: "patient",
      device: "Safari • iPhone",
      ipAddress: "105.163.2.91",
      loginTime: new Date(now - 1000 * 60 * 90).toISOString(),
      lastActivity: new Date(now - 1000 * 60 * 22).toISOString(),
    },
  ];
  saveActiveSessions(seeded);
  return seeded;
}
