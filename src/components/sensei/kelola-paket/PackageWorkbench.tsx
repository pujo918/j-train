'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/data/store';
import { 
  PlusCircle, 
  Trash2, 
  Eye, 
  EyeOff, 
  Layers, 
  Clock, 
  CheckCircle2, 
  X, 
  BookOpen, 
  Volume2, 
  HelpCircle,
  FileText,
  Save,
  Sparkles,
  Download,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Edit3,
  Search,
  Check,
  AlertCircle,
  FileSpreadsheet,
  Mic2,
  PenTool,
  CheckSquare,
  Square
} from 'lucide-react';
import { CompetitionCategory, PracticeSet, Question } from '@/types';
import { CATEGORIES_META } from '@/lib/utils';
import { AdaptivePackageModal } from './AdaptivePackageModal';
import { AdaptiveQuestionModal } from './AdaptiveQuestionModal';
import { CsvImportModal } from './CsvImportModal';
import { getCsvTemplateForCategory, generateCsvTemplateString, triggerCsvDownload } from '@/lib/data/csvTemplates';

export function PackageWorkbench() {
  const { 
    practiceSets, 
    questions, 
    addPracticeSet, 
    updatePracticeSet,
    togglePublishPracticeSet, 
    deletePracticeSet,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    importQuestionsBatch
  } = useAppStore();

  // Active Selected Package
  const [selectedSetId, setSelectedSetId] = useState<string>(practiceSets[0]?.id || '');
  
  // Search & Branch Filter for Left Pane
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('semua');

  // Accordion expanded question IDs (Set default open like item 4 and 5 in wireframe)
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>([]);

  // Bulk Edit mode state
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Modals
  const [isAddSetModalOpen, setIsAddSetModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<PracticeSet | null>(null);

  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Find active set or fallback
  const activeSet = practiceSets.find((s) => s.id === selectedSetId) || practiceSets[0];

  // Questions of active set
  const activeQuestions = useMemo(() => {
    if (!activeSet) return [];
    return questions.filter((q) => q.set_id === activeSet.id);
  }, [questions, activeSet]);

  // Expand the last question by default when active questions change if none expanded
  React.useEffect(() => {
    if (activeQuestions.length > 0 && expandedQuestionIds.length === 0) {
      // Expand the last item (similar to item 5 in wireframe)
      const lastQ = activeQuestions[activeQuestions.length - 1];
      if (lastQ) setExpandedQuestionIds([lastQ.id]);
    }
  }, [activeQuestions]);

  // Filter packages in Left Pane
  const filteredSets = useMemo(() => {
    return practiceSets.filter((set) => {
      const matchSearch = set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBranch = selectedBranch === 'semua' || set.category === selectedBranch;
      return matchSearch && matchBranch;
    });
  }, [practiceSets, searchQuery, selectedBranch]);

  // Toggle single question accordion
  const toggleAccordion = (qId: string) => {
    setExpandedQuestionIds((prev) => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  // Handle Save Package (Create or Update)
  const handleSavePackage = (data: Omit<PracticeSet, 'id' | 'created_at'>) => {
    if (editingSet) {
      updatePracticeSet(editingSet.id, data);
      showToast(`Paket "${data.title}" berhasil diperbarui!`);
      setEditingSet(null);
    } else {
      const newId = addPracticeSet(data);
      setSelectedSetId(newId);
      showToast(`Paket baru "${data.title}" berhasil dibuat!`);
    }
  };

  // Handle Save Question (Create or Update)
  const handleSaveQuestion = (qData: Omit<Question, 'id'>) => {
    if (editingQuestion) {
      updateQuestion(editingQuestion.id, qData);
      showToast('Butir soal berhasil diperbarui!');
      setEditingQuestion(null);
    } else {
      addQuestion(qData);
      showToast('Butir soal baru berhasil ditambahkan!');
    }
  };

  // Handle Delete Question
  const handleDeleteQuestion = (qId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus butir soal ini?')) {
      deleteQuestion(qId);
      showToast('Butir soal telah dihapus.');
    }
  };

  // Handle Download CSV format for active branch
  const handleDownloadCsvFormat = () => {
    if (!activeSet) return;
    const template = getCsvTemplateForCategory(activeSet.category);
    const content = generateCsvTemplateString(template);
    triggerCsvDownload(template.filename, content);
    showToast(`Template CSV untuk ${activeSet.category.toUpperCase()} berhasil diunduh.`);
  };

  // Handle Bulk Delete
  const handleBulkDelete = () => {
    if (selectedQuestionIds.length === 0) return;
    if (confirm(`Hapus ${selectedQuestionIds.length} butir soal yang dipilih?`)) {
      selectedQuestionIds.forEach(id => deleteQuestion(id));
      setSelectedQuestionIds([]);
      setIsBulkEditMode(false);
      showToast(`${selectedQuestionIds.length} soal berhasil dihapus.`);
    }
  };

  // Category Badge Colors
  const getCategoryBadgeClass = (category: CompetitionCategory) => {
    switch (category) {
      case 'kanji':
        return 'bg-red-50 text-crimson border-red-200';
      case 'cerdas_cermat':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'kikikakitori':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'rodoku':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'seiyu':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'shodou':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[150] bg-sumi text-white px-4 py-2.5 rounded-2xl shadow-xl border border-sumi-border flex items-center gap-2 text-xs font-bold animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER & ACTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-sumi tracking-tight">
            Kelola Paket & Bank Soal
          </h1>
          <p className="text-xs text-sumi-charcoal">
            Adaptive Curriculum Studio & Real-time Question Bank Management
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSet(null);
            setIsAddSetModalOpen(true);
          }}
          className="px-4 py-2 bg-crimson hover:bg-crimson-dark text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Paket Baru</span>
        </button>
      </div>

      {/* 2-PANE STUDIO WORKBENCH (35% Left : 65% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* =========================================================================
            PANE KIRI (LEBAR 35% / 4-COLS) - DAFTAR PAKET MATERI
            ========================================================================= */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-sumi-border p-4 shadow-2xs space-y-3.5">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-sumi uppercase tracking-wider">
              Daftar Paket Materi Cabang Aktif
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-warm-cream/20 focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson/20"
            />
            <Search className="w-3.5 h-3.5 text-sumi-charcoal absolute left-2.5 top-2.5" />
          </div>

          {/* Branch Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold text-sumi-charcoal no-scrollbar">
            <button
              onClick={() => setSelectedBranch('semua')}
              className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedBranch === 'semua' ? 'bg-crimson text-white' : 'hover:bg-sumi-light'
              }`}
            >
              Semua
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSelectedBranch('kanji')}
              className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedBranch === 'kanji' ? 'bg-crimson text-white' : 'hover:bg-sumi-light'
              }`}
            >
              Kanji {selectedBranch === 'kanji' && '(✓)'}
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSelectedBranch('cerdas_cermat')}
              className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedBranch === 'cerdas_cermat' ? 'bg-crimson text-white' : 'hover:bg-sumi-light'
              }`}
            >
              CC
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSelectedBranch('kikikakitori')}
              className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedBranch === 'kikikakitori' ? 'bg-crimson text-white' : 'hover:bg-sumi-light'
              }`}
            >
              Kikikakitori
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSelectedBranch('rodoku')}
              className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedBranch === 'rodoku' ? 'bg-crimson text-white' : 'hover:bg-sumi-light'
              }`}
            >
              Rodoku
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSelectedBranch('seiyu')}
              className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedBranch === 'seiyu' ? 'bg-crimson text-white' : 'hover:bg-sumi-light'
              }`}
            >
              Seiyu
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setSelectedBranch('shodou')}
              className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors ${
                selectedBranch === 'shodou' ? 'bg-crimson text-white' : 'hover:bg-sumi-light'
              }`}
            >
              Shodou
            </button>
          </div>

          {/* Isolated Scrollable Package List */}
          <div className="max-h-[calc(100vh-270px)] min-h-[380px] overflow-y-auto space-y-2.5 pr-1">
            {filteredSets.length === 0 ? (
              <div className="p-8 text-center text-xs text-sumi-charcoal">
                Tidak ada paket latihan yang sesuai dengan filter.
              </div>
            ) : (
              filteredSets.map((set) => {
                const isSelected = activeSet?.id === set.id;
                const questionCount = questions.filter(q => q.set_id === set.id).length;

                return (
                  <div
                    key={set.id}
                    onClick={() => setSelectedSetId(set.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'border-2 border-crimson bg-crimson-tint/20 shadow-xs'
                        : 'border-sumi-border bg-white hover:border-sumi-charcoal/40 hover:bg-warm-cream/20'
                    }`}
                  >
                    {/* Top Row: Category & Status Badge */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getCategoryBadgeClass(set.category)}`}>
                        {set.category.replace('_', ' ')}
                      </span>

                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        set.is_published 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {set.is_published ? (
                          <>
                            <Eye className="w-2.5 h-2.5" /> Publik
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-2.5 h-2.5" /> Draft
                          </>
                        )}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xs font-black text-sumi line-clamp-1">
                      {set.title}
                    </h3>

                    {/* Crimson Accent Line Under Title */}
                    <div className="w-16 h-0.5 bg-crimson rounded-full my-1.5" />

                    {/* Footer Metadata */}
                    <div className="flex items-center justify-between text-[11px] text-sumi-charcoal font-medium mt-1">
                      <span>{questionCount} Soal Tersedia</span>
                      <span>{set.duration_minutes > 0 ? `${set.duration_minutes} Menit` : '0 Menit (Santai)'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Action in Left Pane (Matching Wireframe) */}
          <button
            onClick={() => {
              setEditingSet(null);
              setIsAddSetModalOpen(true);
            }}
            className="w-full py-2.5 bg-crimson hover:bg-crimson-dark text-white rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Buat Paket Baru</span>
          </button>
        </div>


        {/* =========================================================================
            PANE KANAN (LEBAR 65% / 8-COLS) - EDITOR & BANK SOAL
            ========================================================================= */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-sumi-border p-5 shadow-2xs space-y-4">
          
          {/* Pane Header */}
          <div className="flex items-center justify-between pb-1 border-b border-sumi-border/40">
            <h2 className="text-xs font-black text-sumi uppercase tracking-wider">
              Editor & Bank Soal Paket Terpilih
            </h2>

            {activeSet && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingSet(activeSet);
                    setIsAddSetModalOpen(true);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-sumi-charcoal hover:text-sumi hover:bg-sumi-light rounded-lg border border-sumi-border transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit Info Paket
                </button>
                <button
                  onClick={() => togglePublishPracticeSet(activeSet.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors flex items-center gap-1 ${
                    activeSet.is_published 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {activeSet.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{activeSet.is_published ? 'Publik' : 'Draft'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Master Audio Reference Banner (if set has audio) */}
          {activeSet && activeSet.audio_reference_url && (
            <div className="p-3 bg-warm-cream/50 rounded-2xl border border-sumi-border/70 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-crimson-tint text-crimson flex items-center justify-center font-bold flex-shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sumi text-xs">Audio Master / Percontohan Sensei</div>
                  <div className="text-[11px] text-sumi-charcoal flex items-center gap-2">
                    <span>{activeSet.metadata?.file_name || 'audio-referensi.mp3'}</span>
                    {activeSet.metadata?.duration_seconds ? (
                      <span>• {Math.floor(activeSet.metadata.duration_seconds / 60)}:{String(activeSet.metadata.duration_seconds % 60).padStart(2, '0')}</span>
                    ) : null}
                    {activeSet.metadata?.audio_source_type && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-crimson/10 text-crimson uppercase">
                        {activeSet.metadata.audio_source_type === 'recorded' ? 'Rekaman Langsung' : activeSet.metadata.audio_source_type === 'uploaded' ? 'File Audio' : 'Tautan URL'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <audio controls src={activeSet.audio_reference_url} className="h-7 w-48" />
            </div>
          )}

          {/* Action Toolbar Strip */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setEditingQuestion(null);
                setIsAddQuestionModalOpen(true);
              }}
              className="px-4 py-2 bg-crimson hover:bg-crimson-dark text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Butir Soal</span>
            </button>

            <button
              onClick={() => setIsCsvModalOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-sumi-light text-sumi border border-sumi-border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5 text-crimson" />
              <span>Import via CSV</span>
            </button>

            <button
              onClick={handleDownloadCsvFormat}
              className="px-3.5 py-2 bg-white hover:bg-sumi-light text-sumi border border-sumi-border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sumi-charcoal" />
              <span>Unduh Format CSV</span>
            </button>

            {isBulkEditMode && (
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedQuestionIds.length === 0}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1 ${
                    selectedQuestionIds.length > 0 
                      ? 'bg-red-50 text-crimson border border-red-200 hover:bg-red-100' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus ({selectedQuestionIds.length})</span>
                </button>
              </div>
            )}
          </div>

          {/* Bank Soal Accordion List */}
          <div className="space-y-2.5 max-h-[calc(100vh-320px)] min-h-[380px] overflow-y-auto pr-1">
            {activeQuestions.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-sumi-border/60 rounded-3xl bg-warm-cream/10 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-crimson-tint text-crimson flex items-center justify-center mx-auto">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-sumi">
                  Belum Ada Butir Soal di Paket Ini
                </div>
                <p className="text-[11px] text-sumi-charcoal max-w-sm mx-auto">
                  Klik <strong>+ Tambah Butir Soal</strong> untuk memasukkan secara manual, atau klik <strong>Import via CSV</strong> untuk mengunggah puluhan soal sekaligus.
                </p>
              </div>
            ) : (
              activeQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionIds.includes(q.id);
                const isSelectedForBulk = selectedQuestionIds.includes(q.id);
                const questionNumber = idx + 1;

                // Answer snippet for key badge
                let answerSnippet = '';
                if (q.options && q.options.length > 0) {
                  const correctOpt = q.options.find(o => o.key === q.correct_key);
                  if (correctOpt) {
                    answerSnippet = correctOpt.text.split('(')[0]?.trim() || correctOpt.text;
                  }
                } else if (q.correct_key) {
                  answerSnippet = q.correct_key;
                }

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? 'border-sumi-border bg-warm-cream/10 shadow-xs'
                        : 'border-sumi-border/80 bg-white hover:border-sumi-charcoal/40'
                    }`}
                  >
                    {/* COMPACT SINGLE-LINE ACCORDION HEADER */}
                    <div
                      onClick={() => toggleAccordion(q.id)}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Bulk Edit Checkbox */}
                        {isBulkEditMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuestionIds(prev =>
                                prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id]
                              );
                            }}
                            className="text-sumi-charcoal hover:text-crimson"
                          >
                            {isSelectedForBulk ? (
                              <CheckSquare className="w-4 h-4 text-crimson" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        )}

                        {/* Circular Red Badge */}
                        <div className="w-6 h-6 rounded-full bg-crimson text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                          {questionNumber}
                        </div>

                        {/* Truncated Question Text */}
                        <span className="text-xs font-bold text-sumi line-clamp-1 flex-1">
                          {q.question_text}
                        </span>

                        {/* Key Badge (Soft Emerald Pill matching wireframe) */}
                        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 whitespace-nowrap">
                          Kunci: {q.correct_key} {answerSnippet ? `(${answerSnippet})` : ''}
                        </span>

                        {/* Audio Badge */}
                        {q.audio_url && (
                          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                            <Volume2 className="w-2.5 h-2.5 text-amber-700" /> Audio
                          </span>
                        )}
                      </div>

                      {/* Action Buttons: Edit, Delete, Chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingQuestion(q);
                            setIsAddQuestionModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-sumi-charcoal hover:text-sumi flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-sumi-light"
                        >
                          <Edit3 className="w-3 h-3 text-sumi-charcoal" />
                          <span>Edit</span>
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteQuestion(q.id, e)}
                          className="text-[11px] font-bold text-crimson hover:text-crimson-dark flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3 text-crimson" />
                          <span>Hapus</span>
                        </button>

                        <div className="w-5 h-5 rounded flex items-center justify-center text-sumi-charcoal">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED VIEW (MATCHING ITEMS 4 & 5 IN WIREFRAME) */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 space-y-3 border-t border-sumi-border/40">
                        {/* Full Question Text */}
                        <div className="text-xs text-sumi font-medium">
                          {q.question_text}
                        </div>

                        {/* Quiz Options Grid (A, B, C, D) */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt) => {
                              const isCorrect = opt.key === q.correct_key;
                              return (
                                <div
                                  key={opt.key}
                                  className={`p-2 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                                    isCorrect
                                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-2xs'
                                      : 'bg-white border-sumi-border text-sumi'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                                    isCorrect ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-sumi-charcoal'
                                  }`}>
                                    {opt.key}
                                  </span>
                                  <span className="flex-1">{opt.text}</span>
                                  {isCorrect && (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Audio Preview Player */}
                        {q.audio_url && (
                          <div className="p-2.5 rounded-xl bg-warm-cream/50 border border-sumi-border/70 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-6 h-6 rounded-lg bg-crimson-tint text-crimson flex items-center justify-center font-bold">
                                <Volume2 className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-bold text-sumi text-[11px]">Audio Percontohan / Potongan Suara</div>
                                <div className="text-[10px] text-sumi-charcoal flex items-center gap-1.5">
                                  <span>{q.metadata?.file_name || 'audio-percontohan.mp3'}</span>
                                  {q.metadata?.duration_seconds ? <span>• {q.metadata.duration_seconds}s</span> : null}
                                  {q.metadata?.audio_source_type && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-crimson border border-crimson/20 uppercase">
                                      {q.metadata.audio_source_type === 'recorded' ? 'Rekaman' : q.metadata.audio_source_type === 'uploaded' ? 'File Unggah' : 'URL'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <audio controls src={q.audio_url} className="h-7 w-44" />
                          </div>
                        )}

                        {/* Branch-Specific Metadata Details */}
                        {/* Seiyu metadata */}
                        {q.metadata?.character_role && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10px]">
                              Tokoh: {q.metadata.character_role}
                            </span>
                            {q.metadata?.emotion_note && (
                              <span className="text-[11px] text-sumi-charcoal italic">
                                &quot;{q.metadata.emotion_note}&quot;
                              </span>
                            )}
                          </div>
                        )}

                        {/* Kikikakitori Dikte metadata */}
                        {q.metadata?.type === 'dikte' && (
                          <div className="p-2.5 rounded-xl bg-warm-cream/40 border border-sumi-border/60 text-xs">
                            <div className="font-bold text-sumi text-[11px] mb-0.5">
                              Kata Kunci Dikte: <span className="font-mono text-crimson">{q.correct_key}</span>
                            </div>
                            <div className="text-[10px] text-sumi-charcoal">
                              Normalisasi: {q.metadata.auto_normalize ? 'Aktif (Abaikan spasi ganda & Zenkaku)' : 'Non-aktif'}
                            </div>
                          </div>
                        )}

                        {/* Shodou rubric metadata */}
                        {q.metadata?.step_title && (
                          <div className="flex flex-wrap gap-1 text-[10px]">
                            {q.metadata.tome_checked && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Kerapian Tome</span>}
                            {q.metadata.hane_checked && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Lentikan Hane</span>}
                            {q.metadata.harai_checked && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Sapuan Harai</span>}
                            {q.metadata.balance_checked && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Keseimbangan Kuadran</span>}
                          </div>
                        )}

                        {/* Explanation / Pembahasan Box */}
                        {q.explanation && (
                          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-sumi leading-relaxed">
                            <span className="font-bold text-amber-900">Penjelasan: </span>
                            <span>{q.explanation}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Footer Actions (Matching Wireframe) */}
          <div className="flex items-center justify-between pt-3 border-t border-sumi-border/60">
            <button
              onClick={() => {
                setIsBulkEditMode(!isBulkEditMode);
                setSelectedQuestionIds([]);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                isBulkEditMode 
                  ? 'bg-sumi text-white border-sumi' 
                  : 'bg-white hover:bg-sumi-light text-sumi-charcoal border-sumi-border'
              }`}
            >
              {isBulkEditMode ? 'Batal Bulk Edit' : 'Bulk Edit'}
            </button>

            <button
              onClick={() => {
                if (activeSet) {
                  updatePracticeSet(activeSet.id, { is_published: true });
                  showToast(`Paket "${activeSet.title}" berhasil disimpan dan diterbitkan!`);
                }
              }}
              className="px-5 py-2 bg-crimson hover:bg-crimson-dark text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIMPAN PERUBAHAN & TERBITKAN</span>
            </button>
          </div>
        </div>
      </div>

      {/* ADAPTIVE MODALS */}
      {isAddSetModalOpen && (
        <AdaptivePackageModal
          isOpen={isAddSetModalOpen}
          onClose={() => {
            setIsAddSetModalOpen(false);
            setEditingSet(null);
          }}
          onSave={handleSavePackage}
          initialData={editingSet}
          defaultCategory={(selectedBranch !== 'semua' ? selectedBranch : 'kanji') as CompetitionCategory}
        />
      )}

      {isAddQuestionModalOpen && activeSet && (
        <AdaptiveQuestionModal
          isOpen={isAddQuestionModalOpen}
          onClose={() => {
            setIsAddQuestionModalOpen(false);
            setEditingQuestion(null);
          }}
          onSave={handleSaveQuestion}
          activeSet={activeSet}
          initialData={editingQuestion}
          totalExistingQuestions={activeQuestions.length}
        />
      )}

      {isCsvModalOpen && activeSet && (
        <CsvImportModal
          isOpen={isCsvModalOpen}
          onClose={() => setIsCsvModalOpen(false)}
          activeSet={activeSet}
          onImportBatch={(items) => importQuestionsBatch(activeSet.id, items)}
          onSuccessToast={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
}
