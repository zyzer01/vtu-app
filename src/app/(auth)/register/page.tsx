import AuthHeading from "@/components/auth/auth-heading";
import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up to this platform",
};

export default function RegisterPage() {
  return (
    <>
      <AuthHeading heading='Create an Account' subheading='Fill the form below to get started'/>
      <RegisterForm />
    </>
  );
}
