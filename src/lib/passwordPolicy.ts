// Client-side password policy: configurable rules persisted to localStorage,
// plus a validator that returns granular per-rule pass/fail state for live UI feedback.
//
// IMPORTANT: This is FRONTEND ONLY. The server (Node/MySQL) must enforce
// the same rules at registration and password-reset for real security.

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
  expirationDays: number; // 0 = never expires
  preventReuseLastN: number; // 0 = no history check
}

export const DEFAULT_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
  expirationDays: 90,
  preventReuseLastN: 5,
};

const STORAGE_KEY = "thika.security.passwordPolicy";

export function loadPasswordPolicy(): PasswordPolicy {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_POLICY;
    return { ...DEFAULT_POLICY, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_POLICY;
  }
}

export function savePasswordPolicy(policy: PasswordPolicy): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(policy));
}

export interface PasswordRuleResult {
  id: string;
  label: string;
  passed: boolean;
}

export interface PasswordValidationResult {
  valid: boolean;
  rules: PasswordRuleResult[];
  strength: "weak" | "fair" | "good" | "strong";
  score: number; // 0–100
}

export function validatePassword(
  password: string,
  policy: PasswordPolicy = loadPasswordPolicy()
): PasswordValidationResult {
  const rules: PasswordRuleResult[] = [
    {
      id: "minLength",
      label: `At least ${policy.minLength} characters`,
      passed: password.length >= policy.minLength,
    },
  ];

  if (policy.requireUppercase) {
    rules.push({
      id: "uppercase",
      label: "One uppercase letter (A–Z)",
      passed: /[A-Z]/.test(password),
    });
  }
  if (policy.requireLowercase) {
    rules.push({
      id: "lowercase",
      label: "One lowercase letter (a–z)",
      passed: /[a-z]/.test(password),
    });
  }
  if (policy.requireNumber) {
    rules.push({
      id: "number",
      label: "One number (0–9)",
      passed: /[0-9]/.test(password),
    });
  }
  if (policy.requireSpecial) {
    rules.push({
      id: "special",
      label: "One special character (!@#$…)",
      passed: /[^A-Za-z0-9]/.test(password),
    });
  }

  const passedCount = rules.filter((r) => r.passed).length;
  const score = Math.round((passedCount / rules.length) * 100);
  const strength: PasswordValidationResult["strength"] =
    score < 40 ? "weak" : score < 70 ? "fair" : score < 100 ? "good" : "strong";

  return {
    valid: rules.every((r) => r.passed),
    rules,
    strength,
    score,
  };
}
