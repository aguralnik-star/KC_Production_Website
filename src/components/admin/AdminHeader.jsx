import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { signOut } from '../../services/authService';

export default function AdminHeader({ email, onSignOut }) {
  const handleSignOut = async () => {
    await signOut();
    onSignOut?.();
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">K&amp;C Admin</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-charcoal">RFQ Review Dashboard</h1>
            <Link
              to="/admin/rfqs"
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-charcoal hover:border-accent hover:text-accent"
            >
              RFQ Dashboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {email && (
            <p className="hidden text-sm text-metallic sm:block">
              Signed in as <span className="font-medium text-charcoal">{email}</span>
            </p>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-charcoal hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
