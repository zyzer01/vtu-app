'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginData, LoginResponse } from '@/types/user';
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (loginData: LoginData) => {
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data: LoginResponse = await response.json();

      if (response.ok) {
        console.log('Logged in user:', data.user);
        // Here you would typically store the token in localStorage or a secure cookie
            router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <LoginForm onSubmit={handleSubmit} />
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
    </div>
  );
}

