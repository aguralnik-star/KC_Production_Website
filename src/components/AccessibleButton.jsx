import { isActivationKey } from '../utils/accessibilityUtils';

export default function AccessibleButton({
  children,
  className = '',
  type = 'button',
  ariaLabel,
  disabled = false,
  onClick,
  onKeyDown,
  ...props
}) {
  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (disabled || type !== 'button') return;
    if (isActivationKey(event)) {
      event.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <button
      type={type}
      className={className}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
}
