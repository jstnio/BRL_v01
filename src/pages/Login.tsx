import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';
import { LogIn } from 'lucide-react';
import { Button } from '../components/Button';
import { showError } from '../lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Login: Starting login process for email:', email);

    try {
      console.log('Login: Attempting to sign in with Firebase');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login: Firebase sign in successful, getting user doc');
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        console.log('Login: User doc found, setting user data');
        const userData: User = {
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          ...userDoc.data() as Omit<User, 'uid' | 'email'>
        };
        setUser(userData);
        
        let redirectPath;
        switch (userData.role) {
          case 'manager':
            redirectPath = '/dashboard';
            break;
          case 'customer':
            redirectPath = '/customer';
            break;
          case 'admin':
            redirectPath = '/admin';
            break;
          default:
            redirectPath = '/';
        }
        
        console.log('Login: Redirecting to', redirectPath);
        navigate(redirectPath);
      } else {
        console.error('Login: User doc not found');
        showError('User data not found');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      showError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              className="group relative w-full flex justify-center"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}