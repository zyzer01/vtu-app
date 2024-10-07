"use client";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "EmailAlreadyRegistered":
        return "An account is already registered using this email address. Try log in with email and password";
      case "GoogleAuthFailed":
        return "Google authentication failed. Please try again.";
      case "NoCode":
        return "No authentication code received. Please try logging in again.";
      default:
        return "An unknown error occurred. Please try again later.";
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-destructive">{getErrorMessage(error)}</p>
        <a href="/auth/login">
          <Button className="mt-6">Back to login</Button>
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
