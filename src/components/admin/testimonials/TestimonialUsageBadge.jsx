export default function TestimonialUsageBadge({ usage = [] }) {
  if (!usage.length) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {usage.map((item) => (
        <span key={item} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-metallic">
          {item.replace(/_/g, ' ')}
        </span>
      ))}
    </div>
  );
}
