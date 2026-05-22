-- Repair migration: apply optional content-table FK links when prerequisites exist.
-- Run after 018_customer_reference_permission_tracking.sql
--
-- If you saw "relation public.testimonials does not exist", apply these first:
--   015_case_study_photo_upload_workflow.sql
--   016_testimonial_capture_publishing_workflow.sql
-- Then re-run this migration (or db push).

DO $$
BEGIN
  IF to_regclass('public.testimonials') IS NOT NULL
     AND to_regclass('public.customer_references') IS NOT NULL THEN
    ALTER TABLE public.testimonials
      ADD COLUMN IF NOT EXISTS customer_reference_id uuid;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'testimonials_customer_reference_id_fkey') THEN
      ALTER TABLE public.testimonials
        ADD CONSTRAINT testimonials_customer_reference_id_fkey
        FOREIGN KEY (customer_reference_id) REFERENCES public.customer_references(id) ON DELETE SET NULL;
    END IF;

    CREATE INDEX IF NOT EXISTS testimonials_customer_reference_idx
      ON public.testimonials (customer_reference_id);
  END IF;

  IF to_regclass('public.case_studies') IS NOT NULL
     AND to_regclass('public.customer_references') IS NOT NULL THEN
    ALTER TABLE public.case_studies
      ADD COLUMN IF NOT EXISTS customer_reference_id uuid;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_customer_reference_id_fkey') THEN
      ALTER TABLE public.case_studies
        ADD CONSTRAINT case_studies_customer_reference_id_fkey
        FOREIGN KEY (customer_reference_id) REFERENCES public.customer_references(id) ON DELETE SET NULL;
    END IF;

    CREATE INDEX IF NOT EXISTS case_studies_customer_reference_idx
      ON public.case_studies (customer_reference_id);
  END IF;

  IF to_regclass('public.case_study_photos') IS NOT NULL
     AND to_regclass('public.customer_references') IS NOT NULL THEN
    ALTER TABLE public.case_study_photos
      ADD COLUMN IF NOT EXISTS customer_reference_id uuid;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_study_photos_customer_reference_id_fkey') THEN
      ALTER TABLE public.case_study_photos
        ADD CONSTRAINT case_study_photos_customer_reference_id_fkey
        FOREIGN KEY (customer_reference_id) REFERENCES public.customer_references(id) ON DELETE SET NULL;
    END IF;

    CREATE INDEX IF NOT EXISTS case_study_photos_customer_reference_idx
      ON public.case_study_photos (customer_reference_id);
  END IF;

  IF to_regclass('public.customer_approval_requests') IS NOT NULL
     AND to_regclass('public.customer_references') IS NOT NULL THEN
    ALTER TABLE public.customer_approval_requests
      ADD COLUMN IF NOT EXISTS customer_reference_id uuid;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_approval_requests_customer_reference_id_fkey') THEN
      ALTER TABLE public.customer_approval_requests
        ADD CONSTRAINT customer_approval_requests_customer_reference_id_fkey
        FOREIGN KEY (customer_reference_id) REFERENCES public.customer_references(id) ON DELETE SET NULL;
    END IF;

    CREATE INDEX IF NOT EXISTS customer_approval_requests_reference_idx
      ON public.customer_approval_requests (customer_reference_id);
  END IF;

  IF to_regclass('public.customer_approval_requests') IS NOT NULL
     AND to_regclass('public.testimonials') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_approval_requests_related_testimonial_id_fkey') THEN
    ALTER TABLE public.customer_approval_requests
      ADD CONSTRAINT customer_approval_requests_related_testimonial_id_fkey
      FOREIGN KEY (related_testimonial_id) REFERENCES public.testimonials(id) ON DELETE SET NULL;
  END IF;

  IF to_regclass('public.customer_approval_requests') IS NOT NULL
     AND to_regclass('public.case_studies') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customer_approval_requests_related_case_study_id_fkey') THEN
    ALTER TABLE public.customer_approval_requests
      ADD CONSTRAINT customer_approval_requests_related_case_study_id_fkey
      FOREIGN KEY (related_case_study_id) REFERENCES public.case_studies(id) ON DELETE SET NULL;
  END IF;
END $$;
