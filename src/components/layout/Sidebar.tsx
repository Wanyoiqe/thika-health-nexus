
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  ClipboardList, 
  Calendar, 
  Settings, 
  ShieldCheck, 
  Lock, 
  BarChart4,
  UserCog,
  Shield,
  Bell,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/AuthContext";

interface SidebarProps {
  open: boolean;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

// Navigation links based on user roles - we'll expand this later
const getDashboardLink = (role?: string) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "receptionist":
      return "/receptionist/dashboard";
    case "patient":
      return "/patient/dashboard";
    default:
      return "/dashboard";
  }
};

const navLinks = {
  common: [
    { to: "/dashboard", 
      label: "Dashboard", 
      icon: Home 
    },
  ],
  receptionist: [
    { to: "/receptionist/doctor-management", label: "Doctor Management", icon: Users },
  ],
  admin: [
    { to: "/users", label: "Hospital Management", icon: UserCog },
    { to: "/analytics", label: "Analytics", icon: BarChart4 }, 
    { to: "/system", label: "System Settings", icon: Settings },
  ],
  patient: [
    { to: "/appointments", label: "Appointments", icon: Calendar },
    { to: "/health-records", label: "Health Records", icon: ClipboardList },
    { to: "/consent", label: "Consent Management", icon: Lock },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/billing", label: "Billings", icon: DollarSign },
  ],
  provider: [
    { to: "/doctor/patients", label: "My Patients", icon: Users },
    { to: "/doctor/appointments", label: "Appointments", icon: Calendar },
    { to: "/doctor/health-records", label: "Health Records", icon: ClipboardList },
    { to: "/doctor/consent", label: "Consent Requests", icon: Lock },
    { to: "/doctor/notifications", label: "Notifications", icon: Bell },
  ],
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, children }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "nav-link",
        isActive && "active"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
  const { user, refreshToken } = useAuth();
  if (!open) {
    return null;
  }

  return (
    <div className={cn(
      "w-64 flex-shrink-0 border-r border-gray-200 bg-white z-20",
      "fixed md:static inset-y-0 left-0 transform md:translate-x-0 transition-transform duration-200 ease-in-out",
      !open && "-translate-x-full"
    )}>
      <div className="h-16 border-b border-gray-200 flex items-center px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-healthcare-primary flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="font-semibold text-lg">
            Thika Health
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <nav className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              General
            </p>
           <SidebarLink 
              to={getDashboardLink(user?.role)} 
              icon={Home}
            >
              Dashboard
            </SidebarLink>
          </div>
          
          {user?.role === 'receptionist' && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Clinical
              </p>
              {navLinks.receptionist.map((link) => (
                <SidebarLink 
                  key={link.to} 
                  to={link.to} 
                  icon={link.icon}
                >
                  {link.label}
                </SidebarLink>
              ))}
            </div>
          )}
          
          {user?.role === 'patient' && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                My Health
              </p>
              {navLinks.patient.map((link) => (
                <SidebarLink 
                  key={link.to} 
                  to={link.to} 
                  icon={link.icon}
                >
                  {link.label}
                </SidebarLink>
              ))}
            </div>
          )}
          
          {user?.role === 'provider' && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Clinical
              </p>
              {navLinks.provider.map((link) => (
                <SidebarLink 
                  key={link.to} 
                  to={link.to} 
                  icon={link.icon}
                >
                  {link.label}
                </SidebarLink>
              ))}
            </div>
          )}
          
          {user?.role === 'admin' && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administration
              </p>
              {navLinks.admin.map((link) => (
                <SidebarLink 
                  key={link.to} 
                  to={link.to} 
                  icon={link.icon}
                >
                  {link.label}
                </SidebarLink>
              ))}
            </div>
          )}
          
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </p>
            <SidebarLink to="/profile" icon={UserCog}>
              Profile
            </SidebarLink>
            <SidebarLink to="/settings" icon={Settings}>
              Settings
            </SidebarLink>
          </div>
          
          <div className="space-y-1">
            <SidebarLink to="/privacy" icon={Shield}>
              Privacy & Security
            </SidebarLink>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
