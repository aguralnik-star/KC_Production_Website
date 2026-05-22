import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'kc_rfq_draft_v1';
const SAVE_DELAY_MS = 400;

const DRAFT_FIELDS = [
  'name',
  'company',
  'email',
  'phone',
  'projectType',
  'material',
  'quantity',
  'timeline',
  'notes',
];

function pickDraftFields(form) {
  return DRAFT_FIELDS.reduce((draft, key) => {
    draft[key] = form[key] ?? '';
    return draft;
  }, {});
}

function hasDraftContent(draft) {
  return DRAFT_FIELDS.some((key) => Boolean(draft[key]?.trim?.()));
}

export function useRFQDraftAutosave(form, setForm) {
  const [draftRestored, setDraftRestored] = useState(false);
  const saveTimerRef = useRef(null);
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed?.form || !hasDraftContent(parsed.form)) return;

      setForm((prev) => ({ ...prev, ...parsed.form }));
      setDraftRestored(true);
    } catch {
      // Ignore invalid draft payloads.
    }
  }, [setForm]);

  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const draft = pickDraftFields(form);
      if (!hasDraftContent(draft)) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          form: draft,
          updatedAt: new Date().toISOString(),
        }),
      );
    }, SAVE_DELAY_MS);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [form]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDraftRestored(false);
  }, []);

  const dismissDraftNotice = useCallback(() => {
    setDraftRestored(false);
  }, []);

  return {
    draftRestored,
    clearDraft,
    dismissDraftNotice,
  };
}
