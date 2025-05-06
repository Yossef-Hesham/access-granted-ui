
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("login");

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-auth-dark">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your account
          </p>
        </div>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </AuthLayout>
  );
};

export default Login;
