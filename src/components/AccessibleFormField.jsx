import { buildDescribedBy } from '../utils/accessibilityUtils';

export default function AccessibleFormField({
  id,
  label,
  helpText,
  error,
  required = false,
  children,
  className = '',
}) {
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = buildDescribedBy(helpId, errorId);

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-charcoal">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error), errorId, helpId })}
      {helpText && (
        <p id={helpId} className="mt-1 text-xs text-metallic">
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
