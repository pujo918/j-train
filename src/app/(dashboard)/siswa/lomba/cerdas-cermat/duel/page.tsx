'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/data/store';
import { CC_ADDITIONAL_QUESTIONS } from '@/lib/data/cerdasCermatModuleData';
import { Question } from '@/types';
import { DuelLobby } from '@/components/duel/DuelLobby';
import { DuelPCBuzzerArena } from '@/components/duel/DuelPCBuzzerArena';
import { DuelHPPassPlayArena } from '@/components/duel/DuelHPPassPlayArena';
import { DuelResult } from '@/components/duel/DuelResult';
import { DuelConfig, DuelMatchSummary } from '@/components/duel/types';

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function CerdasCermatDuelPage() {
  const { currentUser } = useAppStore();

  const [stage, setStage] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [config, setConfig] = useState<DuelConfig>({
    deviceMode: 'pc_buzzer',
    player1Name: currentUser?.full_name?.split(' ')[0] || 'Player 1',
    player2Name: 'Player 2',
    packageId: 'all',
    roundCount: 10,
    enableSteal: true,
    soundEnabled: true,
  });

  const [matchQuestions, setMatchQuestions] = useState<Question[]>([]);
  const [matchKey, setMatchKey] = useState(0);
  const [summary, setSummary] = useState<DuelMatchSummary | null>(null);

  const pickQuestions = (cfg: DuelConfig): Question[] => {
    const pool: Question[] =
      cfg.packageId === 'all'
        ? Object.values(CC_ADDITIONAL_QUESTIONS).flat()
        : CC_ADDITIONAL_QUESTIONS[cfg.packageId] ||
          Object.values(CC_ADDITIONAL_QUESTIONS).flat();

    return shuffleArray(pool).slice(0, Math.min(cfg.roundCount, pool.length));
  };

  const handleStartMatch = () => {
    const picked = pickQuestions(config);
    setMatchQuestions(picked);
    setMatchKey((k) => k + 1);
    setSummary(null);
    setStage('playing');
  };

  const handleFinishMatch = (res: DuelMatchSummary) => {
    setSummary(res);
    setStage('result');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Breadcrumb (hidden during active match to maximize focus) */}
      {stage !== 'playing' && (
        <nav className="flex items-center gap-1.5 text-xs font-bold text-sumi bg-legible-text">
          <Link href="/siswa" className="hover:text-crimson transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link
            href="/siswa/lomba/cerdas-cermat"
            className="hover:text-crimson transition-colors"
          >
            Cerdas Cermat
          </Link>
          <span>/</span>
          <span className="text-crimson font-extrabold">Duel 1v1</span>
        </nav>
      )}

      {stage === 'lobby' && (
        <DuelLobby
          config={config}
          onChangeConfig={setConfig}
          onStartMatch={handleStartMatch}
        />
      )}

      {stage === 'playing' && matchQuestions.length > 0 && (
        config.deviceMode === 'pc_buzzer' ? (
          <DuelPCBuzzerArena
            key={matchKey}
            config={config}
            questions={matchQuestions}
            onFinish={handleFinishMatch}
            onExit={() => setStage('lobby')}
          />
        ) : (
          <DuelHPPassPlayArena
            key={matchKey}
            config={config}
            questions={matchQuestions}
            onFinish={handleFinishMatch}
            onExit={() => setStage('lobby')}
          />
        )
      )}

      {stage === 'result' && summary && (
        <DuelResult
          summary={summary}
          onRematch={handleStartMatch}
          onBackToLobby={() => setStage('lobby')}
        />
      )}
    </div>
  );
}
