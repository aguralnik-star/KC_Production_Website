export const PHOTO_CATEGORIES = [
  'facility',
  'shop',
  'machines',
  'inspection',
  'gauges',
  'fixtures',
  'tooling',
  'parts',
  'team',
];

export const PHOTO_LIBRARY = [
  {
    id: 'placeholder-facility',
    title: 'Facility Overview',
    category: 'facility',
    imageFilename: '',
    path: '',
    relatedCapability: 'General Manufacturing',
    relatedProject: '',
    isRepresentative: true,
    isCustomerApproved: false,
    approvalStatus: 'published',
    publishReady: true,
    sourceType: 'representative',
    confidentialityReviewed: true,
    approvedUsage: ['website'],
  },
  {
    id: 'placeholder-shop',
    title: 'Shop Floor',
    category: 'shop',
    imageFilename: '',
    path: '',
    relatedCapability: 'CNC Machining',
    relatedProject: '',
    isRepresentative: true,
    isCustomerApproved: false,
    approvalStatus: 'published',
    publishReady: true,
    sourceType: 'representative',
    confidentialityReviewed: true,
    approvedUsage: ['website'],
  },
];

/** Customer-approved photos — add only after explicit customer approval. */
export const REAL_PHOTOS = [];

export const FILENAME_CONVENTIONS = {
  pattern: '{category}-{subject}-{sequence}.{ext}',
  example: 'fixtures-aluminum-plate-001.jpg',
  rules: [
    'Use lowercase and hyphens only',
    'Start with category folder name',
    'No customer names or part numbers in filename',
    'Use .jpg or .webp for web delivery',
  ],
};

export function isPhotoPublishReady(photo) {
  return Boolean(
    photo?.isCustomerApproved
    && photo?.approvalStatus === 'approved'
    && photo?.publishReady
    && photo?.confidentialityReviewed
    && photo?.sourceType === 'real',
  );
}

export function getPublicPhoto(photoId, category) {
  const approved = REAL_PHOTOS.filter(isPhotoPublishReady);
  const match = photoId
    ? approved.find((p) => p.id === photoId)
    : approved.find((p) => p.category === category);
  if (match?.path) {
    return { type: 'approved', src: match.path, alt: match.title };
  }
  return { type: 'placeholder', src: null, alt: 'Industrial manufacturing placeholder' };
}

export function getPhotoLibraryPath(category, filename) {
  if (!filename) return null;
  return `/images/${category}/${filename}`;
}

export function getPhotoReplacementRecommendation(category) {
  const hasApproved = REAL_PHOTOS.some((p) => p.category === category && isPhotoPublishReady(p));
  return hasApproved
    ? 'Use approved project photo in showcase.'
    : 'Show industrial placeholder until approved photo is available.';
}
