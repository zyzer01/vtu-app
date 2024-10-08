"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/lib/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import AuthHeading from "./auth-heading";

interface CheckEmailProps {
  email: string;
}
const CheckEmail: React.FC<CheckEmailProps> = ({ email }) => {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(300);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleResend = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title: "Password Reset Link Sent",
          description: "Please check your email for the password reset link",
        });
        setTimeLeft(300); // Reset the countdown
      } else {
        throw new Error(
          responseData.error || "An unknown error occurred during reset"
        );
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      toast({
        title: "Password Reset Request Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <Toaster />
      <div className="flex flex-col justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-mail border rounded-full p-4 mb-6"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <AuthHeading
        heading="Check your email"
        subheading="We have sent you a password reset link, kindly check your email or spam folder"
      />
      </div>
      <p className="mt-8">
        You can request another link in {formatTime(timeLeft)}
      </p>
      <Button
        disabled={timeLeft > 0 || isLoading}
        onClick={handleResend}
        className="mt-4"
      >
        {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
        Resend Reset Link
      </Button>
    </div>
  );
};

export default CheckEmail;
