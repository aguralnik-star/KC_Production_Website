export default function RFQFieldHelpText({ children, id, variant = 'default' }) {
  const className = variant === 'warning' ? 'rfq-field-help rfq-field-help--warning' : 'rfq-field-help';

  return (
    <p id={id} className={className}>
      {children}
    </p>
  );
}
