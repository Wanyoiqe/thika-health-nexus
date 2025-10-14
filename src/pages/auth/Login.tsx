import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "@/AuthContext";
import { toast } from "react-hot-toast";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginUtil } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  // ✅ Yup validation schema
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // ✅ Include mode and defaultValues for proper validation tracking
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // 🟢 validate on each change
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
  setIsLoading(true);
  try {
    const response = await loginUtil(data.email, data.password); // returns full response
    const role = response?.user?.role?.toLowerCase();

    if (!role) {
      throw new Error("User role not found. Please contact support.");
    }

    console.log("Login successful, user role:", role);

    toast.success("Login successful! Welcome back 👋");

    // ✅ Redirect based on role
    switch (role) {
      case "patient":
        navigate("/patient/dashboard");
        break;
      case "doctor":
        navigate("/doctor/dashboard");
        break;
      case "receptionist":
        navigate("/receptionist/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
      default:
        navigate("/"); // fallback
        break;
    }
  } catch (error: any) {
    console.error("Login failed:", error);
    toast.error(error?.message || "Invalid credentials.");
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl">
              T
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your Thika Health Records
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ✅ Disable button when invalid or loading */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>

            <div className="text-xs text-gray-500 mt-2">
              <div>Demo credentials:</div>
              <div>Patient: patient@health.com / password</div>
              <div>Provider: provider@health.com / password</div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/auth/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
