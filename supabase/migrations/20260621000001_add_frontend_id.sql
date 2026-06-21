-- Add frontend_id to checklist_items to support mapping to frontend string IDs
ALTER TABLE public.checklist_items ADD COLUMN IF NOT EXISTS frontend_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS checklist_items_user_frontend_idx ON public.checklist_items(user_id, frontend_id);
