
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Left side with image/design (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-auth-primary to-auth-tertiary items-center justify-center p-8">
        <div className="text-white max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-lg opacity-90">
            Join thousands of users who trust our platform for their daily needs.
          </p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
