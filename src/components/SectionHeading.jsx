export default function SectionHeading({
  label,
  title,
  description,
  align = 'left',
  dark = false,
  className = '',
  titleId,
}) {
  const alignClass =
    align === 'center' ? 'mx-auto max-w-3xl text-center' : align === 'right' ? 'ml-auto max-w-3xl text-right' : 'max-w-3xl';

  return (
    <div className={`${alignClass} ${className}`}>
      {label && (
        <p className={`mb-3 text-sm font-semibold uppercase tracking-widest ${dark ? 'text-accent-light' : 'text-accent'}`}>
          {label}
        </p>
      )}
      <h2
        id={titleId}
        className={`text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight ${dark ? 'text-white' : 'text-charcoal'}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-slate-400' : 'text-metallic'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
