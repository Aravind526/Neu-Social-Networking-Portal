import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import md5 from 'md5';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setErrors([]);
      setLoading(true);
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user avatar
        const avatarUrl = `https://www.gravatar.com/avatar/${md5(email)}?d=identicon`;
        
        // Update user profile
        await updateProfile(user, {
          displayName: username,
          photoURL: avatarUrl
        });
        
        // Save user to database
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          name: username,
          email: email,
          avatar: avatarUrl,
          status: 'online',
          createdAt: serverTimestamp()
        });
        
      } catch (error: any) {
        console.error(error);
        setErrors([error.message]);
        setLoading(false);
      }
    }
  };

  const isFormValid = () => {
    const errors: string[] = [];
    
    if (!username || !email || !password || !confirmPassword) {
      errors.push('Please fill in all fields');
    }
    
    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (errors.length > 0) {
      setErrors(errors);
      return false;
    }
    
    return true;
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <img src="ne-logo.svg" alt="Northeastern Logo" className="h-16 w-16" />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
          
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
              <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  className="input pl-10"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            
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
            
            <div className="mb-4">
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  className="input pl-10"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;