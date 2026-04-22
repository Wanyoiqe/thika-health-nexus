import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Clock, LogOut, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  loadSessionSettings,
  saveSessionSettings,
  loadActiveSessions,
  revokeSession,
  forceLogoutAllUsers,
  type SessionSettings,
  type ActiveSession,
} from "@/lib/sessionManager";

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function SessionManagementSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SessionSettings>(loadSessionSettings());
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  useEffect(() => {
    setSessions(loadActiveSessions());
  }, []);

  const updateSetting = <K extends keyof SessionSettings>(key: K, value: SessionSettings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSessionSettings(next);
    toast({ title: "Session settings updated" });
  };

  const onRevoke = (id: string, name: string) => {
    setSessions(revokeSession(id));
    toast({ title: "Session revoked", description: `${name} has been signed out.` });
  };

  const onForceLogoutAll = () => {
    forceLogoutAllUsers();
    setSessions([]);
    toast({
      title: "All users signed out",
      description: "Every active session has been terminated.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="healthcare-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Session Settings</CardTitle>
          </div>
          <CardDescription>Control idle timeout and concurrent-session rules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Idle timeout</Label>
              <Select
                value={String(settings.idleTimeoutMinutes)}
                onValueChange={(v) => updateSetting("idleTimeoutMinutes", parseInt(v))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Disabled</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Users are signed out automatically after this period of inactivity.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="single-session">Single session per user</Label>
              <div className="flex items-center justify-between rounded-md border h-10 px-3">
                <span className="text-sm text-muted-foreground">
                  Block simultaneous logins
                </span>
                <Switch
                  id="single-session"
                  checked={settings.singleSessionOnly}
                  onCheckedChange={(v) => updateSetting("singleSessionOnly", v)}
                />
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full md:w-auto">
                <LogOut className="h-4 w-4 mr-2" />
                Force logout all users
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out every active user?</AlertDialogTitle>
                <AlertDialogDescription>
                  This terminates all active sessions immediately. Users will need to log in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onForceLogoutAll}>Sign out all</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card className="healthcare-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            <CardTitle>Active Sessions</CardTitle>
          </div>
          <CardDescription>{sessions.length} session{sessions.length === 1 ? "" : "s"} currently active.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No active sessions.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Login</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.userName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{s.userRole}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.device}</TableCell>
                      <TableCell className="text-sm font-mono">{s.ipAddress}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatRelative(s.loginTime)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatRelative(s.lastActivity)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => onRevoke(s.id, s.userName)}>
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
