const BRIDGE_ENDPOINT = '/api/rfq-bridge';

export function mapFormToBridgePayload(form, sourcePage = '') {
  return {
    companyName: form.company?.trim() || '',
    contactName: form.name?.trim() || '',
    email: form.email?.trim() || '',
    phone: form.phone?.trim() || '',
    projectType: form.projectType?.trim() || '',
    material: form.material?.trim() || '',
    quantity: form.quantity?.trim() || '',
    deadline: form.timeline?.trim() || '',
    message: form.notes?.trim() || '',
    sourcePage: sourcePage || (typeof window !== 'undefined' ? window.location.pathname : ''),
  };
}

export async function postRFQToBridge(form, options = {}) {
  const payload = mapFormToBridgePayload(form, options.sourcePage);

  let response;

  try {
    response = await fetch(BRIDGE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Unable to submit your RFQ right now. Please try again or contact us directly.');
  }

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      typeof data.message === 'string' && data.message
        ? data.message
        : 'Unable to submit your RFQ right now. Please try again or contact us directly.',
    );
  }

  return {
    ok: true,
    submittedAt: data.submittedAt || new Date().toISOString(),
    message: data.message || 'RFQ submitted successfully.',
  };
}
