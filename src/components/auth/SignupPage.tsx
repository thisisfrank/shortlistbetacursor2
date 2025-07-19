import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { FormInput } from '../forms/FormInput';
import { Zap, AlertCircle, CheckCircle } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user) {
      setSuccess(true);
      // Auto-redirect after successful signup since email confirmation is disabled
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-shadowforce via-shadowforce-light to-shadowforce flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle size={64} className="text-green-400" />
                <div className="absolute inset-0 bg-green-400/30 blur-xl rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-anton text-white-knight uppercase tracking-wide mb-4">
              Account Created!
            </h1>
            <p className="text-guardian font-jakarta mb-6">
              Your account has been successfully created. You're being redirected to the dashboard.
            </p>
            <div className="animate-pulse">
              <div className="w-full bg-shadowforce rounded-full h-2">
                <div className="bg-supernova h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-shadowforce via-shadowforce-light to-shadowforce flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Zap size={48} className="text-supernova fill-current" />
                <div className="absolute inset-0 bg-supernova/30 blur-xl rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-anton text-white-knight uppercase tracking-wide mb-2">
              Create Account
            </h1>
            <p className="text-guardian font-jakarta">
              Join Super Recruiter and transform your hiring
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center">
              <AlertCircle className="text-red-400 mr-3 flex-shrink-0" size={20} />
              <p className="text-red-400 font-jakarta text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              hint="Must be at least 6 characters long"
              required
            />

            <FormInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={loading}
              disabled={!email || !password || !confirmPassword}
            >
              CREATE ACCOUNT
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-guardian font-jakarta">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-supernova hover:text-supernova-light font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};