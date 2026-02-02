import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {useMutation} from '@tanstack/react-query'
import { registerUser } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'


export const Route = createFileRoute('/(auth)/register/')({
  component: RegisterPage,
})

function RegisterPage() {
    const navigate = useNavigate();
    const {setAccessToken, setUser} = useAuth();


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { mutateAsync, isPending } = useMutation({
        mutationFn: registerUser,
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
        try {
        await mutateAsync({name, email, password});
          setError('');
        } catch (err: any) {
          setError(err.message);
        }
        
    }



  return <div className="p-6 max-w-md mx-auto">
    <h2 className="text-3xl font-bold mb-4">Register</h2>
    {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</p>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
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
        disabled={isPending}
      >
        {isPending ? 'Registering...' : 'Register'}
      </button>
    </form>
    <p className="mt-4 text-center text-sm text-gray-600">
      Already have an account?{' '}
      <Link to="/login" className="text-blue-600 hover:text-blue-800">
        Login here
      </Link>
    </p>
  </div>;
  
}