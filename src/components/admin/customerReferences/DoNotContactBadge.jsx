export default function DoNotContactBadge({ active }) {
  if (!active) return null;
  return (
    <span className="inline-flex rounded-full border border-red-300 bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-900" role="status">
      Do Not Contact
    </span>
  );
}
