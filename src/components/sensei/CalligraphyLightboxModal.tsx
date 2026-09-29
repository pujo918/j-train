'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Check, Award, AlertCircle } from 'lucide-react';
import { HanshiPreview } from './HanshiPreview';

interface CalligraphyLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  kanji: string;
  studentName: string;
  onVerify?: () => void;
  isVerified?: boolean;
}

export const CalligraphyLightboxModal: React.FC<CalligraphyLightboxModalProps> = ({
  isOpen,
  onClose,
  kanji = "道",
  studentName = "Dewi Lestari",
  onVerify,
  isVerified = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-sumi/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl border border-sumi-border shadow-2xl max-w-2xl w-full p-5 sm:p-6 z-[101] overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-crimson bg-crimson-tint px-2 py-0.5 rounded-full">
              Pemeriksaan Detail Lembar Hanshi
            </span>
            <h3 className="text-base sm:text-lg font-black text-sumi mt-1">
              Kaligrafi Mandiri: Karakter 『{kanji}』 — {studentName}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-sumi-muted hover:text-sumi hover:bg-[#FAF7F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Hanshi Paper + Rubric */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* Hanshi Paper Left (Col 5) */}
          <div className="sm:col-span-5 flex justify-center">
            <div className="w-48 h-64 sm:w-52 sm:h-72">
              <HanshiPreview
                kanji={kanji}
                className="w-full h-full shadow-lg"
                showGrid={true}
              />
            </div>
          </div>

          {/* Evaluation Right (Col 7) */}
          <div className="sm:col-span-7 space-y-3.5 text-xs">
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-sumi-border space-y-2">
              <span className="text-[10px] font-bold text-sumi-muted uppercase block">
                Rubrik Penilaian 3 Kaidah Goresan (Checklist Mandiri)
              </span>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-sumi-border/60">
                  <div className="flex items-center gap-1.5 font-bold text-sumi">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>とめ (Tome - Henti & Tahan Kuas)</span>
                  </div>
                  <span className="text-[11px] font-black text-emerald-700">100% Solid</span>
                </div>

                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-sumi-border/60">
                  <div className="flex items-center gap-1.5 font-bold text-sumi">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>はね (Hane - Lentikan Sudut 45°)</span>
                  </div>
                  <span className="text-[11px] font-black text-emerald-700">Presisi</span>
                </div>

                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-sumi-border/60">
                  <div className="flex items-center gap-1.5 font-bold text-sumi">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>はらい (Harai - Sapuan Memudar)</span>
                  </div>
                  <span className="text-[11px] font-black text-emerald-700">Halus</span>
                </div>

                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-sumi-border/60">
                  <div className="flex items-center gap-1.5 font-bold text-sumi">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>空間 (Kūkan - Keseimbangan 4 Kuadran)</span>
                  </div>
                  <span className="text-[11px] font-black text-amber-700">Perlu Penyesuaian</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              <strong>Catatan Otomatis AI/Sensei:</strong> Goresan go-kaku (kelima) pada Shinnyou memiliki ketebalan tinta yang pas. Disarankan menambah jarak 5mm pada sudut kiri bawah agar stempel inkan tidak berhimpitan.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl border border-sumi-border text-sumi-charcoal font-bold text-xs hover:bg-[#FAF7F2] transition-colors"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onVerify) onVerify();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-98"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isVerified ? "Sudah Terverifikasi" : "Verifikasi Lembar Ini"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
