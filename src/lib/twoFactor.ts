// Frontend-only 2FA bookkeeping. The "OTP" here is generated and verified
// in the browser purely for UI demonstration of the setup flow.
//
// IMPORTANT: Real 2FA MUST be enforced on the Node backend:
//   - Generate OTP server-side, send via email (do NOT send in API response)
//   - Store hashed OTP + expiry, verify on /api/users/verify-otp
//   - Hash backup codes (bcrypt) and mark each as used after redemption
// This module exists only to demonstrate the admin enable/disable UX flow.

export interface TwoFactorConfig {
  enabled: boolean;
  method: "email"; // only email OTP supported per spec
  contactEmail: string | null;
  enabledAt: string | null;
  backupCodes: string[]; // plaintext only because this is a frontend demo
}

const STORAGE_KEY = "thika.security.twoFactor";

export const DEFAULT_2FA: TwoFactorConfig = {
  enabled: false,
  method: "email",
  contactEmail: null,
  enabledAt: null,
  backupCodes: [],
};

export function loadTwoFactor(): TwoFactorConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_2FA;
    return { ...DEFAULT_2FA, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_2FA;
  }
}

export function saveTwoFactor(cfg: TwoFactorConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export function generateOtp(): string {
  // 6-digit numeric code.
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = [];
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // omit ambiguous chars
  for (let i = 0; i < count; i++) {
    let code = "";
    for (let j = 0; j < 10; j++) {
      code += charset[Math.floor(Math.random() * charset.length)];
      if (j === 4) code += "-";
    }
    codes.push(code);
  }
  return codes;
}

export function consumeBackupCode(code: string): boolean {
  const cfg = loadTwoFactor();
  const idx = cfg.backupCodes.indexOf(code.trim().toUpperCase());
  if (idx === -1) return false;
  cfg.backupCodes.splice(idx, 1);
  saveTwoFactor(cfg);
  return true;
}
