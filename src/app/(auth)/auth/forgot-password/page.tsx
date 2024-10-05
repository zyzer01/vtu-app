"use client";

import AuthHeading from "@/components/auth/auth-heading";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeading
        heading="Reset your password"
        subheading="Enter your email and we'll send you a reset link"
      />
      <ForgotPasswordForm />
    </>
  );
}
