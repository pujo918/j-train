'use client';

import React from 'react';
import {
  Swords,
  Laptop,
  Smartphone,
  Volume2,
  VolumeX,
  Play,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { CC_SIMULATION_PACKAGES } from '@/lib/data/cerdasCermatModuleData';
import { DuelConfig, DuelDeviceMode } from './types';

interface DuelLobbyProps {
  config: DuelConfig;
  onChangeConfig: (next: DuelConfig) => void;
  onStartMatch: () => void;
}

const KEYBOARD_ROWS: { left: string[]; right: string[] }[] = [
  { left: ['1', '2', '3', '4', '5'], right: ['6', '7', '8', '9', '0'] },
  { left: ['Q', 'W', 'E', 'R', 'T'], right: ['Y', 'U', 'I', 'O', 'P'] },
  { left: ['A', 'S', 'D', 'F', 'G'], right: ['H', 'J', 'K', 'L', ';'] },
  { left: ['Z', 'X', 'C', 'V', 'B'], right: ['N', 'M', ',', '.', '/'] },
];

export const DuelLobby: React.FC<DuelLobbyProps> = ({
  config,
  onChangeConfig,
  onStartMatch,
}) => {
  const update = (partial: Partial<DuelConfig>) => {
    onChangeConfig({ ...config, ...partial });
  };

  const canStart =
    config.player1Name.trim().length > 0 && config.player2Name.trim().length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* VS MATCHUP STAGE HEADER (Dark Sumi Esports Aesthetic) */}
      <div className="panel-frost-glass rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        {/* Subtle Japanese Kanji Watermark */}
        <div className="absolute right-6 -bottom-6 text-[110px] font-jp font-black text-sumi/[0.04] select-none pointer-events-none leading-none">
          勝負
        </div>

        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-3 mb-6 relative">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-sumi-charcoal">
            <Swords className="w-4 h-4 text-crimson" />
            <span>Duel Cerdas Cermat 1v1</span>
          </div>

          <button
            type="button"
            onClick={() => update({ soundEnabled: !config.soundEnabled })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              config.soundEnabled
                ? 'bg-white/75 border-sumi-border text-sumi hover:bg-white'
                : 'bg-white/40 border-sumi-border text-sumi-muted hover:text-sumi'
            }`}
          >
            {config.soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-crimson" />
                <span>Suara Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Suara Mati</span>
              </>
            )}
          </button>
        </div>

        {/* VS Player Name Stage */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center relative">
          {/* Player 1 Input */}
          <div className="md:col-span-5 bg-white/75 border border-sumi-border focus-within:border-crimson rounded-2xl p-4 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-crimson">
                Player 1
              </span>
              <span className="text-[11px] font-medium text-sumi-muted">
                {config.deviceMode === 'pc_buzzer' ? 'Keyboard Kiri' : 'Giliran Pertama'}
              </span>
            </div>
            <input
              type="text"
              maxLength={22}
              value={config.player1Name}
              onChange={(e) => update({ player1Name: e.target.value })}
              placeholder="Nama Player 1"
              className="w-full bg-transparent text-lg sm:text-xl font-extrabold text-sumi placeholder:text-sumi-muted focus:outline-none px-2 py-1 rounded-lg"
            />
          </div>

          {/* Center VS Emblem */}
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="w-11 h-11 rounded-2xl bg-crimson flex items-center justify-center font-black text-sm tracking-tighter text-white shadow-float rotate-3">
              VS
            </div>
          </div>

          {/* Player 2 Input */}
          <div className="md:col-span-5 bg-white/75 border border-sumi-border focus-within:border-sky-500 rounded-2xl p-4 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-sky-600 dark:text-sky-400">
                Player 2
              </span>
              <span className="text-[11px] font-medium text-sumi-muted">
                {config.deviceMode === 'pc_buzzer' ? 'Keyboard Kanan' : 'Giliran Kedua'}
              </span>
            </div>
            <input
              type="text"
              maxLength={22}
              value={config.player2Name}
              onChange={(e) => update({ player2Name: e.target.value })}
              placeholder="Nama Player 2"
              className="w-full bg-transparent text-lg sm:text-xl font-extrabold text-sumi placeholder:text-sumi-muted focus:outline-none px-2 py-1 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN SETUP BENTO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT (7 COLS): DEVICE MODE + VISUAL KEYBOARD MAP */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-sumi-border p-5 sm:p-6 space-y-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-sumi">
              Mode Perangkat
            </h2>
            <span className="text-xs font-medium text-sumi-muted">
              1 Layar Penuh • Tanpa Split-Screen
            </span>
          </div>

          {/* Segmented Mode Selector */}
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                {
                  id: 'pc_buzzer' as DuelDeviceMode,
                  label: 'PC / Laptop',
                  desc: 'Rebutan Keyboard Kiri vs Kanan',
                  icon: <Laptop className="w-4 h-4" />,
                },
                {
                  id: 'hp_passplay' as DuelDeviceMode,
                  label: 'HP / Mobile',
                  desc: 'Main Bergantian (Aman Layar)',
                  icon: <Smartphone className="w-4 h-4" />,
                },
              ] as const
            ).map((item) => {
              const active = config.deviceMode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update({ deviceMode: item.id })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    active
                      ? 'border-sumi bg-sumi text-white shadow-sm'
                      : 'border-sumi-border bg-washi/50 text-sumi hover:border-sumi/40'
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold text-sm">
                    <span className={active ? 'text-crimson-scarlet' : 'text-sumi-charcoal'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      active ? 'text-white/70' : 'text-sumi-muted'
                    }`}
                  >
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Visual Guide depending on selected mode */}
          {config.deviceMode === 'pc_buzzer' ? (
            <div className="rounded-2xl bg-washi border border-sumi-border/80 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-crimson">
                  Zona P1: {config.player1Name || 'Player 1'}
                </span>
                <span className="hidden sm:inline text-[11px] font-semibold text-sumi-muted">
                  Tekan tombol mana saja di sisimu
                </span>
                <span className="font-bold text-sky-700">
                  Zona P2: {config.player2Name || 'Player 2'}
                </span>
              </div>

              {/* Miniature Visual QWERTY Keyboard */}
              <div className="space-y-1.5 select-none">
                {KEYBOARD_ROWS.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-10 gap-1">
                    {row.left.map((k) => (
                      <div
                        key={k}
                        className="h-8 rounded-lg bg-crimson/10 border border-crimson/25 text-crimson font-mono text-xs font-extrabold flex items-center justify-center"
                      >
                        {k}
                      </div>
                    ))}
                    {row.right.map((k) => (
                      <div
                        key={k}
                        className="h-8 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-700 font-mono text-xs font-extrabold flex items-center justify-center"
                      >
                        {k}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-sumi-charcoal text-center pt-0.5">
                Termasuk <span className="font-semibold">Shift/Ctrl Kiri</span> untuk P1, serta{' '}
                <span className="font-semibold">Enter, Backspace, Panah &amp; Shift Kanan</span> untuk P2.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-washi border border-sumi-border/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-sumi">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sistem Giliran Aman Layar HP</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-center">
                {[
                  { step: '01', title: 'Giliran P1', sub: 'Jawab semua soal' },
                  { step: '02', title: 'Oper HP', sub: 'Skor dirahasiakan' },
                  { step: '03', title: 'Giliran P2', sub: 'Soal sama persis' },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="p-3 rounded-xl bg-white border border-sumi-border/70"
                  >
                    <span className="text-[10px] font-black text-crimson tracking-widest">
                      TAHAP {s.step}
                    </span>
                    <p className="text-xs font-extrabold text-sumi mt-0.5">{s.title}</p>
                    <p className="text-[11px] text-sumi-muted">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT (5 COLS): MATCH SETTINGS & START CTA */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-sumi-border p-5 sm:p-6 space-y-5 shadow-card">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-sumi">
            Pengaturan Pertandingan
          </h2>

          {/* Package Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-sumi-charcoal">
              Materi / Paket Soal
            </label>
            <select
              value={config.packageId}
              onChange={(e) => update({ packageId: e.target.value })}
              aria-label="Pilih Paket Soal Duel"
              className="w-full px-3.5 py-2.5 rounded-xl border border-sumi-border bg-washi/40 text-xs sm:text-sm font-semibold text-sumi focus:outline-none focus:border-sumi cursor-pointer"
            >
              <option value="all">Acak Semua Paket (160 Soal)</option>
              {CC_SIMULATION_PACKAGES.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title}
                </option>
              ))}
            </select>
          </div>

          {/* Round Count */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-sumi-charcoal">
              Jumlah Ronde
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([5, 10, 15] as const).map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => update({ roundCount: cnt })}
                  className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                    config.roundCount === cnt
                      ? 'bg-sumi text-white border-sumi'
                      : 'bg-washi/50 text-sumi-charcoal border-sumi-border hover:border-sumi/40'
                  }`}
                >
                  {cnt} Soal
                </button>
              ))}
            </div>
          </div>

          {/* Steal Toggle (PC Mode) */}
          {config.deviceMode === 'pc_buzzer' && (
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-washi/70 border border-sumi-border/70">
              <div className="flex items-start gap-2.5">
                <RefreshCw className="w-4 h-4 text-sumi-charcoal mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-extrabold text-sumi">
                    Lempar Soal (Steal)
                  </p>
                  <p className="text-[11px] text-sumi-muted">
                    Salah jawab langsung dilempar ke lawan
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config.enableSteal}
                onClick={() => update({ enableSteal: !config.enableSteal })}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors flex-shrink-0 ${
                  config.enableSteal ? 'bg-crimson' : 'bg-sumi-border'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    config.enableSteal ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Scoring Summary Strip */}
          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="py-2 rounded-xl bg-emerald-50 border border-emerald-200/80">
              <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                Benar
              </span>
              <span className="text-sm font-black text-emerald-800">+100 Poin</span>
            </div>
            <div className="py-2 rounded-xl bg-red-50 border border-red-200/80">
              <span className="text-[10px] font-bold uppercase text-red-700 block">
                Salah
              </span>
              <span className="text-sm font-black text-red-800">-50 Poin</span>
            </div>
          </div>

          {/* Launch Button */}
          <button
            type="button"
            disabled={!canStart}
            onClick={onStartMatch}
            className="w-full py-3.5 rounded-2xl bg-crimson hover:bg-crimson-dark disabled:opacity-50 text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-float transition-all active:scale-[0.99]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>MULAI DUEL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
