'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Award, 
  Play, 
  Pause, 
  Volume2, 
  FileText, 
  Save, 
  Check, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { StudentHubProfile } from '@/lib/data/senseiHubData';
import { PrePostLineChart } from './PrePostLineChart';
import { HanshiPreview } from './HanshiPreview';

interface StudentDrilldownDrawerProps {
  student: StudentHubProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveNotes?: (studentId: string, notes: string) => void;
  onOpenLightbox?: (sheetData: { kanji: string; studentName: string }) => void;
}

export const StudentDrilldownDrawer: React.FC<StudentDrilldownDrawerProps> = ({
  student,
  isOpen,
  onClose,
  onSaveNotes,
  onOpenLightbox,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeNotes, setActiveNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [playingRecId, setPlayingRecId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (student) {
      setActiveNotes(student.notes || '');
      setIsSaved(false);
      setPlayingRecId(null);
    }
  }, [student]);

  if (!isOpen || !student || !mounted) return null;

  const handleSave = () => {
    if (onSaveNotes && student) {
      onSaveNotes(student.id, activeNotes);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  const togglePlayRecording = (recId: string) => {
    if (playingRecId === recId) {
      setPlayingRecId(null);
    } else {
      setPlayingRecId(recId);
    }
  };

  const initialScore = student.prePostScores[0]?.score || 0;
  const finalScore = student.prePostScores[student.prePostScores.length - 1]?.score || 0;
  const deltaScore = finalScore - initialScore;

  const content = (
    <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-sumi/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col z-[101] transform transition-transform duration-300 ease-in-out border-l border-sumi-border">
        {/* Drawer Header (Fixed at top) */}
        <div className="p-4 sm:p-5 border-b border-sumi-border bg-[#FAF7F2] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-crimson text-white font-black text-base flex items-center justify-center shadow-xs flex-shrink-0">
              {student.avatar}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-sumi">
                  {student.name}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  student.readiness === 'Siap Lomba'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : student.readiness === 'Berkembang'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {student.readiness}
                </span>
              </div>
              <p className="text-[11px] text-sumi-charcoal">
                NISN: <span className="font-mono">{student.nisn}</span> • Cabang: <strong className="text-sumi">{student.focusCategoryName} ({student.focusCategoryKanji})</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-sumi-muted hover:text-sumi hover:bg-white border border-transparent hover:border-sumi-border transition-colors flex-shrink-0"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Section 1: Pre-Test vs Post-Test Progress */}
          <div className="bg-white p-4 rounded-2xl border border-sumi-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sumi-charcoal">
                  GRAFIK TREN PERFORMA
                </span>
                <h4 className="text-xs font-bold text-sumi">PRE-TEST VS POST-TEST</h4>
              </div>
              <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                deltaScore >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {deltaScore >= 0 ? `+${deltaScore}` : deltaScore} Pts Loncatan
              </div>
            </div>

            <PrePostLineChart scores={student.prePostScores} height={135} />

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sumi-border/60 text-[11px]">
              <div className="bg-[#FAF7F2] p-2 rounded-xl text-center">
                <span className="text-[10px] text-sumi-muted block uppercase">Skor Awal Masuk</span>
                <span className="font-black text-sumi text-sm">{initialScore} Pts</span>
              </div>
              <div className="bg-[#FAF7F2] p-2 rounded-xl text-center">
                <span className="text-[10px] text-sumi-muted block uppercase">Simulasi Mutakhir</span>
                <span className="font-black text-crimson text-sm">{finalScore} Pts</span>
              </div>
            </div>
          </div>

          {/* Section 2: Tasks Progress */}
          <div className="bg-white p-4 rounded-2xl border border-sumi-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-sumi-charcoal">
                DAFTAR TUGAS & PROGRES MODUL
              </span>
              <span className="text-[10px] text-sumi-muted font-bold">
                {student.tasks.filter(t => t.isCompleted).length} / {student.tasks.length} Tuntas
              </span>
            </div>

            <div className="space-y-2">
              {student.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    task.isCompleted
                      ? 'bg-white border-sumi-border/80'
                      : 'bg-[#FAF7F2]/60 border-dashed border-sumi-border text-sumi-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {task.isCompleted ? (
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${task.isPassed ? 'text-emerald-600' : 'text-amber-500'}`} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-sumi-border flex-shrink-0" />
                    )}
                    <span className={`font-semibold truncate ${task.isCompleted ? 'text-sumi' : 'text-sumi-muted'}`}>
                      {task.title}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${
                    task.isCompleted
                      ? task.isPassed
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {task.scoreText}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Calligraphy / Audio Archives */}
          {student.calligraphySheets ? (
            <div className="bg-white p-4 rounded-2xl border border-sumi-border shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-sumi-charcoal">
                  KARYA KALIGRAFI HANSHI MANDIRI
                </span>
                <span className="text-[10px] font-bold text-crimson bg-crimson-tint px-2 py-0.5 rounded-full">
                  {student.calligraphySheets.count} Lembar Masuk
                </span>
              </div>

              <div className="flex items-center gap-4 bg-[#FAF7F2] p-3 rounded-xl border border-sumi-border">
                <div className="w-20 h-24 flex-shrink-0">
                  <HanshiPreview
                    kanji={student.calligraphySheets.kanji}
                    className="w-full h-full"
                    onClick={() => {
                      if (onOpenLightbox && student.calligraphySheets) {
                        onOpenLightbox({
                          kanji: student.calligraphySheets.kanji,
                          studentName: student.name,
                        });
                      }
                    }}
                  />
                </div>

                <div className="flex-1 text-xs space-y-1">
                  <div className="font-bold text-sumi">
                    Karakter: 『{student.calligraphySheets.kanji}』 ({student.calligraphySheets.style})
                  </div>
                  <div className="text-[11px] text-sumi-charcoal">
                    Status: <strong className="text-emerald-700">{student.calligraphySheets.checklistScore}</strong>
                  </div>
                  <div className="text-[10px] text-sumi-muted">
                    Dikirim: {student.calligraphySheets.submittedAt}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenLightbox && student.calligraphySheets) {
                        onOpenLightbox({
                          kanji: student.calligraphySheets.kanji,
                          studentName: student.name,
                        });
                      }
                    }}
                    className="mt-1 text-[11px] text-crimson font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Perbesar Foto Hanshi</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ) : student.recordings.length > 0 ? (
            <div className="bg-white p-4 rounded-2xl border border-sumi-border shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-sumi-charcoal">
                  ARSIP REKAMAN SUARA MANDIRI
                </span>
                <span className="text-[10px] text-sumi-muted font-bold">
                  {student.recordings.length} Rekaman
                </span>
              </div>

              <div className="space-y-2">
                {student.recordings.map((rec) => {
                  const isPlaying = playingRecId === rec.id;
                  return (
                    <div
                      key={rec.id}
                      className="p-3 rounded-xl border border-sumi-border bg-[#FAF7F2] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <button
                          type="button"
                          onClick={() => togglePlayRecording(rec.id)}
                          className="w-8 h-8 rounded-xl bg-crimson text-white flex items-center justify-center shadow-xs hover:bg-crimson-dark transition-colors flex-shrink-0"
                          title={isPlaying ? "Jeda" : "Putar Rekaman"}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>
                        <div className="truncate">
                          <div className="font-bold text-sumi truncate">{rec.title}</div>
                          <div className="text-[10px] text-sumi-muted">
                            {rec.category} • {rec.timestamp}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="font-mono text-[11px] font-bold text-sumi-charcoal bg-white px-2 py-0.5 rounded border border-sumi-border">
                          {rec.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Section 4: Sensei Notes */}
          <div className="bg-white p-4 rounded-2xl border border-sumi-border shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-sumi-charcoal">
                CATATAN & INSTRUKSI PEMBINA (SENSEI NOTES)
              </span>
              {isSaved && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-fade-in">
                  <Check className="w-3 h-3" />
                  <span>Tersimpan</span>
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={activeNotes}
              onChange={(e) => setActiveNotes(e.target.value)}
              placeholder="Tuliskan catatan evaluasi atau poin bimbingan khusus untuk siswa ini..."
              className="w-full p-3 rounded-xl border border-sumi-border text-xs focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson resize-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="py-1.5 px-3.5 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-98"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Catatan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
