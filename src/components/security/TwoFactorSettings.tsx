import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldCheck, Mail, KeyRound, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  loadTwoFactor,
  saveTwoFactor,
  generateOtp,
  generateBackupCodes,
  type TwoFactorConfig,
} from "@/lib/twoFactor";

export function TwoFactorSettings({ defaultEmail }: { defaultEmail?: string }) {
  const { toast } = useToast();
  const [config, setConfig] = useState<TwoFactorConfig>(loadTwoFactor());
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupEmail, setSetupEmail] = useState(defaultEmail || "");
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [codesOpen, setCodesOpen] = useState(false);
  const [pendingCodes, setPendingCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (defaultEmail && !setupEmail) setSetupEmail(defaultEmail);
  }, [defaultEmail]);

  const startSetup = () => {
    setEnteredOtp("");
    setSentOtp(null);
    setSetupOpen(true);
  };

  const sendCode = () => {
    if (!setupEmail.includes("@")) {
      toast({ title: "Invalid email", description: "Enter a valid email address.", variant: "destructive" });
      return;
    }
    const otp = generateOtp();
    setSentOtp(otp);
    // Demo only — real systems must email the code, never expose it client-side.
    toast({
      title: "Verification code sent",
      description: `Demo code: ${otp} (in production this would be emailed to ${setupEmail})`,
    });
  };

  const verifyAndEnable = () => {
    if (!sentOtp || enteredOtp.trim() !== sentOtp) {
      toast({ title: "Incorrect code", description: "The code you entered does not match.", variant: "destructive" });
      return;
    }
    const codes = generateBackupCodes(10);
    const next: TwoFactorConfig = {
      enabled: true,
      method: "email",
      contactEmail: setupEmail,
      enabledAt: new Date().toISOString(),
      backupCodes: codes,
    };
    saveTwoFactor(next);
    setConfig(next);
    setPendingCodes(codes);
    setSetupOpen(false);
    setCodesOpen(true);
    toast({ title: "2FA enabled", description: "Two-factor authentication is now active." });
  };

  const disable2fa = () => {
    const next: TwoFactorConfig = {
      enabled: false,
      method: "email",
      contactEmail: null,
      enabledAt: null,
      backupCodes: [],
    };
    saveTwoFactor(next);
    setConfig(next);
    toast({ title: "2FA disabled", description: "Two-factor authentication has been turned off." });
  };

  const regenerateCodes = () => {
    const codes = generateBackupCodes(10);
    const next = { ...config, backupCodes: codes };
    saveTwoFactor(next);
    setConfig(next);
    setPendingCodes(codes);
    setCodesOpen(true);
    toast({ title: "Backup codes regenerated", description: "Old codes are no longer valid." });
  };

  const copyCodes = async () => {
    await navigator.clipboard.writeText(pendingCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="healthcare-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <Badge variant={config.enabled ? "default" : "secondary"}>
            {config.enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
        <CardDescription>
          Require a one-time email code in addition to a password at login.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-sm">Email OTP</p>
            <p className="text-xs text-muted-foreground">
              {config.enabled
                ? `Codes are sent to ${config.contactEmail}`
                : "Receive a 6-digit code by email at each login"}
            </p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => (checked ? startSetup() : disable2fa())}
          />
        </div>

        {config.enabled && (
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm flex items-center gap-2">
                  <KeyRound className="h-4 w-4" /> Backup recovery codes
                </p>
                <p className="text-xs text-muted-foreground">
                  {config.backupCodes.length} codes remaining
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={regenerateCodes}>
                Regenerate
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Note: This UI demonstrates the setup flow. Backend OTP delivery and verification
          must be implemented in your Node API for real enforcement.
        </p>
      </CardContent>

      <Dialog open={setupOpen} onOpenChange={setSetupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              We'll email a 6-digit verification code to confirm setup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="2fa-email">Email address</Label>
              <div className="flex gap-2">
                <Input
                  id="2fa-email"
                  type="email"
                  value={setupEmail}
                  onChange={(e) => setSetupEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
                <Button variant="outline" onClick={sendCode} className="shrink-0">
                  <Mail className="h-4 w-4 mr-2" /> Send code
                </Button>
              </div>
            </div>
            {sentOtp && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter the 6-digit code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSetupOpen(false)}>
              Cancel
            </Button>
            <Button onClick={verifyAndEnable} disabled={!sentOtp || enteredOtp.length !== 6}>
              Verify & enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={codesOpen} onOpenChange={setCodesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your backup codes</DialogTitle>
            <DialogDescription>
              Each code can be used once if you lose access to your email. Store them somewhere safe.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-4 font-mono text-sm">
            {pendingCodes.map((code) => (
              <div key={code} className="text-center">{code}</div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={copyCodes}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied" : "Copy all"}
            </Button>
            <Button onClick={() => setCodesOpen(false)}>I've saved them</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
