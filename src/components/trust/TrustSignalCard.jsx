export default function TrustSignalCard({ signal, variant = 'light' }) {
  const Icon = signal.icon;

  return (
    <article className={`kc-trust-signal-card kc-trust-signal-card--${variant}`}>
      {Icon ? (
        <div className="kc-trust-signal-card__icon" aria-hidden="true">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <h3 className="kc-trust-signal-card__title">{signal.title}</h3>
      <p className="kc-trust-signal-card__description">{signal.description}</p>
    </article>
  );
}
