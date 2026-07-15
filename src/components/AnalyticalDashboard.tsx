import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import { 
  BarChart2, 
  TrendingUp, 
  Flame, 
  Plus, 
  RotateCcw, 
  Scale, 
  Droplet, 
  Utensils, 
  Dumbbell, 
  Sparkles, 
  ChevronRight, 
  Activity 
} from 'lucide-react';
import { UserProfile, Objective } from '../types';

export default function AnalyticalDashboard() {
  // --- Profile state synced with localStorage ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gymdemocra_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback default profile
      }
    }
    return {
      objective: 'ganhar_massa',
      location: 'academia_media',
      daysPerWeek: 4,
      allowedMachines: ['leg_press', 'polias', 'pesos_livres', 'maquinas'],
      healthLimitations: ['nenhuma'],
      workoutDurationCategory: 'moderado',
      weight: 75,
      height: 170,
      desiredWeight: 70,
      experienceLevel: 'iniciante',
      waterDrunk: 0
    };
  });

  // Tweakable mock states for interactive demo
  const [extraVolume, setExtraVolume] = useState<Record<string, number>>({
    Seg: 0, Ter: 0, Qua: 0, Qui: 0, Sex: 0, Sáb: 0, Dom: 0
  });
  
  const [customWeeksLog, setCustomWeeksLog] = useState<number[]>([79, 77.8, 77.2, 76.5, 75.8, 75.0]);

  // States for 2-month training evolution
  const [selectedExercise, setSelectedExercise] = useState<'supino' | 'agachamento' | 'leg_press' | 'rosca_direta'>('supino');
  const [consistencyLevel, setConsistencyLevel] = useState<'alta' | 'media' | 'baixa'>('alta');

  // Synchronize with MobileSimulator storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('gymdemocra_profile');
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (e) {
          // ignore
        }
      }
    };
    
    // Poll to capture in-page state changes instantly
    const interval = setInterval(handleStorageChange, 1000);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update localStorage helper
  const updateProfileInStorage = (updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem('gymdemocra_profile', JSON.stringify(updated));
    // Dispatch a storage event to alert other components
    window.dispatchEvent(new Event('storage'));
  };

  // --- Dynamic calculations based on user objective ---
  const getObjectiveLabel = (obj: Objective) => {
    switch (obj) {
      case 'emagrecer': return 'Déficit Calórico / Definição';
      case 'ganhar_massa': return 'Hipertrofia / Ganho de Massa';
      case 'ganhar_forca': return 'Força Máxima';
      case 'definicao': return 'Definição / Recondicionamento';
      case 'saude_longevidade': return 'Saúde & Longevidade';
      default: return 'Geral';
    }
  };

  // 1. Calculations for Nutrition Pie Chart (g/kg weight and macro splits)
  // Target total calorie multiplier depending on objective
  const getCalorieMultiplier = (obj: Objective) => {
    switch (obj) {
      case 'emagrecer': return 22; // 22 kcal/kg
      case 'ganhar_massa': return 35; // 35 kcal/kg
      case 'ganhar_forca': return 32;
      case 'definicao': return 25;
      case 'saude_longevidade': return 28;
      default: return 28;
    }
  };

  const currentWeight = profile.weight || 75;
  const targetWeight = profile.desiredWeight || 70;
  
  // Biological female profile has slightly lower calorie requirement adjustment (~12% lower baseline)
  const genderCalorieModifier = profile.gender === 'feminino' ? 0.88 : 1.0;
  const targetCalories = Math.round(currentWeight * getCalorieMultiplier(profile.objective) * genderCalorieModifier);

  // Macronutrient splits (%) based on objective
  const getMacroSplits = (obj: Objective) => {
    switch (obj) {
      case 'emagrecer': 
        return { carbs: 30, protein: 45, fats: 25 };
      case 'ganhar_massa': 
        return { carbs: 50, protein: 30, fats: 20 };
      case 'ganhar_forca': 
        return { carbs: 45, protein: 35, fats: 20 };
      case 'definicao': 
        return { carbs: 35, protein: 40, fats: 25 };
      case 'saude_longevidade': 
        return { carbs: 40, protein: 35, fats: 25 };
      default: 
        return { carbs: 40, protein: 35, fats: 25 };
    }
  };

  const splits = getMacroSplits(profile.objective);
  const carbGrams = Math.round((targetCalories * (splits.carbs / 100)) / 4);
  const proteinGrams = Math.round((targetCalories * (splits.protein / 100)) / 4);
  const fatGrams = Math.round((targetCalories * (splits.fats / 100)) / 9);

  const macroPieData = [
    { name: 'Carboidratos', value: splits.carbs, grams: carbGrams, color: '#38bdf8' },
    { name: 'Proteínas', value: splits.protein, grams: proteinGrams, color: 'var(--accent)' },
    { name: 'Gorduras', value: splits.fats, grams: fatGrams, color: '#fbbf24' }
  ];

  // 2. Calculations for Volume Bar Chart (Séries x Repetições x Carga por grupo muscular)
  // Base intensity factor depending on experience level
  const getLevelFactor = () => {
    switch (profile.experienceLevel) {
      case 'iniciante': return 1.0;
      case 'intermediario': return 1.35;
      case 'avancado': return 1.8;
      default: return 1.0;
    }
  };

  // Base multiplier depending on days per week
  const daysFactor = Math.min(Math.max(profile.daysPerWeek || 4, 1), 7) / 4;

  const baseSuperiorVolume = Math.round(2400 * getLevelFactor() * daysFactor);
  const baseInferiorVolume = Math.round(2800 * getLevelFactor() * daysFactor);
  const baseCoreVolume = Math.round(1200 * getLevelFactor() * daysFactor);

  const weeklyVolumeData = [
    { name: 'Seg', Superior: Math.round((baseSuperiorVolume * 0.4) + (extraVolume.Seg * 0.6)), Inferior: 0, Core: Math.round(200 + extraVolume.Seg * 0.2) },
    { name: 'Ter', Superior: 0, Inferior: Math.round((baseInferiorVolume * 0.5) + (extraVolume.Ter * 0.8)), Core: Math.round(150 + extraVolume.Ter * 0.1) },
    { name: 'Qua', Superior: Math.round((baseSuperiorVolume * 0.25) + (extraVolume.Qua * 0.4)), Inferior: 0, Core: Math.round(400 + extraVolume.Qua * 0.3) },
    { name: 'Qui', Superior: 0, Inferior: Math.round((baseInferiorVolume * 0.4) + (extraVolume.Qui * 0.8)), Core: 0 },
    { name: 'Sex', Superior: Math.round((baseSuperiorVolume * 0.35) + (extraVolume.Sex * 0.5)), Inferior: 0, Core: Math.round(250 + extraVolume.Sex * 0.3) },
    { name: 'Sáb', Superior: Math.round(200 + extraVolume.Sáb * 0.2), Inferior: Math.round(150 + extraVolume.Sáb * 0.2), Core: Math.round((baseCoreVolume * 0.3) + extraVolume.Sáb * 0.5) },
    { name: 'Dom', Superior: 0, Inferior: 0, Core: Math.round(extraVolume.Dom * 0.5) }
  ];

  // 3. Weight progress over 6 weeks
  // Let's create an elegant progression from customWeeksLog or dynamic based on weight/desiredWeight
  const getWeightTimelineData = () => {
    const diff = currentWeight - targetWeight;
    const steps = 6;
    return Array.from({ length: steps }).map((_, idx) => {
      // Create a nice regression or progression toward the target weight
      const fraction = idx / (steps - 1);
      let simulatedWeight = currentWeight;
      
      if (idx < customWeeksLog.length) {
        simulatedWeight = customWeeksLog[idx];
      } else {
        // Fallback smooth math
        simulatedWeight = Number((currentWeight - (diff * fraction * 0.8)).toFixed(1));
      }

      return {
        name: `Seman ${idx + 1}`,
        'Peso Atual': simulatedWeight,
        'Peso Desejado': targetWeight
      };
    });
  };

  const weightTimelineData = getWeightTimelineData();

  // 4. Muscle Group Balance Radar Chart
  // Determines intensity representation across the kinetic chain
  const getRadarData = () => {
    const totalExtra = (Object.values(extraVolume) as number[]).reduce((a: number, b: number) => a + b, 0);
    const extraSupe = totalExtra * 0.4;
    const extraInfe = totalExtra * 0.4;
    const extraCore = totalExtra * 0.2;

    const supIntensity = Math.min(100, Math.round(50 * getLevelFactor() + (extraSupe / 100)));
    const infIntensity = Math.min(100, Math.round(45 * getLevelFactor() + (extraInfe / 100)));
    const coreIntensity = Math.min(100, Math.round(40 * getLevelFactor() + (extraCore / 100)));
    const cardiovascular = profile.objective === 'emagrecer' ? 85 : 55;
    const flexibilidade = 45 + (profile.objective === 'saude_longevidade' ? 30 : 5);
    const forcaGeral = Math.min(100, Math.round(40 * getLevelFactor() + (profile.objective === 'ganhar_forca' ? 35 : 10)));

    return [
      { subject: 'Superior', A: supIntensity, fullMark: 100 },
      { subject: 'Cardio', A: cardiovascular, fullMark: 100 },
      { subject: 'Core/Lombar', A: coreIntensity, fullMark: 100 },
      { subject: 'Força Geral', A: forcaGeral, fullMark: 100 },
      { subject: 'Inferior', A: infIntensity, fullMark: 100 },
      { subject: 'Flexibilidade', A: flexibilidade, fullMark: 100 }
    ];
  };

  const radarData = getRadarData();

  // 5. 2-Month (8 Weeks) Training Evolution Projection
  const getAdaptationTimelineData = () => {
    // Consistency multiplier
    const consistencyMults = { alta: 1.0, media: 0.6, baixa: 0.15 };
    const mult = consistencyMults[consistencyLevel];

    // Base weight factor based on exercise & experience level
    let baseWeight = 40;
    let exerciseLabel = 'Supino Reto';
    let maxOverloadPercent = 0.25; // 25% max strength gain over 2 months

    switch (selectedExercise) {
      case 'supino':
        exerciseLabel = 'Supino Reto';
        const supMult = { iniciante: 0.5, intermediario: 0.85, avancado: 1.25 };
        baseWeight = Math.round(currentWeight * supMult[profile.experienceLevel]);
        maxOverloadPercent = 0.22;
        break;
      case 'agachamento':
        exerciseLabel = 'Agachamento Livre';
        const agachMult = { iniciante: 0.7, intermediario: 1.15, avancado: 1.65 };
        baseWeight = Math.round(currentWeight * agachMult[profile.experienceLevel]);
        maxOverloadPercent = 0.28;
        break;
      case 'leg_press':
        exerciseLabel = 'Leg Press 45º';
        const legMult = { iniciante: 1.5, intermediario: 2.3, avancado: 3.5 };
        baseWeight = Math.round(currentWeight * legMult[profile.experienceLevel]);
        maxOverloadPercent = 0.32;
        break;
      case 'rosca_direta':
        exerciseLabel = 'Rosca Direta (Polia/Barra)';
        const roscaMult = { iniciante: 0.18, intermediario: 0.28, avancado: 0.42 };
        baseWeight = Math.round(currentWeight * roscaMult[profile.experienceLevel]);
        maxOverloadPercent = 0.15;
        break;
    }

    // Adjust base weight slightly depending on goal
    if (profile.objective === 'ganhar_forca') {
      baseWeight = Math.round(baseWeight * 1.1);
      maxOverloadPercent += 0.05;
    } else if (profile.objective === 'emagrecer') {
      baseWeight = Math.round(baseWeight * 0.95);
      maxOverloadPercent -= 0.03;
    }

    // Generate 8 weeks of progression data
    return Array.from({ length: 8 }).map((_, i) => {
      const week = i + 1;
      
      // Sigmoid/logistic-like progression for adaptation efficiency
      const baseEfficiency = 40;
      // Efficiency goes up to 95% with high consistency, less with lower consistency
      const maxEfficiencyGain = 55 * (consistencyLevel === 'alta' ? 1.0 : consistencyLevel === 'media' ? 0.7 : 0.3);
      const k = 0.6; // growth rate
      const x0 = 3.5; // midpoint week
      const efficiency = Math.round(baseEfficiency + maxEfficiencyGain / (1 + Math.exp(-k * (week - x0))));

      // Progressive overload (carga de treino) progression over weeks
      // If consistency is low, strength doesn't grow much
      const weeklyGainFactor = Math.sin((i / 7) * (Math.PI / 2)); // curve that starts fast and stabilizes
      const load = Number((baseWeight * (1 + maxOverloadPercent * mult * weeklyGainFactor)).toFixed(1));

      // Fatigue vs Fitness curve
      // Fitness increases with consistency, fatigue accumulates but resets on Week 4 (classic deload/halfway adaptation point)
      let fatigue = Math.round(30 + week * 6 * mult);
      if (week > 4) {
        fatigue = Math.round(40 + (week - 4) * 4 * mult); // Deload week 4 drops fatigue
      } else if (week === 4) {
        fatigue = Math.round(20 + 2 * mult); // Deload drop
      }

      // Safe RPE with progressive overload (stays around 7.5 - 8.5)
      const rpeWithOverload = Number((7.0 + (mult * 1.2) + (week === 4 ? -1.0 : 0) + (Math.sin(week) * 0.2)).toFixed(1));
      
      // RPE if they lifted the exact same Week 1 weight (fixed load) for 8 weeks
      // The same weight gets much lighter as efficiency and strength grows
      const rpeWithFixedWeight = Number(Math.max(3.0, 8.5 - (efficiency - baseEfficiency) * 0.1).toFixed(1));

      return {
        name: `Sem ${week}`,
        'Carga com Sobrecarga': load,
        'Eficiência Neuromuscular (%)': efficiency,
        'Fadiga Acumulada': fatigue,
        'Percepção de Esforço (Carga Fixa)': rpeWithFixedWeight,
        'Percepção de Esforço (Sobrecarga)': rpeWithOverload,
        label: exerciseLabel
      };
    });
  };

  const adaptationTimelineData = getAdaptationTimelineData();

  // --- Handlers for interactive workspace adjustments ---
  const handleTweakWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    updateProfileInStorage({
      ...profile,
      weight: val
    });

    // Update the custom log history to align dynamically
    const updatedLog = [...customWeeksLog];
    updatedLog[updatedLog.length - 1] = val;
    // Retroactively create a logical trend back in time
    const stepDiff = (updatedLog[0] - val) / 5;
    for (let i = 0; i < 5; i++) {
      updatedLog[i] = Number((val + (5 - i) * stepDiff).toFixed(1));
    }
    setCustomWeeksLog(updatedLog);
  };

  const handleTweakTargetWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfileInStorage({
      ...profile,
      desiredWeight: Number(e.target.value)
    });
  };

  const handleSimulateWorkout = (day: string) => {
    setExtraVolume(prev => ({
      ...prev,
      [day]: prev[day] + 1500 // Adds 1500kg of simulated load volume (sets * reps * load)
    }));
  };

  const handleResetSimulated = () => {
    setExtraVolume({ Seg: 0, Ter: 0, Qua: 0, Qui: 0, Sex: 0, Sáb: 0, Dom: 0 });
    // Reset weights log to default trend
    setCustomWeeksLog([79, 77.8, 77.2, 76.5, 75.8, profile.weight]);
  };

  // Sum total simulated volume
  const totalWeeklyVolume = Math.round(
    weeklyVolumeData.reduce((acc, curr) => acc + curr.Superior + curr.Inferior + curr.Core, 0)
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-sans flex-wrap">
            <BarChart2 className="text-accent animate-pulse" />
            Dashboard Analítico de Progresso (MVP)
            <span className="text-[10px] bg-zinc-800 text-zinc-300 font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              {profile.gender === 'feminino' ? '👩 Feminino' : '👨 Masculino'}
            </span>
          </h2>
          <p className="text-zinc-400 text-xs mt-1 font-sans">
            Métricas de treino e nutrição em tempo real. Este console utiliza <code className="text-accent font-semibold">recharts</code> para plotar dinamicamente a evolução do atleta com base nos dados do simulador.
          </p>
        </div>
        <button
          onClick={handleResetSimulated}
          className="self-start md:self-center flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
        >
          <RotateCcw size={12} />
          Limpar Simulações
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Weight vs Target */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Peso / Meta</span>
            <Scale size={16} className="text-accent" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black font-mono text-white">{currentWeight}</span>
            <span className="text-xs text-zinc-500 font-mono ml-1">/ {targetWeight} kg</span>
          </div>
          <div className="mt-2.5 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-accent h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.max(10, (targetWeight / currentWeight) * 100))}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Estimated Weekly Volume */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Carga Semanal</span>
            <Dumbbell size={16} className="text-blue-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black font-mono text-white">
              {totalWeeklyVolume.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] text-zinc-500 font-sans block mt-0.5">kg acumulados (Séries x Reps x Carga)</span>
          </div>
        </div>

        {/* KPI 3: Calories Target */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Meta Calórica</span>
            <Flame size={16} className="text-amber-500" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black font-mono text-white">
              {targetCalories.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] text-zinc-500 font-sans block mt-0.5">kcal/dia recomendados</span>
          </div>
        </div>

        {/* KPI 4: Water Recommendation */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Hidratação Mínima</span>
            <Droplet size={16} className="text-sky-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black font-mono text-white">
              {(Math.round(currentWeight * 35) / 1000).toFixed(2)}
            </span>
            <span className="text-xs text-zinc-500 font-mono ml-1">Litros / dia</span>
          </div>
          <div className="text-[9px] text-emerald-400 font-semibold mt-2.5 flex items-center gap-1">
            <Activity size={10} /> 35ml por kg de peso corporal
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Volume de Treino Semanal por Grupo Muscular */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col h-[340px]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-sans">Evolução do Volume de Treino</h3>
              <p className="text-[10px] text-zinc-500 font-sans">Carga total semanal acumulada por dia em kg</p>
            </div>
            <span className="text-[9px] font-mono bg-blue-950 text-blue-400 border border-blue-900 rounded px-1.5 py-0.5">
              Barras Empilhadas
            </span>
          </div>
          
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyVolumeData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                  labelClassName="font-bold text-zinc-200"
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Superior" stackId="a" fill="#3b82f6" name="Superior" />
                <Bar dataKey="Inferior" stackId="a" fill="var(--accent)" name="Inferior" />
                <Bar dataKey="Core" stackId="a" fill="#10b981" name="Core / Lombar" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Evolução do Peso Corporal vs Meta */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col h-[340px]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-sans">Evolução de Peso Corporal</h3>
              <p className="text-[10px] text-zinc-500 font-sans">Evolução de 6 semanas em direção à meta</p>
            </div>
            <span className="text-[9px] font-mono bg-amber-950 text-amber-400 border border-amber-900 rounded px-1.5 py-0.5">
              Área + Linha Guia
            </span>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weightTimelineData}
                margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} domain={[dataMin => Math.floor(dataMin - 2), dataMax => Math.ceil(dataMax + 2)]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area type="monotone" dataKey="Peso Atual" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" name="Peso Registrado (kg)" />
                <ReferenceLine y={targetWeight} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'Meta', fill: '#10b981', position: 'top', fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Divisão Calórica e Macronutrientes por Objetivo */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col h-[340px]">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-white font-sans">Divisão Ideal de Macronutrientes</h3>
            <p className="text-[10px] text-zinc-500 font-sans">Estimativa diária calibrada para: <span className="text-accent font-semibold">{getObjectiveLabel(profile.objective)}</span></p>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            {/* Pie Chart Representation */}
            <div className="md:col-span-7 h-[200px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {macroPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Text for Center of Pie */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
                <span className="text-xs text-zinc-500 font-sans">Total</span>
                <span className="text-base font-black font-mono text-zinc-100">{targetCalories}</span>
                <span className="text-[9px] text-zinc-500 font-mono">kcal/dia</span>
              </div>
            </div>

            {/* Macro Labels Table */}
            <div className="md:col-span-5 space-y-2 text-xs">
              {macroPieData.map((macro, idx) => (
                <div key={idx} className="bg-zinc-900/50 p-2 rounded-lg border border-zinc-850 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: macro.color }}></span>
                    <span className="text-zinc-350 truncate font-medium">{macro.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-white font-mono">{macro.grams}g</span>
                    <span className="text-[9px] text-zinc-500 font-mono ml-1">({macro.value}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 4: Equilíbrio de Grupos Musculares (Radar) */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col h-[340px]">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-white font-sans">Equilíbrio Muscular & Foco</h3>
            <p className="text-[10px] text-zinc-500 font-sans">Intensidade, volume e frequência mapeados</p>
          </div>

          <div className="flex-1 w-full text-xs flex items-center justify-center">
            <ResponsiveContainer width="100%" height="95%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" stroke="#a1a1aa" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#52525b" fontSize={8} />
                <Radar 
                  name="Mapeamento Corporal" 
                  dataKey="A" 
                  stroke="var(--accent)" 
                  fill="var(--accent)" 
                  fillOpacity={0.25} 
                />
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 2-MONTH PROJECTION SECTION */}
      <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-accent uppercase tracking-wider font-sans">
              <TrendingUp size={12} />
              Biologia da Adaptação
            </div>
            <h3 className="text-base font-bold text-white font-sans mt-0.5">Projeção: 2 Meses com o Mesmo Treino</h3>
            <p className="text-xs text-zinc-450 font-sans mt-0.5">
              Por que manter a mesma rotina de exercícios por 8 semanas? Veja como a sobrecarga progressiva, fadiga e eficiência neuromuscular se comportam no seu corpo.
            </p>
          </div>

          {/* Interactive options directly on top of section */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Exercise Selector */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase font-mono block">Exercício de Foco</span>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value as any)}
                className="bg-zinc-900 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-zinc-800 focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="supino">🏋️ Supino Reto</option>
                <option value="agachamento">🏋️ Agachamento Livre</option>
                <option value="leg_press">🦵 Leg Press 45º</option>
                <option value="rosca_direta">💪 Rosca Direta</option>
              </select>
            </div>

            {/* Consistency selector */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase font-mono block">Consistência do Atleta</span>
              <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                {(['alta', 'media', 'baixa'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setConsistencyLevel(level)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-sans transition-colors cursor-pointer uppercase ${
                      consistencyLevel === level
                        ? 'bg-accent text-white shadow-sm font-black'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {level === 'alta' ? 'Alta (100%)' : level === 'media' ? 'Média (~70%)' : 'Baixa (<40%)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Charts Grid for the 2 months */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Chart: Progressive Overload & Efficiency (8 cols) */}
          <div className="xl:col-span-8 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex flex-col justify-between min-h-[340px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-xs font-bold text-white font-sans">Curva de Sobrecarga e Adaptação Neural</h4>
                <p className="text-[10px] text-zinc-400 font-sans">Aumento de carga projetado (kg) vs. evolução da coordenação intramuscular (%)</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[9px] font-mono">
                <span className="flex items-center gap-1 text-accent"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Carga (kg)</span>
                <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Eficiência (%)</span>
                <span className="flex items-center gap-1 text-zinc-500"><span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span> Fadiga</span>
              </div>
            </div>

            <div className="flex-1 w-full text-xs min-h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={adaptationTimelineData}
                  margin={{ top: 10, right: -5, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#71717a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                    labelClassName="font-bold text-zinc-200 text-xs"
                  />
                  {/* Carga como área */}
                  <Area yAxisId="left" type="monotone" dataKey="Carga com Sobrecarga" fill="url(#colorAdaptLoad)" stroke="var(--accent)" strokeWidth={2.5} name="Carga Sugerida (kg)" />
                  {/* Eficiência como linha verde */}
                  <Line yAxisId="right" type="monotone" dataKey="Eficiência Neuromuscular (%)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Eficiência Neural (%)" />
                  {/* Fadiga como linha tracejada */}
                  <Line yAxisId="right" type="monotone" dataKey="Fadiga Acumulada" stroke="#71717a" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Fadiga Acumulada" />
                  
                  <defs>
                    <linearGradient id="colorAdaptLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Info Panel & Secondary chart (4 cols) */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            {/* Dynamic mini text box explaining the biological response */}
            <div className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white font-sans flex items-center gap-1">
                  <Activity size={12} className="text-emerald-400" />
                  Efeito de Adaptação de 8 Semanas
                </h4>
                <div className="text-[11px] text-zinc-400 font-sans mt-2 space-y-2.5 leading-relaxed">
                  <p>
                    Ao manter a mesma rotina, as primeiras 3 semanas geram adaptação neural imediata (coordenação e recrutamento motor).
                  </p>
                  <p>
                    Na <span className="text-zinc-300 font-semibold">Semana 4 (Deload)</span>, uma redução programada de esforço reduz a fadiga acumulada, prevenindo lesões e preparando o corpo para o pico de ganho de semanas 5 a 8.
                  </p>
                  <p>
                    Com consistência <span className="text-accent font-semibold uppercase">{consistencyLevel === 'alta' ? 'Alta' : consistencyLevel === 'media' ? 'Média' : 'Baixa'}</span>, sua carga projetada no <span className="text-white font-semibold">{adaptationTimelineData[0]?.label}</span> progride de <span className="text-accent font-bold font-mono">{adaptationTimelineData[0]?.['Carga com Sobrecarga']} kg</span> para <span className="text-accent font-bold font-mono">{adaptationTimelineData[7]?.['Carga com Sobrecarga']} kg</span> (+{Math.round(((adaptationTimelineData[7]?.['Carga com Sobrecarga'] - adaptationTimelineData[0]?.['Carga com Sobrecarga']) / adaptationTimelineData[0]?.['Carga com Sobrecarga']) * 100)}%).
                  </p>
                </div>
              </div>

              {/* Mini feedback card */}
              <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-850 flex items-start gap-2.5">
                <div className="p-1 rounded bg-accent/15 text-accent shrink-0 mt-0.5 animate-pulse">
                  <Dumbbell size={12} />
                </div>
                <div>
                  <h5 className="text-[10px] font-bold text-white font-sans">Análise Biomecânica</h5>
                  <p className="text-[9px] text-zinc-500 font-sans">
                    {consistencyLevel === 'alta' 
                      ? 'Parabéns! Consistência perfeita permite hipertrofia mecânica ideal e aumento de densidade de miofibrilas.'
                      : consistencyLevel === 'media'
                      ? 'Evolução moderada. Faltas esporádicas retardam o pico neural e reduzem em ~40% a progressão ideal.'
                      : 'Alerta de estagnação. Sem estímulo recorrente, a supercompensação biológica não se consolida.'}
                  </p>
                </div>
              </div>
            </div>

            {/* RPE Chart: Comparing fixed weight vs progressive overload */}
            <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-850 flex flex-col h-[180px]">
              <div>
                <h5 className="text-[10px] font-bold text-white font-sans">Zona de Esforço Percebido (RPE)</h5>
                <p className="text-[9px] text-zinc-500 font-sans">Esforço ideal: 7.5 a 8.5. Carga fixa por 2 meses vira platô inútil (RPE cai para 4.0).</p>
              </div>
              <div className="flex-1 w-full text-[9px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={adaptationTimelineData}
                    margin={{ top: 5, right: 5, left: -30, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={9} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={9} domain={[0, 10]} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '6px', fontSize: 9 }} />
                    <Line type="monotone" dataKey="Percepção de Esforço (Sobrecarga)" stroke="var(--accent)" strokeWidth={2.5} dot={false} name="RPE Sobrecarga (Ideal)" />
                    <Line type="monotone" dataKey="Percepção de Esforço (Carga Fixa)" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="RPE Carga Fixa (Estagna)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Interactive Controls Panel */}
      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-4">
        <div>
          <span className="text-[9px] font-bold text-accent uppercase tracking-wider font-sans flex items-center gap-1">
            <Sparkles size={11} className="animate-pulse" />
            Console de Tweak de Dados (Simulador ⇄ Gráficos)
          </span>
          <h3 className="text-sm font-bold text-white font-sans mt-0.5">Simule as Mudanças em Tempo Real</h3>
          <p className="text-xs text-zinc-450 font-sans leading-relaxed mt-1">
            Abaixo estão ferramentas de ajuste rápido. Alterar esses valores afeta os gráficos instantaneamente. Ao alterar os pesos, os dados sincronizam automaticamente com o simulador de celular!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-900">
          
          {/* Sliders Area */}
          <div className="space-y-4">
            {/* Weight Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-medium font-sans">Peso Atual do Atleta</span>
                <span className="text-accent font-bold font-mono">{currentWeight} kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={currentWeight}
                onChange={handleTweakWeight}
                className="w-full accent-accent bg-zinc-900 rounded-lg appearance-none h-1.5 cursor-ew-resize"
              />
              <p className="text-[9px] text-zinc-500 font-sans">Regula calorias necessárias, metas de água e macros.</p>
            </div>

            {/* Target Weight Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-medium font-sans">Meta de Peso Corporal</span>
                <span className="text-emerald-400 font-bold font-mono">{targetWeight} kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={targetWeight}
                onChange={handleTweakTargetWeight}
                className="w-full accent-emerald-500 bg-zinc-900 rounded-lg appearance-none h-1.5 cursor-ew-resize"
              />
              <p className="text-[9px] text-zinc-500 font-sans">Altera a linha guia verde de meta no gráfico de pesos.</p>
            </div>
          </div>

          {/* Simulate Completed Workouts Area */}
          <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-850 space-y-2.5">
            <h4 className="text-xs font-bold text-zinc-300 font-sans flex items-center gap-1">
              <Plus size={12} className="text-accent" />
              Adicionar Treinos Simulares (Volume de Carga)
            </h4>
            <p className="text-[10px] text-zinc-500 font-sans">
              Simule que o usuário concluiu treinos de alta carga na academia para ver as barras e o radar de volume crescerem:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
                <button
                  key={day}
                  onClick={() => handleSimulateWorkout(day)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-750 hover:border-accent/40 rounded px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  +{day}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
