export default function CapabilityCard({ icon: Icon, title, description, details = [] }) {
  return (
    <article className="card group h-full">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>
      {details.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          {details.map((detail) => (
            <li key={detail} className="flex items-start gap-2 text-sm text-charcoal">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {detail}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
