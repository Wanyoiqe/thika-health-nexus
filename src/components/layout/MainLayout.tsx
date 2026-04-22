import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";
import { useAuth } from "@/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();

  const handleTimeout = useCallback(() => {
    if (!user) return;
    logout();
    toast({
      title: "Signed out",
      description: "You were signed out due to inactivity.",
    });
    navigate("/auth/login");
  }, [logout, navigate, toast, user]);

  useIdleTimeout(handleTimeout);

  const handleContentClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen || !isMobile} />

        <main
          className="flex-1 overflow-auto p-4 md:p-6 transition-all"
          onClick={handleContentClick}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

