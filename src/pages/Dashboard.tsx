
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // In a real application, you would check for authentication here
  
  const handleLogout = () => {
    // Simulate logout process
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-auth-dark">Dashboard</h1>
            <p className="text-gray-500">Welcome to your account!</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </header>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Account</h2>
          <p className="text-gray-600">
            This is a placeholder dashboard page. In a real application, you would see your account information and features here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
