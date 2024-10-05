import AuthHeading from "@/components/auth/auth-heading";
import CheckEmail from "@/components/auth/check-email";
import React from "react";

function page() {
  return (
    <div className="flex flex-col justify-center text-center">
      <div className="flex flex-col justify-center items-center mb-6">
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
          className="lucide lucide-mail border rounded-full p-4"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </div>
      <AuthHeading
        heading="Check your Inbox"
        subheading="Please check the email address associated with the username for instructions to reset your password."
      />
      <CheckEmail />
    </div>
  );
}

export default page;
