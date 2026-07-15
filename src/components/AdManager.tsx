import React, { useState, useEffect } from 'react';
import { Play, Sparkles, TrendingUp, DollarSign, MousePointer, ShieldCheck, ToggleLeft, RefreshCw, Terminal, Eye } from 'lucide-react';

interface AdLog {
  id: string;
  timestamp: string;
  type: 'impression' | 'click' | 'info' | 'system';
  message: string;
  revenue?: number;
}

export default function AdManager() {
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('gymdemocra_is_premium') === 'true';
  });

  const [impressions, setImpressions] = useState<number>(() => {
    return parseInt(localStorage.getItem('gymdemocra_ad_impressions') || '0', 10);
  });

  const [clicks, setClicks] = useState<number>(() => {
    return parseInt(localStorage.getItem('gymdemocra_ad_clicks') || '0', 10);
  });

  const [revenue, setRevenue] = useState<number>(() => {
    return parseFloat(localStorage.getItem('gymdemocra_ad_revenue') || '0.00');
  });

  const [logs, setLogs] = useState<AdLog[]>([]);

  // Add log helper
  const addLog = (type: 'impression' | 'click' | 'info' | 'system', message: string, revAmount?: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: AdLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      type,
      message,
      revenue: revAmount
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  // Sync state changes and listen to events from MobileSimulator
  useEffect(() => {
    // Initial logs
    addLog('system', 'AdManager inicializado. Pronto para simular monetização.');
    if (isPremium) {
      addLog('info', 'Status atual do usuário: Premium PRO. Anúncios estão desativados.');
    } else {
      addLog('info', 'Status atual do usuário: Freemium. Regra de 1 exercício por tela ativada.');
    }

    const handleAdImpression = (e: Event) => {
      const customEvent = e as CustomEvent;
      const brand = customEvent.detail?.brand || 'Parceiro';
      
      setImpressions(prev => {
        const next = prev + 1;
        localStorage.setItem('gymdemocra_ad_impressions', next.toString());
        return next;
      });

      const earned = 0.15;
      setRevenue(prev => {
        const next = parseFloat((prev + earned).toFixed(2));
        localStorage.setItem('gymdemocra_ad_revenue', next.toString());
        return next;
      });

      addLog('impression', `Anúncio de ${brand} exibido! Descanso ativo.`, earned);
    };

    const handleAdClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      const brand = customEvent.detail?.brand || 'Parceiro';

      setClicks(prev => {
        const next = prev + 1;
        localStorage.setItem('gymdemocra_ad_clicks', next.toString());
        return next;
      });

      const earned = 4.50;
      setRevenue(prev => {
        const next = parseFloat((prev + earned).toFixed(2));
        localStorage.setItem('gymdemocra_ad_revenue', next.toString());
        return next;
      });

      addLog('click', `Usuário clicou no CTA de ${brand}! Redirecionamento de afiliado ativo.`, earned);
    };

    const handlePremiumChanged = (e: Event) => {
      const customEvent = e as CustomEvent;
      const premiumValue = customEvent.detail?.isPremium;
      setIsPremium(premiumValue);
      addLog('system', `Status de Assinatura alterado para: ${premiumValue ? '👑 Premium PRO' : '🆓 Freemium'}`);
    };

    window.addEventListener('gymdemocra_ad_impression', handleAdImpression);
    window.addEventListener('gymdemocra_ad_click', handleAdClick);
    window.addEventListener('gymdemocra_premium_changed', handlePremiumChanged);

    return () => {
      window.removeEventListener('gymdemocra_ad_impression', handleAdImpression);
      window.removeEventListener('gymdemocra_ad_click', handleAdClick);
      window.removeEventListener('gymdemocra_premium_changed', handlePremiumChanged);
    };
  }, [isPremium]);

  const handleTogglePremium = () => {
    const nextPremium = !isPremium;
    setIsPremium(nextPremium);
    localStorage.setItem('gymdemocra_is_premium', nextPremium.toString());
    
    // Dispatch event to MobileSimulator
    const event = new CustomEvent('gymdemocra_premium_changed_by_manager', {
      detail: { isPremium: nextPremium }
    });
    window.dispatchEvent(event);
  };

  const handleForceAd = () => {
    if (isPremium) {
      addLog('system', 'Erro: Não é possível forçar anúncio para usuário Premium!');
      return;
    }
    addLog('system', 'Solicitação de Intersticial Forçado enviada para o simulador.');
    const event = new CustomEvent('gymdemocra_force_ad_by_manager');
    window.dispatchEvent(event);
  };

  const handleResetStats = () => {
    setImpressions(0);
    setClicks(0);
    setRevenue(0);
    localStorage.setItem('gymdemocra_ad_impressions', '0');
    localStorage.setItem('gymdemocra_ad_clicks', '0');
    localStorage.setItem('gymdemocra_ad_revenue', '0.00');
    setLogs([]);
    addLog('system', 'Estatísticas de monetização reiniciadas.');
  };

  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-6 text-white shadow-xl">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Módulo Monetização
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-black tracking-tight mt-1.5 font-sans flex items-center gap-2">
            🪙 AdManager <span className="text-zinc-500 text-sm font-normal">— Simulador de Ganhos Freemium</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans max-w-2xl">
            Monitore a receita passiva gerada com anúncios e comissões de afiliados durante o treino de usuários não pagantes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleResetStats}
            className="p-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-650 rounded-xl text-zinc-300 transition-all active:scale-95 text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer"
            title="Reiniciar estatísticas"
          >
            <RefreshCw size={12} /> Limpar
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-zinc-950/50 border border-emerald-900/30 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-3 top-3 text-emerald-500/10 group-hover:text-emerald-500/15 transition-colors">
            <DollarSign size={40} />
          </div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Receita Estimada</span>
          <div className="mt-2.5">
            <span className="text-2xl font-black tracking-tight text-emerald-400 font-sans">
              R$ {revenue.toFixed(2)}
            </span>
            <span className="text-[9px] text-zinc-500 block mt-1 font-mono">
              Impressões + Afiliados
            </span>
          </div>
        </div>

        {/* Impressions */}
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-3 top-3 text-zinc-600/10 group-hover:text-zinc-600/20 transition-colors">
            <Eye size={40} />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Impressões Ads</span>
          <div className="mt-2.5">
            <span className="text-2xl font-black tracking-tight text-white font-sans">
              {impressions}
            </span>
            <span className="text-[9px] text-zinc-500 block mt-1 font-mono">
              R$ 0,15 por exibição
            </span>
          </div>
        </div>

        {/* Clicks */}
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-3 top-3 text-zinc-600/10 group-hover:text-zinc-600/20 transition-colors">
            <MousePointer size={40} />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Cliques (Afiliados)</span>
          <div className="mt-2.5">
            <span className="text-2xl font-black tracking-tight text-white font-sans">
              {clicks}
            </span>
            <span className="text-[9px] text-zinc-500 block mt-1 font-mono">
              R$ 4,50 de comissão/venda
            </span>
          </div>
        </div>

        {/* CTR */}
        <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-3 top-3 text-zinc-600/10 group-hover:text-zinc-600/20 transition-colors">
            <TrendingUp size={40} />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Taxa de Cliques (CTR)</span>
          <div className="mt-2.5">
            <span className="text-2xl font-black tracking-tight text-orange-400 font-sans">
              {ctr}%
            </span>
            <span className="text-[9px] text-zinc-500 block mt-1 font-mono">
              Média do mercado: 1.5% - 3.0%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-zinc-950/30 border border-zinc-850 rounded-2xl p-4 space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" /> Controles de Fluxo Comercial
          </h3>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            Use os botões de simulação abaixo para forçar comportamentos específicos de anúncios ou alternar o tipo de conta e ver o impacto no aplicativo em tempo real.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1.5">
            {/* Account toggle */}
            <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[9px] font-bold text-zinc-500 font-mono block">PLANO DO SIMULADOR</span>
                <span className={`text-[10px] font-extrabold uppercase mt-1 block ${isPremium ? 'text-amber-400' : 'text-zinc-400'}`}>
                  {isPremium ? '👑 PREMIUM PRO' : '🆓 FREEMIUM (FREE)'}
                </span>
              </div>
              <button
                onClick={handleTogglePremium}
                className={`w-full py-1.5 rounded-lg text-[9.5px] font-extrabold uppercase tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${
                  isPremium 
                    ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700' 
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/10'
                }`}
              >
                {isPremium ? 'Mudar para Free' : 'Ativar Premium'}
              </button>
            </div>

            {/* Force Interstitial */}
            <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[9px] font-bold text-zinc-500 font-mono block">FORÇAR INTERSTICIAL</span>
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase mt-1 block">
                  {isPremium ? 'Desativado (Premium)' : 'Liberado p/ Teste'}
                </span>
              </div>
              <button
                disabled={isPremium}
                onClick={handleForceAd}
                className={`w-full py-1.5 rounded-lg text-[9.5px] font-extrabold uppercase tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${
                  isPremium 
                    ? 'bg-zinc-950 text-zinc-650 border border-zinc-900 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-600/10'
                }`}
              >
                <Play size={10} fill="currentColor" /> Forçar Anúncio
              </button>
            </div>
          </div>
        </div>

        {/* Real-time monetization telemetry logs */}
        <div className="bg-zinc-950/30 border border-zinc-850 rounded-2xl p-4 flex flex-col h-[180px]">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center justify-between border-b border-zinc-850 pb-2">
            <span className="flex items-center gap-1.5"><Terminal size={13} className="text-zinc-500" /> Log de Transações em Tempo Real</span>
            <span className="text-[8px] bg-zinc-900 text-zinc-400 font-bold px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-widest font-mono">TELEMETRY</span>
          </h3>

          <div className="flex-1 overflow-y-auto font-mono text-[9.5px] mt-2 space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-zinc-850">
            {logs.length === 0 ? (
              <p className="text-zinc-600 italic text-center pt-8">Aguardando interações comerciais...</p>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex items-start gap-1.5 leading-snug border-b border-zinc-900/40 pb-1 last:border-0">
                  <span className="text-zinc-500 shrink-0">[{log.timestamp}]</span>
                  <div className="flex-1">
                    <span className={`font-bold mr-1 ${
                      log.type === 'impression' ? 'text-blue-400' :
                      log.type === 'click' ? 'text-emerald-400' :
                      log.type === 'system' ? 'text-zinc-400' : 'text-zinc-400'
                    }`}>
                      {log.type.toUpperCase()}:
                    </span>
                    <span className="text-zinc-300">{log.message}</span>
                  </div>
                  {log.revenue !== undefined && (
                    <span className="text-emerald-400 font-extrabold shrink-0 pl-1">
                      +R$ {log.revenue.toFixed(2)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monetization Mechanics breakdown */}
      <div className="bg-zinc-950/60 border border-zinc-850 rounded-2xl p-4">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-3">
          <ShieldCheck size={13} className="text-emerald-500" /> Regras Comerciais da Assinatura e Anúncios Integrados
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] text-zinc-400 leading-relaxed font-sans">
          <div className="space-y-1 bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900">
            <strong className="text-zinc-200 text-xs block">1. Um Exercício por Tela</strong>
            <p>
              O usuário free visualiza apenas <strong>um exercício ativo por vez</strong>, com foco total. Os outros ficam visualmente travados, maximizando o engajamento e a disciplina de execução.
            </p>
          </div>
          <div className="space-y-1 bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900">
            <strong className="text-zinc-200 text-xs block">2. Monetização no Descanso</strong>
            <p>
              Ao concluir o exercício, o app força um <strong>intersticial patrocinado</strong> durante o período do cronômetro. O usuário não perde tempo, e cada descanso gera renda passiva garantida.
            </p>
          </div>
          <div className="space-y-1 bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900">
            <strong className="text-zinc-200 text-xs block">3. Conversão Premium PRO</strong>
            <p>
              Anúncios e restrições geram o incentivo perfeito para assinar o plano <strong>Premium PRO (R$ 19,90/mês)</strong>, que desbloqueia visão geral livre do treino, remove ads e libera relatórios avançados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
