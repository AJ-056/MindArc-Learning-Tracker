
import React, { useState } from 'react';
import { ICONS } from '../constants';

interface AuthFormProps {
  onLogin: (email: string, password?: string) => Promise<void>;
  onSignUp: (email: string, password?: string, name?: string) => Promise<void>;
  isLoading: boolean;
  isFirebaseEnabled: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onSignUp, isLoading, isFirebaseEnabled }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        if (!name.trim()) {
            setError('Please enter your name to create an account.');
            return;
        }
        await onSignUp(email, password, name);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Friendly error mapping for common Firebase codes
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up instead.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try logging in.');
      } else {
        setError(err.message || 'Authentication failed. Please check your network and credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden transition-all">
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-3 text-indigo-600 font-black text-3xl mb-10">
            {ICONS.brain}
            <span>MindArc</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-500 mb-8 text-sm">
            {isLogin ? 'Log in to sync your learning journey across devices.' : 'Start tracking your daily growth and build your second brain.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-600 text-xs font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-4 ${
                isLoading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              {isLogin ? "New to MindArc? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold border-t border-slate-100">
          {isFirebaseEnabled ? '✓ Cloud Sync Enabled' : '⚠ Running in Local Mode'}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
