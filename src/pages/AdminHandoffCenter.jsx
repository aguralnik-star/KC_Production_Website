import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  BookOpen,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Rocket,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import { COMPANY } from '../data/company';

const HANDOFF_LINKS = [
  {
    to: '/admin/rfqs',
    title: 'RFQ Dashboard',
    description: 'Review incoming requests, update status, download files, and manage customer communication.',
    icon: LayoutDashboard,
  },
  {
    to: '/admin/rfq-operations#analytics',
    title: 'Analytics',
    description: 'RFQ volume, conversion trends, and operational KPI charts.',
    icon: BarChart3,
  },
  {
    to: '/admin/rfqs?tab=reminders',
    title: 'Reminders',
    description: 'Follow-up queue for overdue quotes and customer responses.',
    icon: Bell,
  },
  {
    to: '/admin/rfq-operations',
    title: 'Operations Command Center',
    description: 'Action queue, alerts, activity feed, and system health monitoring.',
    icon: Workflow,
  },
  {
    to: '/admin/rfq-readiness',
    title: 'Production Readiness Audit',
    description: 'Automated checks for security, email, database, and deployment readiness.',
    icon: ShieldCheck,
  },
  {
    to: '/admin/launch-checklist',
    title: 'Launch Checklist',
    description: 'Track SEO, performance, accessibility, RFQ workflow, and deployment tasks.',
    icon: ClipboardCheck,
  },
  {
    to: '/admin/launch-go-no-go',
    title: 'Launch Go/No-Go Review',
    description: 'Executive launch decision, evidence table, and sign-off notes.',
    icon: Rocket,
  },
];

const DOC_LINKS = [
  { file: 'PUBLIC_LAUNCH_PACKAGE.md', label: 'Public Launch Package' },
  { file: 'HANDOFF_NOTES.md', label: 'Technical Handoff Notes' },
  { file: 'POST_LAUNCH_MONITORING_PLAN.md', label: 'Post-Launch Monitoring Plan' },
  { file: 'ADMIN_USER_GUIDE.md', label: 'Admin User Guide' },
  { file: 'LAUNCH_GO_NO_GO_REVIEW.md', label: 'Launch Go/No-Go Review' },
];

export default function AdminHandoffCenter() {
  const { session, handleSignOut } = useOutletContext();

  return (
    <>
      <PageHead
        title="Admin Handoff Center | K&C Design and Manufacturing"
        description="Central hub for launch documentation and admin workflow links."
        noindex
      />

      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Handoff Center">
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Launch Handoff</p>
            <h2 className="mt-1 text-2xl font-bold text-charcoal">Admin Handoff Center</h2>
            <p className="mt-2 max-w-3xl text-sm text-metallic">
              Quick access to RFQ operations, launch tooling, and handoff documentation for the K&C website and RFQ platform.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-charcoal">
              <p>
                <span className="font-semibold">Production URL:</span>{' '}
                <span className="text-metallic">https://www.kcdesignmfg.com</span>
              </p>
              <p>
                <span className="font-semibold">Support:</span>{' '}
                <a href={`mailto:${COMPANY.email}`} className="text-accent hover:underline">{COMPANY.email}</a>
                {' · '}
                <a href={`tel:${COMPANY.phoneTel}`} className="text-accent hover:underline">{COMPANY.phone}</a>
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-bold text-charcoal">Admin Tools</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {HANDOFF_LINKS.map(({ to, title, description, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-accent hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-accent/10 p-3 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal group-hover:text-accent">{title}</h4>
                      <p className="mt-1 text-sm text-metallic">{description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="text-lg font-bold text-charcoal">Handoff Documentation</h3>
            </div>
            <p className="mb-4 text-sm text-metallic">
              Markdown files in the repository <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">docs/</code> folder.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {DOC_LINKS.map(({ file, label }) => (
                <li key={file} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                  <FileText className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="font-medium text-charcoal">{label}</span>
                  <span className="text-xs text-metallic">docs/{file}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="font-semibold text-charcoal">Current Launch Status</h3>
            <p className="mt-2 text-sm text-charcoal">
              Executive decision: <strong>No-Go</strong> until RFQ submission, email delivery, admin access, and custom domain cutover are verified.
              Update status in the Launch Go/No-Go Review after remediation.
            </p>
          </section>
        </div>
      </AdminLayout>
    </>
  );
}
