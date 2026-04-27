
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isMobile = useIsMobile();
  
  // Close sidebar when clicking outside on mobile
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
