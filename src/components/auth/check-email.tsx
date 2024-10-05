"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { useEmail } from "@/app/context/email";
import { LoaderCircle } from "lucide-react";

const CheckEmail = () => {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isLoading, setIsLoading] = useState(false);
  const { email } = useEmail();

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
    <div>
      <Toaster />
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
