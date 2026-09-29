-- ==============================================================================
-- J-TRAIN: Japanese Competition Training Platform (MAN 1 Pasuruan)
-- SUPABASE RELATIONAL DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('siswa', 'sensei');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE competition_category_enum AS ENUM ('kanji', 'cerdas_cermat', 'kikikakitori', 'rodoku', 'seiyu', 'shodou');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nisn VARCHAR(20) UNIQUE,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'siswa'::user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. PRACTICE SETS TABLE
CREATE TABLE IF NOT EXISTS public.practice_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category competition_category_enum NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(50) DEFAULT 'Menengah',
    duration_minutes INT DEFAULT 0, -- 0 jika tanpa batas waktu
    audio_reference_url TEXT, -- untuk rodoku/seiyu/kikikakitori
    script_content TEXT, -- teks naskah bacaan / furigana
    is_published BOOLEAN DEFAULT false NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb, -- Atribut unik adaptif per cabang lomba
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_id UUID NOT NULL REFERENCES public.practice_sets(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    audio_url TEXT,
    image_url TEXT,
    options JSONB NOT NULL, -- Format: [{"key": "A", "text": "xxx"}, {"key": "B", "text": "yyy"}]
    correct_key VARCHAR(5) NOT NULL, -- "A", "B", "C", atau "D"
    explanation TEXT,
    metadata JSONB DEFAULT '{}'::jsonb, -- Atribut unik adaptif per butir soal (rubrik, emosi, dikte normalisasi, dll.)
    order_index INT DEFAULT 1 NOT NULL
);

-- 5. PRACTICE RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.practice_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    set_id UUID NOT NULL REFERENCES public.practice_sets(id) ON DELETE CASCADE,
    category competition_category_enum NOT NULL,
    score NUMERIC(5,2), -- NULL untuk latihan non-kuis (Rodoku/Seiyu/Shodou)
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    time_spent_seconds INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT true NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_results ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES
-- Profiles
DROP POLICY IF EXISTS "Public profiles can be viewed by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles can be viewed by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Practice Sets
DROP POLICY IF EXISTS "Published sets are viewable by all authenticated users" ON public.practice_sets;
CREATE POLICY "Published sets are viewable by all authenticated users" 
ON public.practice_sets FOR SELECT TO authenticated USING (
    is_published = true OR auth.jwt() ->> 'role' = 'sensei' OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'sensei')
);

DROP POLICY IF EXISTS "Sensei can manage practice sets" ON public.practice_sets;
CREATE POLICY "Sensei can manage practice sets" 
ON public.practice_sets ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'sensei')
);

-- Questions
DROP POLICY IF EXISTS "Questions viewable with practice set" ON public.questions;
CREATE POLICY "Questions viewable with practice set" 
ON public.questions FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.practice_sets ps 
        WHERE ps.id = questions.set_id AND (ps.is_published = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'sensei'))
    )
);

DROP POLICY IF EXISTS "Sensei can manage questions" ON public.questions;
CREATE POLICY "Sensei can manage questions" 
ON public.questions ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'sensei')
);

-- Practice Results
DROP POLICY IF EXISTS "Siswa can view own results" ON public.practice_results;
CREATE POLICY "Siswa can view own results" 
ON public.practice_results FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Siswa can insert own results" ON public.practice_results;
CREATE POLICY "Siswa can insert own results" 
ON public.practice_results FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Sensei can view all results" ON public.practice_results;
CREATE POLICY "Sensei can view all results" 
ON public.practice_results FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'sensei')
);

-- 8. HELPER VIEWS FOR SENSEI ANALYTICS
CREATE OR REPLACE VIEW public.student_analytics_summary AS
SELECT 
    p.id AS user_id,
    p.full_name,
    p.nisn,
    p.avatar_url,
    COUNT(pr.id) AS total_sessions_completed,
    AVG(pr.score) FILTER (WHERE pr.score IS NOT NULL) AS average_score,
    MAX(pr.completed_at) AS last_active_at,
    (
        SELECT category FROM public.practice_results 
        WHERE user_id = p.id 
        GROUP BY category 
        ORDER BY count(*) DESC 
        LIMIT 1
    ) AS primary_focus_category,
    CASE 
        WHEN AVG(pr.score) >= 80 THEN 'Siap Lomba'
        WHEN AVG(pr.score) >= 65 THEN 'Berkembang'
        ELSE 'Butuh Bimbingan'
    END AS readiness_status
FROM public.profiles p
LEFT JOIN public.practice_results pr ON pr.user_id = p.id
WHERE p.role = 'siswa'
GROUP BY p.id, p.full_name, p.nisn, p.avatar_url;
