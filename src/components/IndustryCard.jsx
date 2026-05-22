export default function IndustryCard({ icon: Icon, title, description }) {
  return (
    <article className="card h-full">
      {Icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-charcoal text-accent-light">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="text-base font-semibold text-charcoal">{title}</h3>
      {description && <p className="mt-2 text-sm leading-relaxed text-metallic">{description}</p>}
    </article>
  );
}
