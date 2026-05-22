export default function HeroTrustBadge({ icon: Icon, children }) {
  return (
    <div className="hero-trust-badge">
      {Icon ? (
        <span className="hero-trust-badge__icon" aria-hidden="true">
          <Icon className="h-4 w-4" />
        </span>
      ) : null}
      <span>{children}</span>
    </div>
  );
}
