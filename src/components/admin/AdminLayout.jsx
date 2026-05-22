import AdminHeader from './AdminHeader';

export default function AdminLayout({ email, onSignOut, title, children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader email={email} onSignOut={onSignOut} title={title} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
