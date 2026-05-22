export function summarizeErrors(errors = []) {
  if (!errors.length) return '';
  if (errors.length === 1) return errors[0];
  return `${errors.length} issues need attention before you can continue.`;
}

export function buildDescribedBy(...ids) {
  return ids.filter(Boolean).join(' ') || undefined;
}

export function isActivationKey(event) {
  return event.key === 'Enter' || event.key === ' ';
}

export function trapFocus(container, event) {
  if (event.key !== 'Tab' || !container) return;

  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
  );

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function announceStatus(message, priority = 'polite') {
  const region = document.getElementById('kc-live-region');
  if (!region) return;
  region.setAttribute('aria-live', priority);
  region.textContent = '';
  window.requestAnimationFrame(() => {
    region.textContent = message;
  });
}
