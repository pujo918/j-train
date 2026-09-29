import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Profile, 
  PracticeSet, 
  Question, 
  PracticeResult, 
  ActivityFeedItem, 
  StudentAnalyticsSummary,
  CompetitionCategory,
  ReadinessStatus
} from '@/types';
import { 
  INITIAL_PROFILES, 
  INITIAL_PRACTICE_SETS, 
  INITIAL_QUESTIONS, 
  INITIAL_PRACTICE_RESULTS, 
  INITIAL_ACTIVITY_FEED 
} from './mockData';

interface AppState {
  currentUser: Profile;
  profiles: Profile[];
  practiceSets: PracticeSet[];
  questions: Question[];
  results: PracticeResult[];
  activityFeed: ActivityFeedItem[];
  targetCompetitionDate: string; // YYYY-MM-DD
  setTargetCompetitionDate: (date: string) => void;
  
  // Actions
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (data: Partial<Profile>) => void;
  
  // Practice Sets & Questions (Sensei CRUD)
  addPracticeSet: (data: Omit<PracticeSet, 'id' | 'created_at'>) => string;
  updatePracticeSet: (id: string, data: Partial<PracticeSet>) => void;
  togglePublishPracticeSet: (id: string) => void;
  deletePracticeSet: (id: string) => void;
  
