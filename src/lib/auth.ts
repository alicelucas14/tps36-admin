'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  // Hardcoded demo credentials (matching the original server.js)
  if (username === 'admin' && password === 'password') {
    const cookieStore = await cookies();
    cookieStore.set('isAdmin', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    
    return { success: true };
  }

  return { success: false, error: 'Invalid username or password' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('isAdmin');
  redirect('/admin/login');
}
