/*
# Create gym_checkins table (single-tenant, no auth)

1. New Tables
- `gym_checkins`
  - `id` (uuid, primary key)
  - `check_in_time` (timestamptz, not null) — when the member checked in at the gym
  - `member_name` (text, not null) — name of the person signing in
  - `workout_type` (text, nullable) — optional workout type (e.g. cardio, strength, class)
  - `duration_minutes` (integer, nullable) — optional planned/actual duration
  - `note` (text, nullable) — optional free-form note
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `gym_checkins`.
- Allow anon + authenticated CRUD because the app has no sign-in screen and the data is intentionally shared/public (single gym kiosk model).

3. Indexes
- Index on `check_in_time` for date-range queries (today's sign-ins, recent visits).
*/

CREATE TABLE IF NOT EXISTS gym_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_in_time timestamptz NOT NULL DEFAULT now(),
  member_name text NOT NULL,
  workout_type text,
  duration_minutes integer,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gym_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gym_checkins" ON gym_checkins;
CREATE POLICY "anon_select_gym_checkins"
ON gym_checkins FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_gym_checkins" ON gym_checkins;
CREATE POLICY "anon_insert_gym_checkins"
ON gym_checkins FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_gym_checkins" ON gym_checkins;
CREATE POLICY "anon_update_gym_checkins"
ON gym_checkins FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_gym_checkins" ON gym_checkins;
CREATE POLICY "anon_delete_gym_checkins"
ON gym_checkins FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_gym_checkins_check_in_time ON gym_checkins (check_in_time DESC);
