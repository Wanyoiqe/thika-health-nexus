
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";


const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // This ensures we navigate to the landing page directly
    navigate("/", { replace: true });
  }, [navigate]);
  
  return <LandingPage />;
};

export default Index;
