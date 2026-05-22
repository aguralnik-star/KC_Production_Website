export default function EquipmentCard({ icon: Icon, title, description, items = [] }) {
  return (
    <article className="card h-full">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-charcoal text-accent-light">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
          {description && <p className="mt-1 text-sm leading-relaxed text-metallic">{description}</p>}
        </div>
      </div>
      {items.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-charcoal">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
