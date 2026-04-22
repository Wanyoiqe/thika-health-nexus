import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  loadPasswordPolicy,
  savePasswordPolicy,
  DEFAULT_POLICY,
  type PasswordPolicy,
} from "@/lib/passwordPolicy";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

export function PasswordPolicySettings() {
  const { toast } = useToast();
  const [policy, setPolicy] = useState<PasswordPolicy>(loadPasswordPolicy());
  const [preview, setPreview] = useState("");

  const update = <K extends keyof PasswordPolicy>(key: K, value: PasswordPolicy[K]) => {
    setPolicy((p) => ({ ...p, [key]: value }));
  };

  const onSave = () => {
    savePasswordPolicy(policy);
    toast({ title: "Policy saved", description: "New rules apply at the next registration or password reset." });
  };

  const onReset = () => {
    setPolicy(DEFAULT_POLICY);
    savePasswordPolicy(DEFAULT_POLICY);
    toast({ title: "Reverted to defaults" });
  };

  return (
    <Card className="healthcare-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          <CardTitle>Password Policy</CardTitle>
        </div>
        <CardDescription>
          Define complexity, expiration, and reuse rules enforced at registration and password reset.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minLength">Minimum length</Label>
            <Input
              id="minLength"
              type="number"
              min={6}
              max={64}
              value={policy.minLength}
              onChange={(e) => update("minLength", Math.max(6, Math.min(64, parseInt(e.target.value) || 6)))}
            />
          </div>
          <div className="space-y-2">
            <Label>Password expiration</Label>
            <Select
              value={String(policy.expirationDays)}
              onValueChange={(v) => update("expirationDays", parseInt(v))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Never</SelectItem>
                <SelectItem value="30">Every 30 days</SelectItem>
                <SelectItem value="60">Every 60 days</SelectItem>
                <SelectItem value="90">Every 90 days</SelectItem>
                <SelectItem value="180">Every 180 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Prevent reuse of last passwords</Label>
            <Select
              value={String(policy.preventReuseLastN)}
              onValueChange={(v) => update("preventReuseLastN", parseInt(v))}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Don't check history</SelectItem>
                <SelectItem value="3">Last 3 passwords</SelectItem>
                <SelectItem value="5">Last 5 passwords</SelectItem>
                <SelectItem value="10">Last 10 passwords</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <p className="text-sm font-medium">Character requirements</p>
          {[
            { key: "requireUppercase" as const, label: "Require uppercase letter (A–Z)" },
            { key: "requireLowercase" as const, label: "Require lowercase letter (a–z)" },
            { key: "requireNumber" as const, label: "Require number (0–9)" },
            { key: "requireSpecial" as const, label: "Require special character (!@#$…)" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key} className="text-sm font-normal cursor-pointer">{label}</Label>
              <Switch id={key} checked={policy[key]} onCheckedChange={(v) => update(key, v)} />
            </div>
          ))}
        </div>

        <div className="space-y-2 rounded-lg border p-4">
          <Label htmlFor="preview">Test a password against the current policy</Label>
          <Input
            id="preview"
            type="text"
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            placeholder="Type to see real-time validation…"
          />
          <PasswordStrengthMeter password={preview} policy={policy} />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onReset}>Reset to defaults</Button>
          <Button onClick={onSave}>Save policy</Button>
        </div>
      </CardContent>
    </Card>
  );
}
