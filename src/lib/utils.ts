import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CompetitionCategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export function normalizeJapaneseAnswer(input: string): string {
  if (!input) return "";
  return input
    .trim()
    .toLowerCase()
    // normalize zenkaku (fullwidth) spaces to standard spaces
    .replace(/\u3000/g, ' ')
    // normalize multiple spaces to single space
    .replace(/\s+/g, ' ')
    // convert full-width alphanumeric to half-width
    .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
}

export const CATEGORIES_META: Record<CompetitionCategory, {
  name: string;
  romaji: string;
  kanji: string;
  path: string;
  icon: string;
  description: string;
  badge: string;
  isInteractive: boolean;
}> = {
  shodou: {
    name: "Shodou",
    romaji: "SHODOU",
    kanji: "書道",
    path: "/siswa/lomba/shodou",
    icon: "PenTool",
    description: "Panduan visual goresan kanji, kaidah kaligrafi, dan galeri referensi model lomba.",
    badge: "Refleksi Mandiri",
    isInteractive: false,
  },
  kanji: {
    name: "Kanji",
    romaji: "KANJI",
    kanji: "漢字",
    path: "/siswa/lomba/kanji",
    icon: "BookOpen",
    description: "Kuis otomatis pilihan ganda (onyomi, kunyomi, padanan frasa kata) & pembahasan instan.",
    badge: "Auto-Graded",
    isInteractive: true,
  },
  kikikakitori: {
    name: "Kikikakitori",
    romaji: "KIKIKAKITORI",
    kanji: "聞き書き",
    path: "/siswa/lomba/kikikakitori",
    icon: "Headphones",
    description: "Pemutar audio mode ujian (anti-scrubbing) + lembar input jawaban otomatis berulang.",
    badge: "Exam Mode",
    isInteractive: true,
  },
  seiyu: {
    name: "Seiyu",
    romaji: "SEIYU",
    kanji: "声優",
    path: "/siswa/lomba/seiyu",
    icon: "Mic2",
    description: "Naskah dialog peran anime/drama, panduan emosi & tempo, serta voice recorder browser.",
    badge: "Perekam Lokal",
    isInteractive: false,
  },
  rodoku: {
    name: "Rodoku",
    romaji: "RODOKU",
    kanji: "朗読",
    path: "/siswa/lomba/rodoku",
    icon: "BookMarked",
    description: "Naskah ber-furigana, panduan jeda intonasi, model suara Sensei, dan recorder mandiri.",
    badge: "Audio Pembanding",
    isInteractive: false,
  },
  cerdas_cermat: {
    name: "Cerdas Cermat",
    romaji: "CERDAS CERMAT",
    kanji: "知識クイズ",
    path: "/siswa/lomba/cerdas-cermat",
    icon: "HelpCircle",
    description: "Bank soal berwaktu (budaya, sejarah, tata bahasa Jepang) dengan auto-submit timeout.",
    badge: "Rapid Quiz",
    isInteractive: true,
  },
};
