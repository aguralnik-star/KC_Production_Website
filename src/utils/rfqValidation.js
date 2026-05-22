import { MAX_FILES, validateIncomingFiles } from './rfqFileUtils';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PROJECT_TYPES = [
  'CNC Machining',
  'CNC Milling',
  'CNC Turning',
  'Prototype Machining',
  'Production Machining',
  'Tooling',
  'Fixtures',
  'Gauges',
  'Other',
];

export const TIMELINES = [
  'ASAP',
  '1-2 weeks',
  '2-4 weeks',
  '1-2 months',
  'Flexible',
  'Not sure yet',
];

export const REQUIRED_FIELD_KEYS = ['name', 'email'];

export const RECOMMENDED_FIELD_KEYS = ['company', 'projectType', 'material', 'quantity', 'timeline', 'notes'];

export const FIELD_LABELS = {
  name: 'Name',
  email: 'Email',
  company: 'Company',
  projectType: 'Project type',
  material: 'Material',
  quantity: 'Quantity',
  timeline: 'Timeline',
  notes: 'Project notes',
};

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email.trim());
}

export function validateRequiredFields(formData) {
  const fieldErrors = {};
  const messages = [];

  if (!formData.name?.trim()) {
    fieldErrors.name = 'Please enter your name.';
    messages.push('Name is required.');
  }

  if (!formData.email?.trim()) {
    fieldErrors.email = 'Please enter your email address.';
    messages.push('Email is required.');
  } else if (!isValidEmail(formData.email)) {
    fieldErrors.email = 'Please enter a valid email address so we can follow up on your RFQ.';
    messages.push('Please enter a valid email address.');
  }

  return { fieldErrors, messages };
}

export function validateRFQInput(formData, files = []) {
  const { fieldErrors, messages } = validateRequiredFields(formData);
  const fileErrors = [];

  if (files.length > MAX_FILES) {
    fileErrors.push(`You can upload up to ${MAX_FILES} files.`);
  }

  for (const file of files) {
    const { errors } = validateIncomingFiles([file], files.filter((item) => item !== file));
    fileErrors.push(...errors);
  }

  return {
    fieldErrors,
    requiredMessages: messages,
    fileErrors: [...new Set(fileErrors)],
    messages: [...messages, ...fileErrors],
  };
}

export function getRecommendedWarnings(formData, files = []) {
  const warnings = [];

  if (!files.length) {
    warnings.push({
      field: 'files',
      message: 'Adding drawings or files helps us quote more accurately.',
    });
  }
  if (!formData.quantity?.trim()) {
    warnings.push({
      field: 'quantity',
      message: 'Quantity helps us determine setup and production requirements.',
    });
  }
  if (!formData.timeline?.trim()) {
    warnings.push({
      field: 'timeline',
      message: 'Timeline helps us understand urgency.',
    });
  }
  if (!formData.projectType?.trim()) {
    warnings.push({
      field: 'projectType',
      message: 'Project type helps us route your RFQ to the right machining workflow.',
    });
  }
  if (!formData.material?.trim()) {
    warnings.push({
      field: 'material',
      message: 'Material information helps us plan machining and sourcing.',
    });
  }

  return warnings;
}

export function isContactStepComplete(formData) {
  return Boolean(formData.name?.trim() && formData.email?.trim() && isValidEmail(formData.email));
}

export function isProjectStepComplete(formData) {
  return Boolean(
    formData.projectType?.trim()
    || formData.material?.trim()
    || formData.quantity?.trim()
    || formData.timeline?.trim()
    || formData.notes?.trim(),
  );
}

export function isFilesStepComplete(files) {
  return files.length > 0;
}

export function isStepComplete(stepId, formData, files) {
  switch (stepId) {
    case 'contact':
      return isContactStepComplete(formData);
    case 'project':
      return isProjectStepComplete(formData);
    case 'files':
      return isFilesStepComplete(files);
    case 'submit':
      return isContactStepComplete(formData);
    default:
      return false;
  }
}
