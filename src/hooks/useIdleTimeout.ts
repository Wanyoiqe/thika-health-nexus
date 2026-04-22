import { useEffect, useRef } from "react";
import { loadSessionSettings, getForceLogoutTimestamp } from "@/lib/sessionManager";

/**
 * Auto-logs the user out after N minutes of inactivity, using the admin-
 * configured idle timeout. Also reacts to "force logout all users" events
 * across browser tabs via the storage event.
 *
 * NOTE: This is client-side only. A determined user can disable JS or edit
 * localStorage. Real enforcement requires short-lived JWTs + server check.
 */
export function useIdleTimeout(onTimeout: () => void) {
  const timerRef = useRef<number | null>(null);
  const lastForceLogoutRef = useRef<string | null>(getForceLogoutTimestamp());

  useEffect(() => {
    const settings = loadSessionSettings();
    const timeoutMs = settings.idleTimeoutMinutes * 60 * 1000;

    const reset = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (timeoutMs > 0) {
        timerRef.current = window.setTimeout(() => onTimeout(), timeoutMs);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "thika.security.forceLogoutAt" && e.newValue !== lastForceLogoutRef.current) {
        lastForceLogoutRef.current = e.newValue;
        onTimeout();
      }
    };

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];
    events.forEach((evt) => window.addEventListener(evt, reset, { passive: true }));
    window.addEventListener("storage", handleStorage);
    reset();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, reset));
      window.removeEventListener("storage", handleStorage);
    };
  }, [onTimeout]);
}
