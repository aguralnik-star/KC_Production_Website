import { LogOut } from 'lucide-react';
import { signOut } from '../../services/authService';
import AdminNav from './AdminNav';

export default function AdminHeader({ email, onSignOut, title = 'RFQ Review Dashboard' }) {
  const handleSignOut = async () => {
    await signOut();
    onSignOut?.();
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">K&amp;C Admin</p>
            <div className="mt-1 flex flex-col gap-3">
              <h1 className="text-xl font-bold text-charcoal">{title}</h1>
              <AdminNav />
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
      </div>
    </header>
  );
}
