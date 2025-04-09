
import React from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

const Register: React.FC = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
