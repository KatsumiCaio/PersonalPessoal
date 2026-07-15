/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import DevWorkspace from './components/DevWorkspace';
import MobileSimulator from './components/MobileSimulator';
import { Dumbbell, Shield, Cpu, BookOpen, ExternalLink, Flame } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans">
      {/* Top Professional Header Bar */}
      <header className="border-b border-zinc-800 bg-[#0d0d11]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-xl text-zinc-950 shadow-lg shadow-orange-600/10">
              <Dumbbell size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-orange-500 uppercase tracking-widest bg-orange-950/40 px-2 py-0.5 rounded border border-orange-500/20">
                  ARQUITETURA & MVP
                </span>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
                  v1.0.0
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-white font-sans mt-1">
                Personal<span className="text-orange-500">Pessoal</span> Hub
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Shield size={12} className="text-orange-500" />
              <span>Supabase RLS Ativo</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Cpu size={12} className="text-orange-500" />
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
              <Flame size={14} className="text-orange-500" />
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
        <div className="xl:col-span-5 flex flex-col items-center">
          <div className="w-full text-center mb-4">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-1">
              DISPOSITIVO EMULADO (PREVIEW)
            </span>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Interaja com a tela do celular para experimentar o fluxo de Onboarding, treinos dinâmicos e cronômetro.
            </p>
          </div>

          <MobileSimulator />
        </div>
      </main>

      {/* Footer Credentials */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-5 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-sans">
          <p>© 2026 PersonalPessoal — Desenvolvido de forma ética e eficiente.</p>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 transition-colors">Politicas de RLS</span>
            <span className="text-zinc-800">|</span>
            <span className="hover:text-zinc-300 transition-colors">Documentação Supabase</span>
            <span className="text-zinc-800">|</span>
            <span className="hover:text-zinc-300 transition-colors">Expo Router</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

