'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  FileText, 
  Tag, 
  Layers,
  PenTool,
  CheckSquare,
  Square,
  Mic2,
  Loader2
} from 'lucide-react';
import { CompetitionCategory, PracticeSet, Question, QuestionOption, AudioMetadata } from '@/types';
import { AudioInputSwitcher } from './AudioInputSwitcher';

interface AdaptiveQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: Omit<Question, 'id'>) => void;
  activeSet: PracticeSet;
  initialData?: Question | null;
  totalExistingQuestions: number;
}

export function AdaptiveQuestionModal({
  isOpen,
  onClose,
  onSave,
  activeSet,
  initialData,
  totalExistingQuestions
}: AdaptiveQuestionModalProps) {
  const [mounted, setMounted] = useState(false);
  const category = activeSet.category;

  // General Quiz States (Kanji, Cerdas Cermat, Kikikakitori Multiple Choice)
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctKey, setCorrectKey] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');

  // Kanji Specific
  const [kanjiTarget, setKanjiTarget] = useState('');

  // Kikikakitori Specific
  const [kikikakitoriType, setKikikakitoriType] = useState<'pilihan_ganda' | 'dikte'>('pilihan_ganda');
  const [dictationKeywords, setDictationKeywords] = useState('');
  const [autoNormalize, setAutoNormalize] = useState(true);
  const [audioTimestamp, setAudioTimestamp] = useState('');

  // Rodoku Specific
  const [pauseGuide, setPauseGuide] = useState('');
  const [pitchAccent, setPitchAccent] = useState('');
  const [rodokuAudioUrl, setRodokuAudioUrl] = useState('');

  // Seiyu Specific
  const [characterRole, setCharacterRole] = useState('');
  const [dialogFurigana, setDialogFurigana] = useState('');
  const [emotionNote, setEmotionNote] = useState('');
  const [seiyuAudioSnippet, setSeiyuAudioSnippet] = useState('');

  // Shodou Specific
  const [stepNumber, setStepNumber] = useState<number>(1);
  const [stepTitle, setStepTitle] = useState('');
  const [rubricTome, setRubricTome] = useState(true);
  const [rubricHane, setRubricHane] = useState(true);
  const [rubricHarai, setRubricHarai] = useState(true);
  const [rubricBalance, setRubricBalance] = useState(true);
  const [rubricRakkan, setRubricRakkan] = useState(false);
  const [strokeTips, setStrokeTips] = useState('');
  // Audio Switcher Uniform State
  const [questionAudio, setQuestionAudio] = useState<AudioMetadata | null>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Preset options for characters from active package
  const availableCharacters: string[] = activeSet.metadata?.character_roles || ['Kenji', 'Aoi', 'Sensei'];

  useEffect(() => {
    if (initialData) {
      setQuestionText(initialData.question_text || '');
      setOptA(initialData.options?.[0]?.text || '');
      setOptB(initialData.options?.[1]?.text || '');
      setOptC(initialData.options?.[2]?.text || '');
      setOptD(initialData.options?.[3]?.text || '');
      setCorrectKey((['A', 'B', 'C', 'D'].includes(initialData.correct_key as any) ? initialData.correct_key : 'A') as any);
      setExplanation(initialData.explanation || '');

      const meta = initialData.metadata || {};
      const initialAudio = initialData.audio_url || meta.audio_url || '';
      if (initialAudio) {
        setQuestionAudio({
          audio_source_type: meta.audio_source_type || 'external_url',
          audio_url: initialAudio,
          duration_seconds: meta.duration_seconds || 0,
          file_name: meta.file_name || 'audio-soal.mp3',
          file_size: meta.file_size
        });
      } else {
        setQuestionAudio(null);
      }

      setKanjiTarget(meta.kanji_target || '');
      setKikikakitoriType(meta.type === 'dikte' ? 'dikte' : 'pilihan_ganda');
      setDictationKeywords(meta.dictation_keywords ? meta.dictation_keywords.join(', ') : (initialData.correct_key || ''));
      setAutoNormalize(meta.auto_normalize ?? true);
      setAudioTimestamp(meta.audio_timestamp || '');

      setPauseGuide(meta.pause_guide || '');
      setPitchAccent(meta.pitch_accent || '');
      setRodokuAudioUrl(meta.audio_url || initialData.audio_url || '');

      setCharacterRole(meta.character_role || availableCharacters[0] || 'Kenji');
      setDialogFurigana(meta.furigana_text || '');
      setEmotionNote(meta.emotion_note || '');
      setSeiyuAudioSnippet(meta.audio_url || initialData.audio_url || '');

      setStepNumber(meta.step_number || 1);
      setStepTitle(meta.step_title || '');
      setRubricTome(meta.tome_checked ?? true);
      setRubricHane(meta.hane_checked ?? true);
      setRubricHarai(meta.harai_checked ?? true);
      setRubricBalance(meta.balance_checked ?? true);
      setRubricRakkan(meta.rakkan_checked ?? false);
      setStrokeTips(meta.tips || initialData.explanation || '');
    } else {
      setQuestionText('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setCorrectKey('A');
      setExplanation('');

      setKanjiTarget('');
      setKikikakitoriType('pilihan_ganda');
      setDictationKeywords('');
      setAutoNormalize(true);
      setAudioTimestamp('');

      setPauseGuide('');
      setPitchAccent('');
      setRodokuAudioUrl('');

      setCharacterRole(availableCharacters[0] || 'Kenji');
      setDialogFurigana('');
      setEmotionNote('');
      setSeiyuAudioSnippet('');

      setStepNumber(totalExistingQuestions + 1);
      setStepTitle('');
      setRubricTome(true);
      setRubricHane(true);
      setRubricHarai(true);
      setRubricBalance(true);
      setRubricRakkan(false);
      setStrokeTips('');

      setQuestionAudio(null);
      setIsUploadingAudio(false);
      setUploadProgress(0);
    }
  }, [initialData, activeSet, totalExistingQuestions, isOpen]);

  if (!isOpen || !mounted) return null;

  const executeQuestionSave = () => {
    let finalQuestionText = questionText.trim();
    let finalOptions: QuestionOption[] = [];
    let finalCorrectKey = correctKey as string;
    let finalExplanation = explanation.trim() || undefined;
    let finalAudioUrl = undefined;
    const metadata: Record<string, any> = {};

    if (category === 'kanji') {
      if (!finalQuestionText) return;
      finalOptions = [
        { key: 'A', text: optA.trim() },
        { key: 'B', text: optB.trim() },
        { key: 'C', text: optC.trim() },
        { key: 'D', text: optD.trim() }
      ];
      metadata.kanji_target = kanjiTarget.trim() || undefined;
    } else if (category === 'cerdas_cermat') {
      if (!finalQuestionText) return;
      finalOptions = [
        { key: 'A', text: optA.trim() },
        { key: 'B', text: optB.trim() },
        { key: 'C', text: optC.trim() },
        { key: 'D', text: optD.trim() }
      ];
    } else if (category === 'kikikakitori') {
      if (!finalQuestionText) return;
      if (questionAudio) {
        finalAudioUrl = questionAudio.audio_url;
        metadata.audio_source_type = questionAudio.audio_source_type;
        metadata.audio_url = questionAudio.audio_url;
        metadata.duration_seconds = questionAudio.duration_seconds;
        metadata.file_name = questionAudio.file_name;
      }
      if (kikikakitoriType === 'dikte') {
        finalCorrectKey = dictationKeywords.trim();
        metadata.type = 'dikte';
        metadata.dictation_keywords = dictationKeywords.split(',').map(s => s.trim()).filter(Boolean);
        metadata.auto_normalize = autoNormalize;
        metadata.audio_timestamp = audioTimestamp.trim() || undefined;
      } else {
        finalOptions = [
          { key: 'A', text: optA.trim() },
          { key: 'B', text: optB.trim() },
          { key: 'C', text: optC.trim() },
          { key: 'D', text: optD.trim() }
        ];
        metadata.type = 'pilihan_ganda';
        metadata.audio_timestamp = audioTimestamp.trim() || undefined;
      }
    } else if (category === 'rodoku') {
      if (!finalQuestionText) return;
      if (questionAudio) {
        finalAudioUrl = questionAudio.audio_url;
        metadata.audio_source_type = questionAudio.audio_source_type;
        metadata.audio_url = questionAudio.audio_url;
        metadata.duration_seconds = questionAudio.duration_seconds;
        metadata.file_name = questionAudio.file_name;
      }
      metadata.pause_guide = pauseGuide.trim() || undefined;
      metadata.pitch_accent = pitchAccent.trim() || undefined;
      metadata.audio_url = finalAudioUrl;
    } else if (category === 'seiyu') {
      if (!finalQuestionText) return;
      if (questionAudio) {
        finalAudioUrl = questionAudio.audio_url;
        metadata.audio_source_type = questionAudio.audio_source_type;
        metadata.audio_url = questionAudio.audio_url;
        metadata.duration_seconds = questionAudio.duration_seconds;
        metadata.file_name = questionAudio.file_name;
      }
      metadata.character_role = characterRole;
      metadata.dialog_text = finalQuestionText;
      metadata.furigana_text = dialogFurigana.trim() || undefined;
      metadata.emotion_note = emotionNote.trim() || undefined;
      metadata.audio_url = finalAudioUrl;
      finalExplanation = emotionNote ? `Arahan: ${emotionNote}` : undefined;
    } else if (category === 'shodou') {
      finalQuestionText = `Langkah ${stepNumber}: ${stepTitle.trim() || 'Panduan Goresan'}`;
      metadata.step_number = stepNumber;
      metadata.step_title = stepTitle.trim();
      metadata.tome_checked = rubricTome;
      metadata.hane_checked = rubricHane;
      metadata.harai_checked = rubricHarai;
      metadata.balance_checked = rubricBalance;
      metadata.rakkan_checked = rubricRakkan;
      metadata.tips = strokeTips.trim() || undefined;
      finalExplanation = strokeTips.trim() || undefined;
    }

    onSave({
      set_id: activeSet.id,
      question_text: finalQuestionText,
      options: finalOptions,
      correct_key: finalCorrectKey,
      explanation: finalExplanation,
      audio_url: finalAudioUrl,
      order_index: initialData ? initialData.order_index : totalExistingQuestions + 1,
      metadata
    });

    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (['kikikakitori', 'rodoku', 'seiyu'].includes(category) && questionAudio) {
      setIsUploadingAudio(true);
      setUploadProgress(25);
      setTimeout(() => {
        setUploadProgress(65);
        setTimeout(() => {
          setUploadProgress(100);
          setTimeout(() => {
            setIsUploadingAudio(false);
            executeQuestionSave();
          }, 200);
        }, 250);
      }, 200);
    } else {
      executeQuestionSave();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-sumi/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sumi-border overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-sumi-border bg-gradient-to-r from-warm-cream/60 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-crimson-tint text-crimson flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-sumi">
                {initialData ? 'Edit Butir Soal / Konten' : 'Tambah Butir Soal Baru'}
              </h2>
              <p className="text-[11px] text-sumi-charcoal">
                Paket: <span className="font-bold text-sumi">{activeSet.title}</span> ({activeSet.category.toUpperCase()})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-sumi-light text-sumi-charcoal hover:text-sumi flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* 1. KANJI SCHEMA */}
          {category === 'kanji' && (
            <>
              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Karakter Kanji Target (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 散歩 / 借りました / 静か"
                  value={kanjiTarget}
                  onChange={(e) => setKanjiTarget(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-warm-cream/20 font-bold text-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Teks Pertanyaan / Konteks Kalimat <span className="text-crimson">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Pilihlah cara baca yang tepat untuk kata di dalam kurung: 毎朝、公園を【散歩】します。"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white resize-none"
                />
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-sumi">
                  Opsi Pilihan Jawaban (Tandai Radio untuk Kunci Benar) <span className="text-crimson">*</span>
                </label>
                
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const val = key === 'A' ? optA : key === 'B' ? optB : key === 'C' ? optC : optD;
                  const setVal = key === 'A' ? setOptA : key === 'B' ? setOptB : key === 'C' ? setOptC : setOptD;
                  const isCorrect = correctKey === key;

                  return (
                    <div 
                      key={key} 
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                        isCorrect ? 'bg-emerald-50/80 border-emerald-400' : 'bg-white border-sumi-border'
                      }`}
                    >
                      <label className="flex items-center gap-1.5 cursor-pointer px-1">
                        <input
                          type="radio"
                          name="kanji_correct_radio"
                          checked={isCorrect}
                          onChange={() => setCorrectKey(key)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-sumi-charcoal'
                        }`}>
                          {key}
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`Teks Opsi ${key}...`}
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-sumi-border/60 bg-white"
                      />
                      {isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded-md">
                          Kunci Benar
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Penjelasan Makna & Pembahasan Furigana
                </label>
                <textarea
                  rows={2}
                  placeholder="Kanji 散 (San = menyebar) dan 歩 (Po = melangkah) jika digabung dibaca 'Sanpo'..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white resize-none"
                />
              </div>
            </>
          )}

          {/* 2. CERDAS CERMAT SCHEMA */}
          {category === 'cerdas_cermat' && (
            <>
              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Teks Pertanyaan Trivia / Cepat <span className="text-crimson">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Festival musim panas di Jepang yang diadakan tanggal 7 Juli untuk merayakan..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-sumi">
                  Opsi Jawaban & Kunci Benar <span className="text-crimson">*</span>
                </label>
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const val = key === 'A' ? optA : key === 'B' ? optB : key === 'C' ? optC : optD;
                  const setVal = key === 'A' ? setOptA : key === 'B' ? setOptB : key === 'C' ? setOptC : setOptD;
                  const isCorrect = correctKey === key;

                  return (
                    <div 
                      key={key} 
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                        isCorrect ? 'bg-emerald-50/80 border-emerald-400' : 'bg-white border-sumi-border'
                      }`}
                    >
                      <label className="flex items-center gap-1.5 cursor-pointer px-1">
                        <input
                          type="radio"
                          name="cc_correct_radio"
                          checked={isCorrect}
                          onChange={() => setCorrectKey(key)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-sumi-charcoal'
                        }`}>
                          {key}
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`Teks Opsi ${key}...`}
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-sumi-border/60 bg-white"
                      />
                      {isCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded-md">
                          Kunci Benar
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Penjelasan Singkat & Fakta Budaya
                </label>
                <textarea
                  rows={2}
                  placeholder="Tanabata (七夕) dirayakan setiap 7 Juli berdasarkan legenda..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white resize-none"
                />
              </div>
            </>
          )}

          {/* 3. KIKIKAKITORI SCHEMA */}
          {category === 'kikikakitori' && (
            <>
              {/* Type Switcher */}
              <div className="flex p-1 bg-warm-cream/60 rounded-xl border border-sumi-border">
                <button
                  type="button"
                  onClick={() => setKikikakitoriType('pilihan_ganda')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    kikikakitoriType === 'pilihan_ganda'
                      ? 'bg-crimson text-white shadow-2xs'
                      : 'text-sumi-charcoal hover:text-sumi'
                  }`}
                >
                  Pilihan Ganda Menyimak
                </button>
                <button
                  type="button"
                  onClick={() => setKikikakitoriType('dikte')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    kikikakitoriType === 'dikte'
                      ? 'bg-crimson text-white shadow-2xs'
                      : 'text-sumi-charcoal hover:text-sumi'
                  }`}
                >
                  Dikte Isian Singkat (Kakitori)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Instruksi Pertanyaan Audio <span className="text-crimson">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Dengarkan pengumuman audio: Informasi apa yang disampaikan mengenai kedatangan kereta?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white resize-none"
                />
              </div>

              {kikikakitoriType === 'pilihan_ganda' ? (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-sumi">
                    Opsi Jawaban & Kunci Benar <span className="text-crimson">*</span>
                  </label>
                  {(['A', 'B', 'C', 'D'] as const).map((key) => {
                    const val = key === 'A' ? optA : key === 'B' ? optB : key === 'C' ? optC : optD;
                    const setVal = key === 'A' ? setOptA : key === 'B' ? setOptB : key === 'C' ? setOptC : setOptD;
                    const isCorrect = correctKey === key;

                    return (
                      <div 
                        key={key} 
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                          isCorrect ? 'bg-emerald-50/80 border-emerald-400' : 'bg-white border-sumi-border'
                        }`}
                      >
                        <label className="flex items-center gap-1.5 cursor-pointer px-1">
                          <input
                            type="radio"
                            name="kk_correct_radio"
                            checked={isCorrect}
                            onChange={() => setCorrectKey(key)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-sumi-charcoal'
                          }`}>
                            {key}
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={`Teks Opsi ${key}...`}
                          value={val}
                          onChange={(e) => setVal(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-sumi-border/60 bg-white"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3 p-3 rounded-2xl bg-warm-cream/30 border border-sumi-border">
                  <div>
                    <label className="block text-xs font-bold text-sumi mb-1">
                      Kata Kunci Jawaban Benar (Pisahkan Koma jika Ada Variasi) <span className="text-crimson">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: しんかんせん, 新幹線, Shinkansen"
                      value={dictationKeywords}
                      onChange={(e) => setDictationKeywords(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-sumi-border/60">
                    <div>
                      <div className="text-xs font-bold text-sumi">Normalisasi Otomatis</div>
                      <div className="text-[10px] text-sumi-charcoal">
                        Abaikan spasi ganda, huruf besar/kecil, dan konversi Zenkaku Jepang
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoNormalize}
                        onChange={(e) => setAutoNormalize(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Transkrip Audio & Pembahasan
                </label>
                <textarea
                  rows={2}
                  placeholder="Transkrip lengkap percakapan audio dan penjelasan letak jawaban..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white resize-none"
                />
              </div>
            </>
          )}

          {/* 4. RODOKU SCHEMA */}
          {category === 'rodoku' && (
            <>
              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Bait / Paragraf Teks Bacaan Latihan <span className="text-crimson">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="「子ぎつねは、手袋を買いに町へ出かけました。」"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white font-serif leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Panduan Tanda Jeda (/ dan //)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 「子ぎつねは、/ 手袋を買いに // 町へ出かけました。」"
                  value={pauseGuide}
                  onChange={(e) => setPauseGuide(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Petunjuk Intonasi (Pitch Accent)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pola Atamakadaka pada kata awal"
                  value={pitchAccent}
                  onChange={(e) => setPitchAccent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white"
                />
              </div>

              <AudioInputSwitcher
                value={questionAudio}
                onChange={setQuestionAudio}
                defaultSource="recorded"
                label="Audio Acuan Penggalan Bait Ini (.mp3)"
                helperText="Rekam intonasi Sensei untuk penggalan ini, unggah file audio, atau tautkan link"
              />
            </>
          )}

          {/* 5. SEIYU SCHEMA */}
          {category === 'seiyu' && (
            <>
              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Karakter Tokoh Pembicara <span className="text-crimson">*</span>
                </label>
                <select
                  value={characterRole}
                  onChange={(e) => setCharacterRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white font-bold"
                >
                  {availableCharacters.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <AudioInputSwitcher
                value={questionAudio}
                onChange={setQuestionAudio}
                defaultSource="recorded"
                label="Audio Percontohan Dialog Ini (.mp3)"
                helperText="Rekam atau unggah contoh suara Sensei untuk baris dialog adegan ini"
              />

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Teks Naskah Dialog Bahasa Jepang <span className="text-crimson">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="諦めるな！僕たちの戦いは、まだ始まったばかりだ！"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Format Teks Furigana (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="諦[あきら]めるな！僕[ぼく]たちの戦[たたか]いは…"
                  value={dialogFurigana}
                  onChange={(e) => setDialogFurigana(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Catatan Emosi & Arahan Sutradara (Direction Note)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Nafas tersengal-sengal, nada tergesa-gesa dengan tatapan mendesak"
                  value={emotionNote}
                  onChange={(e) => setEmotionNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white italic"
                />
              </div>
            </>
          )}

          {/* 6. SHODOU SCHEMA */}
          {category === 'shodou' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-sumi mb-1">
                    Langkah Ke-
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={stepNumber}
                    onChange={(e) => setStepNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white text-center font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-sumi mb-1">
                    Nama Bagian / Langkah Goresan <span className="text-crimson">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Goresan 1-3: Radikal Kubi (首) Bagian Atas"
                    value={stepTitle}
                    onChange={(e) => setStepTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white font-medium"
                  />
                </div>
              </div>

              {/* Rubric Criteria Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-sumi mb-2">
                  Kriteria Rubrik Penilaian Khusus Langkah Ini
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRubricTome(!rubricTome)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium text-left ${
                      rubricTome ? 'bg-crimson/10 border-crimson text-crimson font-bold' : 'bg-white border-sumi-border text-sumi-charcoal'
                    }`}
                  >
                    {rubricTome ? <CheckSquare className="w-4 h-4 text-crimson" /> : <Square className="w-4 h-4 text-sumi-charcoal" />}
                    <span>Kerapian Tome (止め)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRubricHane(!rubricHane)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium text-left ${
                      rubricHane ? 'bg-crimson/10 border-crimson text-crimson font-bold' : 'bg-white border-sumi-border text-sumi-charcoal'
                    }`}
                  >
                    {rubricHane ? <CheckSquare className="w-4 h-4 text-crimson" /> : <Square className="w-4 h-4 text-sumi-charcoal" />}
                    <span>Lentikan Hane (跳ね)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRubricHarai(!rubricHarai)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium text-left ${
                      rubricHarai ? 'bg-crimson/10 border-crimson text-crimson font-bold' : 'bg-white border-sumi-border text-sumi-charcoal'
                    }`}
                  >
                    {rubricHarai ? <CheckSquare className="w-4 h-4 text-crimson" /> : <Square className="w-4 h-4 text-sumi-charcoal" />}
                    <span>Sapuan Harai (払い)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRubricBalance(!rubricBalance)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium text-left ${
                      rubricBalance ? 'bg-crimson/10 border-crimson text-crimson font-bold' : 'bg-white border-sumi-border text-sumi-charcoal'
                    }`}
                  >
                    {rubricBalance ? <CheckSquare className="w-4 h-4 text-crimson" /> : <Square className="w-4 h-4 text-sumi-charcoal" />}
                    <span>Keseimbangan Kuadran</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRubricRakkan(!rubricRakkan)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium text-left ${
                      rubricRakkan ? 'bg-crimson/10 border-crimson text-crimson font-bold' : 'bg-white border-sumi-border text-sumi-charcoal'
                    }`}
                  >
                    {rubricRakkan ? <CheckSquare className="w-4 h-4 text-crimson" /> : <Square className="w-4 h-4 text-sumi-charcoal" />}
                    <span>Posisi Cap Rakkan</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-sumi mb-1">
                  Petunjuk Teknis Kuas & Konsentrasi Tinta (Tips Guru)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tahan kuas tegak lurus, jangan menumpuk tinta di ujung awal goresan..."
                  value={strokeTips}
                  onChange={(e) => setStrokeTips(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white resize-none"
                />
              </div>
            </>
          )}

          {/* Progress Bar when uploading audio */}
          {isUploadingAudio && (
            <div className="space-y-1.5 p-3 rounded-2xl bg-crimson-tint/30 border border-crimson/20 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-crimson">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Mengunggah audio referensi... {uploadProgress}%
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-crimson/20">
                <div 
                  className="h-full bg-crimson transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-sumi-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl text-sumi-charcoal hover:bg-sumi-light transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black rounded-xl bg-crimson hover:bg-crimson-dark text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{initialData ? 'Simpan Perubahan' : 'Tambahkan ke Paket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
