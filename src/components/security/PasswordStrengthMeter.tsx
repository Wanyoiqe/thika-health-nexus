import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { validatePassword, type PasswordPolicy } from "@/lib/passwordPolicy";

interface Props {
  password: string;
  policy?: PasswordPolicy;
  className?: string;
}

const STRENGTH_STYLES = {
  weak: { label: "Weak", bar: "bg-destructive", text: "text-destructive" },
  fair: { label: "Fair", bar: "bg-amber-500", text: "text-amber-600" },
  good: { label: "Good", bar: "bg-blue-500", text: "text-blue-600" },
  strong: { label: "Strong", bar: "bg-green-500", text: "text-green-600" },
} as const;

export function PasswordStrengthMeter({ password, policy, className }: Props) {
  const result = validatePassword(password, policy);
  const style = STRENGTH_STYLES[result.strength];

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full transition-all", style.bar)}
            style={{ width: `${result.score}%` }}
          />
        </div>
        <span className={cn("text-xs font-medium", style.text)}>{style.label}</span>
      </div>
      <ul className="space-y-1">
        {result.rules.map((rule) => (
          <li key={rule.id} className="flex items-center gap-2 text-xs">
            {rule.passed ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className={rule.passed ? "text-foreground" : "text-muted-foreground"}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
