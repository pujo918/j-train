import { Question } from '@/types';

export type DuelDeviceMode = 'pc_buzzer' | 'hp_passplay';

export interface DuelConfig {
  deviceMode: DuelDeviceMode;
  player1Name: string;
  player2Name: string;
  packageId: string; // 'all' or 'set-cc-1'..'set-cc-8'
  roundCount: 5 | 10 | 15;
  enableSteal: boolean; // PC mode: if wrong, opponent can steal
  soundEnabled: boolean;
}

export interface DuelPlayerStats {
  name: string;
  score: number;
  correct: number;
  wrong: number;
  maxStreak: number;
  totalResponseMs: number;
  answeredCount: number;
}

export interface DuelRoundHistoryItem {
  question: Question;
  p1Answer?: string;
  p2Answer?: string;
  p1Correct?: boolean;
  p2Correct?: boolean;
  winner?: 1 | 2 | 'both' | 'none';
  p1PointsDelta: number;
  p2PointsDelta: number;
}

export interface DuelMatchSummary {
  config: DuelConfig;
  player1: DuelPlayerStats;
  player2: DuelPlayerStats;
  history: DuelRoundHistoryItem[];
}
