import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setChecking(false);
    };

    getUser();
  }, []);

  if (checking) return <p className="text-center mt-10">Checking auth...</p>;

  return user ? children : <Navigate to="/login" replace />;
}
