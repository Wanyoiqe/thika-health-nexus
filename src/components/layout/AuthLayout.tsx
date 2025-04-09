
import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title = "Thika Integrated Health Records System" 
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - branding and info */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-healthcare-primary to-healthcare-secondary p-8 md:p-12 flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <Shield className="h-6 w-6 text-healthcare-primary" />
            </div>
            <h1 className="text-white text-2xl font-bold">Thika Health</h1>
          </Link>
          
          <div className="mt-12 mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Secure Health Records Management
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-md">
              Connecting healthcare providers across Thika with secure, patient-centered medical records
            </p>
          </div>
          
          <div className="hidden md:flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <p className="text-white/90">End-to-end encrypted health data</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <p className="text-white/90">Patient-controlled consent management</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <p className="text-white/90">Compliant with healthcare regulations</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-white/80 text-sm">
          © 2025 Thika Integrated Health Records System
        </div>
      </div>
      
      {/* Right side - auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
