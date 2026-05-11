'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';

export default function AdminLoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result.success) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <img src="/images/Stars777-Logo.png" alt="Logo" className="h-16 w-auto mx-auto mb-6" />
          <h1 className="text-3xl font-black text-white">Admin Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your CMS</p>
        </div>

        <div className="bg-[#0d1522] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Username</label>
              <input 
                name="username" 
                type="text" 
                required 
                className="w-full bg-[#070b14] border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-secondary transition text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
              <input 
                name="password" 
                type="password" 
                required 
                className="w-full bg-[#070b14] border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-secondary transition text-white"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-secondary text-primary font-black py-5 rounded-2xl transition transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2 ${loading ? 'opacity-70' : 'hover:bg-yellow-400'}`}
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch animate-spin"></i>
              ) : (
                <>SIGN IN <i className="fa-solid fa-arrow-right-to-bracket ml-2"></i></>
              )}
            </button>
          </form>
        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    </div>
  );
}
