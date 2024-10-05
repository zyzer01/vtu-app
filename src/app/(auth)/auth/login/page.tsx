"use client";

import AuthHeading from "@/components/auth/auth-heading";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <>
      <AuthHeading
        heading="Welcome back"
        subheading="Sign in into your account"
      />
      <LoginForm />
    </>
  );
}
