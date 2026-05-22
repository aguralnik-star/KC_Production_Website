export default function QualityFeature({ icon: Icon, title, description, dark = false }) {
  return (
    <article className={dark ? 'rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm' : 'card h-full'}>
      {Icon && <Icon className={`mb-4 h-7 w-7 ${dark ? 'text-accent-light' : 'text-accent'}`} />}
      <h3 className={`font-semibold ${dark ? 'text-white' : 'text-charcoal'}`}>{title}</h3>
      <p className={`mt-2 text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-metallic'}`}>{description}</p>
    </article>
  );
}
