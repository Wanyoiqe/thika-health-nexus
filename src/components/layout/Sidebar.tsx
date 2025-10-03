
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

interface SidebarProps {
  open: boolean;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

// Define a type for the user roles to make TypeScript aware of the possible values
type UserRole = 'admin' | 'provider' | 'patient';

// Navigation links based on user roles - we'll expand this later
const navLinks = {
  common: [
    { to: "/dashboard", label: "Dashboard", icon: Home },
  ],
  provider: [
    { to: "/appointments", label: "Appointments", icon: Calendar },
    { to: "/patients", label: "Patients", icon: Users },
    { to: "/records", label: "Medical Records", icon: ClipboardList },
  ],
  admin: [
    { to: "/users", label: "User Management", icon: UserCog },
    { to: "/analytics", label: "Analytics", icon: BarChart4 }, 
    { to: "/system", label: "System Settings", icon: Settings },
  ],
  patient: [
    { to: "/appointments", label: "Appointments", icon: Calendar },
    { to: "/my-records", label: "Health Records", icon: ClipboardList },
    { to: "/consent", label: "Consent Management", icon: Lock },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/billing", label: "Billings", icon: DollarSign },
  ],
};

// Get role from localStorage or default to patient
const getUserRole = (): UserRole => {
  const storedRole = localStorage.getItem("userRole");
  if (storedRole === "admin" || storedRole === "provider" || storedRole === "patient") {
    return storedRole as UserRole;
  }
  return "patient"; // Default to patient
};

const userRole: UserRole = getUserRole();

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
  
  // Determine which links to show based on role
  const roleLinks = userRole === 'admin' 
    ? [...navLinks.common, ...navLinks.provider, ...navLinks.admin]
    : userRole === 'provider' 
      ? [...navLinks.common, ...navLinks.provider]
      : [...navLinks.common, ...navLinks.patient];

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
            {navLinks.common.map((link) => (
              <SidebarLink 
                key={link.to} 
                to={link.to} 
                icon={link.icon}
              >
                {link.label}
              </SidebarLink>
            ))}
          </div>
          
          {userRole !== 'patient' && (
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
          
          {userRole === 'patient' && (
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
          
          {userRole === 'admin' && (
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
