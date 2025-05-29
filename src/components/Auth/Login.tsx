import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setErrors([]);
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        console.error(error);
        setErrors([error.message]);
        setLoading(false);
      }
    }
  };

  const isFormValid = () => {
    if (!email || !password) {
      setErrors(['Please fill in all fields']);
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <img src={`${import.meta.env.BASE_URL}ne-logo.svg`} alt="Northeastern Logo" className="h-16 w-16" />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">Login to Northeastern Social Network</h1>
          
          <form onSubmit={handleSubmit}>
            {errors.length > 0 && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  {errors.map((error, i) => (
                    <p key={i} className="text-sm">{error}</p>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  className="input pl-10"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  className="input pl-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;