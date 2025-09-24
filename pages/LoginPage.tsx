import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import Button from '../components/common/Button';
import { BloodDropIcon } from '../components/icons/BloodDropIcon';
import { GoogleIcon } from '../components/icons/GoogleIcon';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | 'roleSelection'>('credentials');

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here.
    // For the demo, we just move to the role selection step.
    setStep('roleSelection');
  };
  
  const handleSocialLogin = () => {
    // Simulate social login flow
    setStep('roleSelection');
  };

  const handleRoleSelect = (role: UserRole) => {
    login(role);
    navigate('/');
  };

  const renderCredentialsStep = () => (
    <>
      <div className="inline-block bg-red-100 p-4 rounded-full">
        <BloodDropIcon className="h-12 w-12 text-primary" />
      </div>
      <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Sign in to VitalFlow</h2>
      <p className="mt-2 text-gray-600">Enter your details to continue.</p>
      
      <form onSubmit={handleCredentialLogin} className="mt-8 space-y-6">
        <div>
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="Email address (demo)"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="Password (demo)"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Sign In
        </Button>
      </form>
      
      <div className="my-6 flex items-center justify-center">
        <div className="border-t border-gray-300 flex-grow"></div>
        <span className="px-4 text-sm text-gray-500 bg-white">OR</span>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>
      
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleSocialLogin}
          className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <GoogleIcon className="h-5 w-5 mr-2" />
          Continue with Google
        </button>
      </div>
    </>
  );

  const renderRoleSelectionStep = () => (
    <>
      <button onClick={() => setStep('credentials')} className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition-colors">
          &larr; Back
      </button>
      <div className="inline-block bg-red-100 p-4 rounded-full">
        <BloodDropIcon className="h-12 w-12 text-primary" />
      </div>
      <h2 className="mt-4 text-3xl font-extrabold text-gray-900">One Last Step</h2>
      <p className="mt-2 text-gray-600">Please select your role to proceed.</p>
      <div className="mt-8 space-y-4">
        <Button
          onClick={() => handleRoleSelect(UserRole.DONOR)}
          size="lg"
          className="w-full"
          variant="primary"
        >
          Continue as a Donor
        </Button>
        <Button
          onClick={() => handleRoleSelect(UserRole.REQUESTER)}
          size="lg"
          className="w-full"
          variant="secondary"
        >
          Continue as a Requester
        </Button>
      </div>
      <p className="mt-6 text-xs text-gray-500">
        This is a simulated login for demonstration purposes.
      </p>
    </>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center relative">
        {step === 'credentials' ? renderCredentialsStep() : renderRoleSelectionStep()}
      </div>
    </div>
  );
};

export default LoginPage;