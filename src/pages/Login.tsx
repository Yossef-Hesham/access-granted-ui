
import React from "react";
import { useNavigate } from "react-router-dom";
import { Authentication } from "@/components/auth";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <Authentication 
      onLoginSuccess={() => handleLoginSuccess()}
      onRegisterSuccess={() => handleLoginSuccess()}
    />
  );
};

export default Login;
