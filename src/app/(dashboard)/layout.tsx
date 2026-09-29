'use client';

import React from 'react';
import { HeaderDesktop } from '@/components/common/HeaderDesktop';
import { BottomNavMobile } from '@/components/common/BottomNavMobile';
import { JapaneseWatermarkPattern } from '@/components/icons/CompetitionIcons';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isInstallable, installApp } = usePWAInstall();
  const [hideBanner, setHideBanner] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] relative">
      {/* Background Watermark Pattern: Torii gates (⛩) & Sakura blossoms (🌸) */}
      <JapaneseWatermarkPattern />

      {/* Header Desktop (76px) and Mobile Top Bar (56px) */}
      <HeaderDesktop />

      {/* PWA Floating Install Prompt Bar for Mobile */}
      {isInstallable && !hideBanner && (
        <div className="bg-crimson text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-3 shadow-md md:hidden sticky top-14 z-30">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 animate-bounce" />
            <span>Pasang J-TRAIN di Layar Utama HP Anda</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={installApp}
              className="bg-white text-crimson px-3 py-1 rounded-lg font-bold text-[11px] shadow-sm"
            >
              Install
            </button>
            <button
              onClick={() => setHideBanner(true)}
              className="p-1 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6 pb-24 md:pb-12 relative z-10">
        {children}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (<768px): 64px */}
      <BottomNavMobile />
    </div>
  );
}
