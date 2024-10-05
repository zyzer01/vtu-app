import AuthHeading from '@/components/auth/auth-heading'
import { VerifyEmailForm } from '@/components/auth/verify-email-form'
import React from 'react'

function page() {
  return (
    <div className='flex flex-col justify-center text-center'>
      <AuthHeading heading='Verify Your Email' subheading='Check your email or spam folder for your OTP'/>
      <VerifyEmailForm />
    </div>
  )
}

export default page
