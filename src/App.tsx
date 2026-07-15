/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import DevWorkspace from './components/DevWorkspace';
import MobileSimulator from './components/MobileSimulator';
import AdManager from './components/AdManager';
import { Dumbbell, Shield, Cpu, BookOpen, ExternalLink, Flame, Sparkles } from 'lucide-react';

export const PALETTE_COLORS: Record<string, { name: string; color: string; accent: string; hover: string; glow: string }> = {
  laranja: { name: 'Laranja Fogo', color: '#f97316', accent: '#f97316', hover: '#ea580c', glow: 'rgba(249, 115, 22, 0.15)' },
  limao: { name: 'Verde Volt', color: '#84cc16', accent: '#84cc16', hover: '#65a30d', glow: 'rgba(132, 204, 22, 0.15)' },
  amarelo: { name: 'Amarelo Acid', color: '#eab308', accent: '#eab308', hover: '#ca8a04', glow: 'rgba(234, 179, 8, 0.15)' },
  cyan: { name: 'Azul Elétrico', color: '#06b6d4', accent: '#06b6d4', hover: '#0891b2', glow: 'rgba(6, 182, 212, 0.15)' },
  cyber: { name: 'Magenta Ciber', color: '#ec4899', accent: '#ec4899', hover: '#db2777', glow: 'rgba(236, 72, 153, 0.15)' },
  crimson: { name: 'Carmesim', color: '#ef4444', accent: '#ef4444', hover: '#dc2626', glow: 'rgba(239, 68, 68, 0.15)' }
};

export default function App() {
  const [activePalette, setActivePalette] = useState(() => {
    const saved = localStorage.getItem('personalpessoal_accent_palette');
    return saved || 'laranja';
  });

  // Keep localStorage and a global custom event synchronized so MobileSimulator knows when the theme shifts
  const handlePaletteChange = (paletteId: string) => {
    setActivePalette(paletteId);
    localStorage.setItem('personalpessoal_accent_palette', paletteId);
    window.dispatchEvent(new CustomEvent('personalpessoal_palette_changed', { detail: paletteId }));
  };

  useEffect(() => {
    const syncTheme = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail !== activePalette) {
        setActivePalette(customEvent.detail);
      }
    };
    window.addEventListener('personalpessoal_palette_changed', syncTheme);
    return () => window.removeEventListener('personalpessoal_palette_changed', syncTheme);
  }, [activePalette]);

  useEffect(() => {
    const palette = PALETTE_COLORS[activePalette] || PALETTE_COLORS.laranja;
    const root = document.documentElement;
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--accent-hover', palette.hover);
    root.style.setProperty('--accent-glow', palette.glow);
  }, [activePalette]);

  const palette = PALETTE_COLORS[activePalette] || PALETTE_COLORS.laranja;
  const styleVars = {
    '--accent': palette.accent,
    '--accent-hover': palette.hover,
    '--accent-glow': palette.glow,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans transition-colors duration-500" style={styleVars}>
      {/* Top Professional Header Bar */}
      <header className="border-b border-zinc-800 bg-[#0d0d11]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-xl text-zinc-950 shadow-lg shadow-accent/10 transition-colors duration-500">
              <Dumbbell size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-accent uppercase tracking-widest bg-accent-glow/40 px-2 py-0.5 rounded border border-accent/20 transition-all duration-500">
                  ARQUITETURA & MVP
                </span>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
                  v1.0.0
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-white font-sans mt-1">
                Personal<span className="text-accent transition-colors duration-500">Pessoal</span> Hub
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            {/* Color Palette Selector in Header */}
            <div className="flex items-center gap-2 bg-zinc-900/90 px-3 py-1.5 rounded-xl border border-zinc-800/80">
              <Sparkles size={11} className="text-accent transition-colors duration-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-400 font-semibold uppercase tracking-wider">Acento:</span>
              <div className="flex gap-1.5 ml-1">
                {Object.entries(PALETTE_COLORS).map(([id, item]) => (
                  <button
                    key={id}
                    onClick={() => handlePaletteChange(id)}
                    title={item.name}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                      activePalette === id 
                        ? 'border-white scale-110 shadow-sm' 
                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Shield size={12} className="text-accent transition-colors duration-500" />
              <span>Supabase RLS Ativo</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Cpu size={12} className="text-accent transition-colors duration-500" />
              <span>Expo SDK 51 ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Developer Workspace Console (7/12 cols) */}
        <div className="xl:col-span-7 h-full flex flex-col justify-stretch">
          <div className="mb-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/60">
            <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-1.5">
              <Flame size={14} className="text-accent transition-colors duration-500" />
              Seja bem-vindo, desenvolvedor!
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Como seu <strong>Arquiteto de Software Sênior</strong>, estruturei toda a base técnica para democratizar treinos e alimentação de baixo custo.
              Use este Hub para explorar o banco PostgreSQL, entender a estrutura modular do Expo e testar o simulador interativo em tempo real antes de codar!
            </p>
          </div>

          <DevWorkspace />
        </div>

        {/* Right Side: Smartphone Device Interactive Preview (5/12 cols) */}
        <div className="xl:col-span-5 flex flex-col items-center gap-6">
          <div className="w-full text-center">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-1">
              DISPOSITIVO EMULADO (PREVIEW)
            </span>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Interaja com a tela do celular para experimentar o fluxo de Onboarding, treinos dinâmicos e cronômetro.
            </p>
          </div>

          <MobileSimulator />
          
          <div className="w-full">
            <AdManager />
          </div>
        </div>
      </main>

      {/* Footer Credentials */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-5 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-sans">
          <p>© 2026 PersonalPessoal — Desenvolvido de forma ética e eficiente.</p>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Politicas de RLS</span>
            <span className="text-zinc-800">|</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Documentação Supabase</span>
            <span className="text-zinc-800">|</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Expo Router</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

