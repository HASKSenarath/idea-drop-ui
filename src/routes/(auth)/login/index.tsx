import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {useMutation} from '@tanstack/react-query'
import { loginUser } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'



export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
})

function LoginPage() {

      const navigate = useNavigate();
      const {setAccessToken, setUser} = useAuth();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');

      const { mutateAsync, isPending } = useMutation({
          mutationFn: loginUser,
          onError: (error: any) => {
              setError(error.message);
          },
          onSuccess: (data) => {
              setAccessToken(data.accessToken);
              setUser(data.user);
              navigate({to: '/ideas'});
          },
      });

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        await mutateAsync({email, password});
      }
      
  return <div className="p-6 max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-4">Login</h2>
      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          disabled = {isPending}
        >
          {isPending ? "Logging In..": "Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-800">
          Register here
        </Link>
      </p>
    </div>;
    
}
