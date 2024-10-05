"use client";

import AuthHeading from "@/components/auth/auth-heading";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeading
        heading="Reset your password"
        subheading="Enter your email and we'll send you a reset link"
      />
      <ResetPasswordForm />
    </>
  );
}
