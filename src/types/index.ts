export type UserRole = 'siswa' | 'sensei';

export type CompetitionCategory = 
  | 'kanji' 
  | 'cerdas_cermat' 
  | 'kikikakitori' 
  | 'rodoku' 
  | 'seiyu' 
  | 'shodou';

export interface Profile {
  id: string;
  nisn?: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PracticeSet {
  id: string;
  category: CompetitionCategory;
  title: string;
  description: string;
  difficulty_level: 'Pemula (N5)' | 'Menengah (N4)' | 'Mahir (N3)' | 'Umum';
  duration_minutes: number; // 0 for self-paced
  audio_reference_url?: string;
  script_content?: string;
  is_published: boolean;
  created_by?: string;
  created_at: string;
  questions_count?: number;
  metadata?: Record<string, any>;
}

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  set_id: string;
  question_text: string;
  audio_url?: string;
  image_url?: string;
  options: QuestionOption[];
  correct_key: 'A' | 'B' | 'C' | 'D' | string;
  explanation?: string;
  order_index: number;
  metadata?: Record<string, any>;
}

export type AudioSourceType = 'recorded' | 'uploaded' | 'external_url';

export interface AudioMetadata {
  audio_source_type: AudioSourceType;
  audio_url: string;
  duration_seconds?: number;
  file_name?: string;
  file_size?: number;
}

export interface PracticeResult {
  id: string;
  user_id: string;
  set_id: string;
  category: CompetitionCategory;
  score: number | null; // null for non-quiz
  total_questions: number;
  correct_answers: number;
  time_spent_seconds: number;
  is_completed: boolean;
  completed_at: string;
  set_title?: string;
}

export type ReadinessStatus = 'Siap Lomba' | 'Berkembang' | 'Butuh Bimbingan';

export interface StudentAnalyticsSummary {
  user_id: string;
  full_name: string;
  nisn: string;
  avatar_url?: string;
  total_sessions_completed: number;
  average_score: number | null;
  last_active_at: string;
  primary_focus_category: CompetitionCategory;
  readiness_status: ReadinessStatus;
}

export interface ActivityFeedItem {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  category: CompetitionCategory;
  title: string;
  score?: number | null;
  timestamp: string;
  time_ago: string;
  type: 'quiz_completed' | 'practice_opened' | 'voice_practiced';
}

export interface CategoryInfo {
  id: CompetitionCategory;
  slug: string;
  romaji: string;
  kanji: string;
  iconName: string;
  description: string;
  type: 'interactive' | 'self_paced';
  targetOutput: string;
  badge: string;
}
