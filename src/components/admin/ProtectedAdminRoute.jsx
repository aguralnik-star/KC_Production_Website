import { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { getCurrentSession, isCurrentUserAdmin, signOut } from '../../services/authService';
import { supabase } from '../../lib/supabaseClient';

export default function ProtectedAdminRoute() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function verifyAccess() {
      try {
        const currentSession = await getCurrentSession();
        if (!mounted) return;

        setSession(currentSession);

        if (!currentSession) {
          setIsAdmin(false);
          setAccessDenied(false);
          return;
        }

        const admin = await isCurrentUserAdmin();
        if (!mounted) return;

        setIsAdmin(admin);
        setAccessDenied(!admin);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    verifyAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      verifyAccess();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setSession(null);
    setIsAdmin(false);
    setAccessDenied(false);
    navigate('/admin/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Checking admin access" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (accessDenied || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-500" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-bold text-charcoal">Access denied</h1>
          <p className="mt-2 text-sm text-metallic">
            This account does not have admin access.
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-6 rounded-lg bg-charcoal px-4 py-2.5 text-sm font-semibold text-white hover:bg-charcoal-light"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <Outlet context={{ session, handleSignOut }} />;
}