  addQuestion: (data: Omit<Question, 'id'>) => string;
  updateQuestion: (id: string, data: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  importQuestionsBatch: (setId: string, items: Omit<Question, 'id'>[]) => number;

  // Practice Results (Siswa / Submissions)
  submitPracticeResult: (data: {
    set_id: string;
    category: CompetitionCategory;
    score: number | null;
    total_questions: number;
    correct_answers: number;
    time_spent_seconds: number;
    set_title: string;
    type?: 'quiz_completed' | 'voice_practiced' | 'practice_opened';
  }) => PracticeResult;

  // Analytics Helpers
  getStudentAnalytics: () => StudentAnalyticsSummary[];
  getStudentById: (userId: string) => Profile | undefined;
  getResultsForUser: (userId: string) => PracticeResult[];
  getRecentResults: (limit?: number) => PracticeResult[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: INITIAL_PROFILES[0], // Budi Santoso (siswa)
      profiles: INITIAL_PROFILES,
      practiceSets: INITIAL_PRACTICE_SETS,
      questions: INITIAL_QUESTIONS,
      results: INITIAL_PRACTICE_RESULTS,
      activityFeed: INITIAL_ACTIVITY_FEED,
      targetCompetitionDate: '2026-10-28',

      setTargetCompetitionDate: (date: string) => {
        set({ targetCompetitionDate: date });
      },

      switchUser: (userId: string) => {
        const profile = get().profiles.find(p => p.id === userId);
        if (profile) {
          set({ currentUser: profile });
        }
      },

      updateCurrentUserProfile: (data: Partial<Profile>) => {
        const { currentUser, profiles } = get();
        const updatedUser = { ...currentUser, ...data, updated_at: new Date().toISOString() };
        const updatedProfiles = profiles.map(p => p.id === updatedUser.id ? updatedUser : p);
        set({ currentUser: updatedUser, profiles: updatedProfiles });
      },

      addPracticeSet: (data) => {
        const newId = `set-${Date.now()}`;
        const newSet: PracticeSet = {
          ...data,
          id: newId,
          created_at: new Date().toISOString(),
          created_by: get().currentUser.id,
          questions_count: 0,
        };
        set(state => ({
          practiceSets: [newSet, ...state.practiceSets],
          activityFeed: [
            {
              id: `act-${Date.now()}`,
              user_id: get().currentUser.id,
              user_name: get().currentUser.full_name,
              category: newSet.category,
              title: `Mempublikasikan paket baru: ${newSet.title}`,
              time_ago: "Baru saja",
              timestamp: new Date().toISOString(),
              type: "practice_opened"
            },
            ...state.activityFeed
          ]
        }));
        return newId;
      },

      updatePracticeSet: (id, data) => {
        set(state => ({
          practiceSets: state.practiceSets.map(s => s.id === id ? { ...s, ...data } : s)
        }));
      },

      togglePublishPracticeSet: (id) => {
        set(state => ({
          practiceSets: state.practiceSets.map(s => 
            s.id === id ? { ...s, is_published: !s.is_published } : s
          )
        }));
      },

      deletePracticeSet: (id) => {
        set(state => ({
          practiceSets: state.practiceSets.filter(s => s.id !== id),
          questions: state.questions.filter(q => q.set_id !== id)
        }));
      },

      addQuestion: (data) => {
        const newId = `q-${Date.now()}`;
        const newQ: Question = {
          ...data,
          id: newId,
        };
        set(state => ({
          questions: [...state.questions, newQ],
          practiceSets: state.practiceSets.map(s => 
            s.id === data.set_id 
              ? { ...s, questions_count: (s.questions_count || 0) + 1 } 
              : s
          )
        }));
        return newId;
      },

      updateQuestion: (id, data) => {
        set(state => ({
          questions: state.questions.map(q => q.id === id ? { ...q, ...data } : q)
        }));
      },

      deleteQuestion: (id) => {
        const question = get().questions.find(q => q.id === id);
        if (!question) return;
        set(state => ({
          questions: state.questions.filter(q => q.id !== id),
          practiceSets: state.practiceSets.map(s => 
            s.id === question.set_id 
              ? { ...s, questions_count: Math.max(0, (s.questions_count || 1) - 1) } 
              : s
          )
        }));
      },

      importQuestionsBatch: (setId, items) => {
        if (!items.length) return 0;
        const newQuestions: Question[] = items.map((item, idx) => ({
          ...item,
          id: `q-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          set_id: setId,
        }));

        set(state => ({
          questions: [...state.questions, ...newQuestions],
          practiceSets: state.practiceSets.map(s => 
            s.id === setId 
              ? { ...s, questions_count: (s.questions_count || 0) + newQuestions.length } 
              : s
          )
        }));

        return newQuestions.length;
      },

      submitPracticeResult: ({ set_id, category, score, total_questions, correct_answers, time_spent_seconds, set_title, type = 'quiz_completed' }) => {
        const { currentUser } = get();
        const newResult: PracticeResult = {
          id: `res-${Date.now()}`,
          user_id: currentUser.id,
          set_id,
          category,
          score,
          total_questions,
          correct_answers,
          time_spent_seconds,
          is_completed: true,
          completed_at: new Date().toISOString(),
          set_title,
        };

        const newFeedItem: ActivityFeedItem = {
          id: `act-${Date.now()}`,
          user_id: currentUser.id,
          user_name: currentUser.full_name,
          user_avatar: currentUser.avatar_url || currentUser.full_name[0],
          category,
          title: set_title,
          score,
          timestamp: new Date().toISOString(),
          time_ago: "Baru saja",
          type,
        };

        set(state => ({
          results: [newResult, ...state.results],
          activityFeed: [newFeedItem, ...state.activityFeed.slice(0, 19)],
        }));

        return newResult;
      },

      getStudentAnalytics: () => {
        const { profiles, results } = get();
        const students = profiles.filter(p => p.role === 'siswa');

        return students.map(student => {
          const studentResults = results.filter(r => r.user_id === student.id);
          const scoredResults = studentResults.filter(r => r.score !== null);
          
          const totalSessions = studentResults.length;
          const avgScore = scoredResults.length > 0 
            ? Math.round(scoredResults.reduce((sum, r) => sum + (r.score || 0), 0) / scoredResults.length * 10) / 10
            : null;

          // Find primary category
          const catCount: Record<string, number> = {};
          studentResults.forEach(r => {
            catCount[r.category] = (catCount[r.category] || 0) + 1;
          });
          let primaryCat: CompetitionCategory = 'kanji';
          let maxCount = -1;
          for (const [cat, count] of Object.entries(catCount)) {
            if (count > maxCount) {
              maxCount = count;
              primaryCat = cat as CompetitionCategory;
            }
          }

          let readiness: ReadinessStatus = 'Berkembang';
          if (avgScore !== null) {
            if (avgScore >= 80) readiness = 'Siap Lomba';
            else if (avgScore >= 65) readiness = 'Berkembang';
            else readiness = 'Butuh Bimbingan';
          }

          const sortedResults = [...studentResults].sort((a, b) => 
            new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
          );

          const lastActive = sortedResults.length > 0 
            ? sortedResults[0].completed_at 
            : student.created_at;

          return {
            user_id: student.id,
            full_name: student.full_name,
            nisn: student.nisn || "-",
            avatar_url: student.avatar_url,
            total_sessions_completed: totalSessions,
            average_score: avgScore,
            last_active_at: lastActive,
            primary_focus_category: primaryCat,
            readiness_status: readiness,
          };
        });
      },

      getStudentById: (userId: string) => {
        return get().profiles.find(p => p.id === userId);
      },

      getResultsForUser: (userId: string) => {
        return get().results
          .filter(r => r.user_id === userId)
          .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
      },

      getRecentResults: (limit = 10) => {
        return [...get().results]
          .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
          .slice(0, limit);
      }
    }),
    {
      name: 'jtrain_app_store_v1',
    }
  )
);
