import { FileText } from 'lucide-react';

export default function HandoffDocumentCard({ document }) {
  return (
    <article className="handoff-document-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-accent/10 p-3 text-accent">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-charcoal">{document.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-metallic">{document.description}</p>
          <p className="mt-3 text-xs font-medium text-slate-500">
            Repository: <code className="rounded bg-slate-100 px-1.5 py-0.5">docs/{document.file}</code>
          </p>
        </div>
      </div>
    </article>
  );
}
