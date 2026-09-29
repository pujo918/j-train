'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/data/store';

export default function RootPage() {
  const router = useRouter();
  const { currentUser } = useAppStore();

  useEffect(() => {
    if (currentUser?.role === 'sensei') {
      router.replace('/sensei');
    } else {
      router.replace('/siswa');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-washi">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-crimson-tint text-crimson flex items-center justify-center text-2xl animate-spin">
          ⛩️
        </div>
        <p className="text-xs font-bold tracking-widest uppercase text-sumi-charcoal">
          Memuat J-TRAIN MAN 1 Pasuruan...
        </p>
      </div>
    </div>
  );
}
