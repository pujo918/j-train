'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  UploadCloud, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Loader2,
  FileSpreadsheet,
  Check,
  RefreshCw
} from 'lucide-react';
import { PracticeSet, Question } from '@/types';
import { 
  getCsvTemplateForCategory, 
  generateCsvTemplateString, 
  triggerCsvDownload, 
  parseCsvText, 
  validateCsvRowsForCategory, 
  CsvValidationResult, 
  ValidatedCsvRow 
} from '@/lib/data/csvTemplates';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSet: PracticeSet;
  onImportBatch: (items: Omit<Question, 'id'>[]) => number;
  onSuccessToast: (msg: string) => void;
}

export function CsvImportModal({
  isOpen,
  onClose,
  activeSet,
  onImportBatch,
  onSuccessToast
}: CsvImportModalProps) {
  const [mounted, setMounted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [validationResult, setValidationResult] = useState<CsvValidationResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const template = getCsvTemplateForCategory(activeSet.category);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFileName('');
      setValidationResult(null);
      setIsImporting(false);
      setUploadProgress(0);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  // Handle template download
  const handleDownloadTemplate = () => {
    const csvContent = generateCsvTemplateString(template);
    triggerCsvDownload(template.filename, csvContent);
  };

  // Process raw CSV string
  const processCsvContent = (content: string, name: string) => {
    setFileName(name);
    const parsedRows = parseCsvText(content);
    const result = validateCsvRowsForCategory(activeSet.category, parsedRows, activeSet.id);
    setValidationResult(result);
  };

  // File upload input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCsvContent(text, file.name);
    };
    reader.readAsText(file);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.csv') || file.type.includes('csv') || file.type.includes('text'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        processCsvContent(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  // Quick Sample Data Loader for testing without opening Excel
  const handleLoadSampleData = () => {
    const validSample = generateCsvTemplateString(template);
    // Add one intentionally invalid row for demonstration if applicable
    const extraInvalid = '\r\n"Soal yang belum lengkap opsi dan kunci","Opsi 1","","","","Z","Penjelasan"';
    processCsvContent(validSample + extraInvalid, `sample_${template.filename}`);
  };

  // Execute batch import
  const handleExecuteImport = () => {
    if (!validationResult || validationResult.validCount === 0) return;

    setIsImporting(true);
    setUploadProgress(20);

    // Simulate batch atomic insertion progress
    setTimeout(() => {
      setUploadProgress(65);
      setTimeout(() => {
        setUploadProgress(100);

        const validQuestions = validationResult.rows
          .filter(r => r.isValid && r.questionData)
          .map(r => r.questionData!);

        const count = onImportBatch(validQuestions);
        onSuccessToast(`Berhasil mengimpor ${count} butir soal ke dalam paket ${activeSet.title}!`);

        setTimeout(() => {
          setIsImporting(false);
          onClose();
        }, 500);
      }, 400);
    }, 350);
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-sumi/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-sumi-border overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-sumi-border bg-gradient-to-r from-warm-cream/60 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-crimson-tint text-crimson flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-sumi">
                Import Soal via CSV (Batch Uploader)
              </h2>
              <p className="text-[11px] text-sumi-charcoal">
                Target Paket: <span className="font-bold text-sumi">{activeSet.title}</span> ({activeSet.category.toUpperCase()})
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Info & Template Download */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-warm-cream/40 border border-warm-cream-dark/40">
            <div>
              <div className="text-xs font-black text-sumi">
                Format Skema CSV: {activeSet.category.toUpperCase()}
              </div>
              <div className="text-[11px] text-sumi-charcoal">
                {template.description}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 bg-white hover:bg-sumi-light text-sumi border border-sumi-border rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-crimson" />
                <span>Unduh Format CSV</span>
              </button>
              <button
                type="button"
                onClick={handleLoadSampleData}
                className="px-3 py-1.5 bg-crimson-tint hover:bg-red-100 text-crimson rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Muat Contoh Uji Coba</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
              dragActive 
                ? 'border-crimson bg-crimson-tint/30 scale-[1.01]' 
                : 'border-sumi-border/80 hover:border-crimson/60 bg-warm-cream/20 hover:bg-warm-cream/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-sumi-border flex items-center justify-center text-crimson mb-3">
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-xs font-bold text-sumi mb-1">
              {fileName ? (
                <span className="text-crimson font-black flex items-center gap-1.5 justify-center">
                  <FileText className="w-4 h-4" /> {fileName}
                </span>
              ) : (
                'Tarik & Lepaskan File CSV di Sini, atau Klik untuk Menjelajah'
              )}
            </div>
            <p className="text-[11px] text-sumi-charcoal">
              Mendukung ekstensi .csv (UTF-8). Baris otomatis divalidasi sebelum disimpan ke Supabase.
            </p>
          </div>

          {/* Validation & Preview Section */}
          {validationResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black text-sumi flex items-center gap-2">
                  <span>Pratinjau Hasil Validasi Data</span>
                  <span className="text-[11px] font-normal text-sumi-charcoal">
                    ({validationResult.totalRows} baris terdeteksi)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {validationResult.validCount} Siap Diimpor
                  </span>
                  {validationResult.invalidCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-red-50 text-crimson border border-red-200">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {validationResult.invalidCount} Bermasalah
                    </span>
                  )}
                </div>
              </div>

              {/* Table Preview */}
              <div className="border border-sumi-border rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-warm-cream/60 sticky top-0 border-b border-sumi-border text-[11px] font-black text-sumi uppercase">
                    <tr>
                      <th className="py-2 px-3 w-12 text-center">Baris</th>
                      <th className="py-2 px-3">Teks Butir Soal</th>
                      <th className="py-2 px-3 w-24 text-center">Kunci</th>
                      <th className="py-2 px-3 w-40">Status Validasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sumi-border/40">
                    {validationResult.rows.map((row) => (
                      <tr 
                        key={row.rowNumber}
                        className={row.isValid ? 'bg-white hover:bg-emerald-50/20' : 'bg-red-50/40 hover:bg-red-50/60'}
                      >
                        <td className="py-2 px-3 text-center font-mono font-bold text-sumi-charcoal text-[11px]">
                          #{row.rowNumber}
                        </td>
                        <td className="py-2 px-3 text-sumi font-medium">
                          <div className="line-clamp-1">
                            {row.questionData?.question_text || row.rawCells[0] || '(Kosong)'}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {row.questionData?.correct_key ? (
                            <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                              {row.questionData.correct_key}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Valid
                            </span>
                          ) : (
                            <div className="text-[10px] text-crimson font-medium space-y-0.5">
                              {row.errors.map((err, i) => (
                                <div key={i} className="flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                  <span>{err}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Progress Bar when importing */}
          {isImporting && (
            <div className="space-y-1.5 p-3 rounded-2xl bg-crimson-tint/30 border border-crimson/20 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-crimson">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Mengunggah dan Menyimpan Batch Soal ke Supabase...
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
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-sumi-border bg-warm-cream/20 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isImporting}
            className="px-4 py-2 text-xs font-bold rounded-xl text-sumi-charcoal hover:bg-sumi-light transition-colors"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={!validationResult || validationResult.validCount === 0 || isImporting}
            className={`px-5 py-2 text-xs font-black rounded-xl text-white shadow-sm flex items-center gap-1.5 transition-all ${
              !validationResult || validationResult.validCount === 0 || isImporting
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-crimson hover:bg-crimson-dark'
            }`}
          >
            {isImporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan ke Supabase...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {validationResult ? `Impor ${validationResult.validCount} Butir Soal Valid` : 'Pilih File CSV Dulu'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
