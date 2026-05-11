'use client';

import { useState } from 'react';
import { submitContact } from '@/lib/actions';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(event.currentTarget);
    const result = await submitContact(formData);

    if (result.success) {
      setStatus('success');
      (event.target as HTMLFormElement).reset();
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 text-4xl mx-auto mb-6">
          <i className="fa-solid fa-check"></i>
        </div>
        <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
        <p className="text-gray-400">Thank you for contacting us. Our team will get back to you shortly.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-8 text-secondary font-bold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">First Name</label>
          <input 
            name="first_name" 
            type="text" 
            required 
            className="w-full bg-primary/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-secondary transition text-white"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
          <input 
            name="last_name" 
            type="text" 
            className="w-full bg-primary/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-secondary transition text-white"
            placeholder="Doe"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
        <input 
          name="email" 
          type="email" 
          required 
          className="w-full bg-primary/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-secondary transition text-white"
          placeholder="john@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Your Message</label>
        <textarea 
          name="message" 
          required 
          rows={4}
          className="w-full bg-primary/50 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-secondary transition text-white resize-none"
          placeholder="How can we help you?"
        ></textarea>
      </div>

      {status === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className={`w-full bg-secondary text-primary font-black py-5 rounded-2xl transition-all transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-3 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-400'}`}
      >
        {status === 'loading' ? (
          <>
            <i className="fa-solid fa-circle-notch animate-spin"></i> SENDING...
          </>
        ) : (
          <>
            <i className="fa-solid fa-paper-plane"></i> SEND MESSAGE
          </>
        )}
      </button>
    </form>
  );
}
