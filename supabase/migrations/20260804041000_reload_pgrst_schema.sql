-- Fix for PostgREST schema cache after creating new RPC functions.
-- Ensures RPC endpoints are immediately visible without waiting for auto-reload.
NOTIFY pgrst, 'reload schema';

