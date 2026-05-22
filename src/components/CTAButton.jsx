import { Link } from 'react-router-dom';
import { trackCTAClick } from '../utils/analytics';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-dark shadow-sm hover:shadow-md',
  secondary: 'border border-charcoal/15 bg-white text-charcoal hover:border-charcoal/30 hover:bg-slate-50',
  light: 'border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30',
  white: 'bg-white text-accent hover:bg-blue-50 shadow-sm hover:shadow-md',
};

export default function CTAButton({
  to,
  href,
  variant = 'primary',
  className = '',
  children,
  analyticsLabel,
  analyticsLocation,
  onClick,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${variants[variant]} ${className}`;

  const handleClick = (event) => {
    if (analyticsLabel && analyticsLocation) {
      trackCTAClick(analyticsLabel, analyticsLocation, to || href || '');
    }
    onClick?.(event);
  };

  if (to) {
    return (
      <Link to={to} className={classes} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={`${classes} disabled:cursor-not-allowed disabled:opacity-60`} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
