export const MAX_FILES = 5;
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

export const ALLOWED_EXTENSIONS = new Set([
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'dwg',
  'dxf',
  'step',
  'stp',
  'x_t',
  'sldprt',
  'sldasm',
  'zip',
]);

export const ACCEPTED_FILE_INPUT =
  '.pdf,.png,.jpg,.jpeg,.dwg,.dxf,.step,.stp,.x_t,.sldprt,.sldasm,.zip';

export function sanitizeFileName(fileName) {
  const base = fileName.split(/[/\\]/).pop() ?? 'file';
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180) || 'file';
}

export function getFileExtension(fileName) {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileTypeLabel(fileName) {
  const ext = getFileExtension(fileName);
  if (!ext) return 'File';
  return ext.toUpperCase();
}

export function validateSingleFile(file) {
  const issues = [];
  const extension = getFileExtension(file.name);

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    issues.push('unsupported_type');
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    issues.push('oversized');
  }

  return {
    valid: issues.length === 0,
    issues,
    extension,
  };
}

export function validateIncomingFiles(incomingFiles, existingFiles = []) {
  const errors = [];
  const validFiles = [];
  const combinedCount = existingFiles.length + incomingFiles.length;

  if (combinedCount > MAX_FILES) {
    errors.push(`You can upload up to ${MAX_FILES} files. Remove a file or choose fewer files.`);
    return { errors, validFiles };
  }

  for (const file of incomingFiles) {
    const result = validateSingleFile(file);
    if (!result.valid) {
      if (result.issues.includes('unsupported_type')) {
        errors.push(`"${file.name}" is not a supported file type.`);
      }
      if (result.issues.includes('oversized')) {
        errors.push(`"${file.name}" exceeds the 20 MB limit.`);
      }
      continue;
    }
    validFiles.push(file);
  }

  return { errors, validFiles };
}
