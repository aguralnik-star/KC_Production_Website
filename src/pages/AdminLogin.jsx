import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Shield } from 'lucide-react';
import PageHead from '../components/PageHead';
import { getCurrentSession, isCurrentUserAdmin, signInAdmin } from '../services/authService';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const session = await getCurrentSession();
        if (session && (await isCurrentUserAdmin())) {
          navigate('/admin/rfqs', { replace: true });
        }
      } finally {
        setCheckingSession(false);
      }
    }

    checkExistingSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await signInAdmin(email, password);
      navigate('/admin/rfqs', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading" />
      </div>
    );
  }

  return (
    <>
      <PageHead title="Admin Login | K&C Design and Manufacturing" description="Private admin sign in." />

      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal text-white">
              <Shield className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">K&amp;C Admin</p>
              <h1 className="text-xl font-bold text-charcoal">Sign In</h1>
            </div>
          </div>

          <p className="mt-4 text-sm text-metallic">
            Approved admin accounts only. There is no public registration.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-charcoal">Email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-charcoal">Password</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-metallic">
            <Link to="/" className="text-accent hover:underline">← Back to website</Link>
          </p>
        </div>
      </div>
    </>
  );
}
