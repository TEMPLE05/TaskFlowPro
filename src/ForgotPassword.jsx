import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/update-password',
    });

    if (error) alert(error.message);
    else setSent(true);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      {sent ? (
        <p className="text-green-600 text-sm">Check your email for reset instructions.</p>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button className="w-full py-2 bg-black text-white rounded hover:bg-gray-800">
            Send Reset Link
          </button>
        </form>
      )}
      <p className="text-sm text-center mt-4">
        <Link to="/login" className="text-black hover:underline">Return to Login</Link>
      </p>
    </div>
  );
}