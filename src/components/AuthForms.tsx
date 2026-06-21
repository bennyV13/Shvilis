import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const AuthForms: React.FC = () => {
  const { signIn, signUp, signOut, user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message);
        } else {
          setSuccess('Account created successfully! You are now logged in.');
          setEmail('');
          setPassword('');
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message);
        } else {
          setSuccess('Signed in successfully!');
          setEmail('');
          setPassword('');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  };

  if (user) {
    return (
      <div className="bg-emerald-950/40 backdrop-blur-md border border-emerald-800/40 rounded-2xl p-6 text-center max-w-md mx-auto my-8 shadow-2xl">
        <h3 className="text-xl font-bold text-emerald-100 mb-2">Welcome Back!</h3>
        <p className="text-emerald-300/80 mb-6 text-sm">Signed in as <span className="text-emerald-200 font-mono text-xs font-semibold">{user.email}</span></p>
        <button
          onClick={signOut}
          disabled={loading}
          className="w-full bg-red-900/60 hover:bg-red-800/80 active:bg-red-950 text-red-100 border border-red-700/40 py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 text-sm"
        >
          {loading ? 'Signing Out...' : 'Sign Out'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-lg border border-emerald-950/30 rounded-3xl p-8 max-w-md mx-auto my-8 shadow-2xl transition-all duration-300 hover:border-emerald-800/30">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-emerald-50 tracking-tight">
          {isSignUp ? 'Begin Your Journey' : 'Welcome Back Hiker'}
        </h2>
        <p className="text-slate-400 text-xs mt-2">
          {isSignUp ? 'Create an account to save your trails, checklists, and meals.' : 'Sign in to access your planned hikes and gear.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-slate-300 text-xs font-semibold mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-650 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/50 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-slate-300 text-xs font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-100 placeholder-slate-650 text-sm focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700/50 transition-all duration-200"
          />
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/40 text-red-200 text-xs py-2 px-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-xs py-2 px-3 rounded-lg text-center font-medium">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-emerald-950 font-bold py-3 px-4 rounded-xl transition-all duration-250 shadow-lg shadow-emerald-900/25 disabled:opacity-50 text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : isSignUp ? (
            'Create Account'
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setSuccess(null);
          }}
          className="text-emerald-450 hover:text-emerald-350 text-xs font-semibold transition-colors duration-200"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};
