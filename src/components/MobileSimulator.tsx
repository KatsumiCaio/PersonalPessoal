import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Exercise, DayWorkout, FoodReplacement, GoogleUser } from '../types';
import { getWorkoutForUser, getAlternativesForExercise } from '../data/workoutData';
import { foodReplacements } from '../data/nutritionData';
import { ExerciseAnimation } from './ExerciseAnimation';
import { Dumbbell, Utensils, User, Flame, Award, MapPin, Calendar, Compass, RefreshCw, Droplet, Plus, Coffee, AlertTriangle, Play, Pause, RotateCcw, Search, ChevronRight, Check, ChevronLeft, Scale, Clock, Heart, Activity, ChevronDown, Sparkles, Shuffle, Sliders, Send, Bot, Trash2, Sun, Moon } from 'lucide-react';
import { PALETTE_COLORS } from '../App';

// Constantes de Opções para o Questionário Expandido
const EQUIPMENT_OPTIONS = [
  { id: 'leg_press', name: 'Leg Press', desc: 'Foco em pernas (Quadríceps e Glúteos)', type: 'Máquina', icon: '🦵' },
  { id: 'polias', name: 'Crossover / Polias', desc: 'Cabos ajustáveis para membros superiores', type: 'Polias', icon: '⛓️' },
  { id: 'pesos_livres', name: 'Pesos Livres & Halteres', desc: 'Exercícios livres clássicos de força', type: 'Livre', icon: '🏋️' },
  { id: 'smith', name: 'Smith / Barra Guiada', desc: 'Segurança guiada em agachamentos/supinos', type: 'Máquina', icon: '⚖️' },
  { id: 'maquinas', name: 'Cadeira Extensora / Flexora', desc: 'Isolamento da parte frontal e posterior da coxa', type: 'Máquina', icon: '🦾' },
  { id: 'barra_graviton', name: 'Barra Fixa / Graviton', desc: 'Exercícios de puxar e costas', type: 'Livre/Assistido', icon: '🧗' },
];

const HEALTH_LIMITATIONS_OPTIONS = [
  { id: 'joelhos', name: 'Dor nos Joelhos', desc: 'Ex: Condromalácia patelar ou desgaste articular', icon: '🦵', warning: 'Cuidado no Leg Press e Extensora: evitar flexão extrema' },
  { id: 'lombar', name: 'Dor Lombar / Hérnia', desc: 'Dores crônicas nas costas ao levantar peso', icon: '🩹', warning: 'Postura impecável e abdômen contraído; evitar agachamento livre pesado' },
  { id: 'ombros', name: 'Lesão no Ombro', desc: 'Manguito rotador ou estalos dolorosos', icon: '💪', warning: 'Evitar desenvolvimentos por trás da cabeça e supino hiperestendido' },
  { id: 'hipertensao', name: 'Pressão Alta / Cardio', desc: 'Necessidade de controle de intensidade e frequência', icon: '❤️', warning: 'Foco em respiração contínua; nunca prenda a respiração (apneia)' },
  { id: 'nenhuma', name: 'Nenhuma limitação física', desc: 'Corpo 100% pronto para treinar sem restrições', icon: '✅', warning: 'Seguir treinos normais com técnica impecável' },
];

const screenVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.18, ease: "easeIn" } }
};

const tabVariants = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, x: -8, transition: { duration: 0.15, ease: "easeIn" } }
};

export default function MobileSimulator() {
  const [activePalette, setActivePalette] = useState(() => {
    const saved = localStorage.getItem('personalpessoal_accent_palette');
    return saved || 'laranja';
  });

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

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('personalpessoal_dark_mode');
    return saved !== 'false'; // Padrão é true (escuro)
  });

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    localStorage.setItem('personalpessoal_dark_mode', String(nextDark));
  };

  // Mobile UI States
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    const saved = localStorage.getItem('gymdemocra_google_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showGoogleSelectModal, setShowGoogleSelectModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<'reset_profile' | 'logout' | null>(null);
  const [customEmail, setCustomEmail] = useState<string>('');

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gymdemocra_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Synchronize onboarding form states when profile loads
  useEffect(() => {
    if (profile) {
      setObjective(profile.objective);
      setLocation(profile.location);
      setDays(profile.daysPerWeek);
      setWeight(profile.weight);
      setHeight(profile.height || 170);
      setDesiredWeight(profile.desiredWeight || 70);
      setExperienceLevel(profile.experienceLevel || 'iniciante');
      setWorkoutDurationCategory(profile.workoutDurationCategory || 'moderado');
      setAllowedMachines(profile.allowedMachines || ['leg_press', 'polias', 'pesos_livres', 'maquinas']);
      setHealthLimitations(profile.healthLimitations || ['nenhuma']);
      setGender(profile.gender || 'masculino');
    }
  }, [profile]);

  // Onboarding form states (Expanded Questionnaire Wizard)
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [objective, setObjective] = useState<'emagrecer' | 'ganhar_massa' | 'ganhar_forca' | 'saude_longevidade' | 'definicao'>('ganhar_massa');
  const [location, setLocation] = useState<'academia_pequena' | 'academia_media' | 'academia_franquia' | 'casa_calistenia'>('academia_media');
  const [days, setDays] = useState<number>(4);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(170);
  const [desiredWeight, setDesiredWeight] = useState<number>(70);
  const [experienceLevel, setExperienceLevel] = useState<'iniciante' | 'intermediario' | 'avancado'>('iniciante');
  const [workoutDurationCategory, setWorkoutDurationCategory] = useState<'rapido' | 'moderado' | 'completo'>('moderado');
  const [allowedMachines, setAllowedMachines] = useState<string[]>(['leg_press', 'polias', 'pesos_livres', 'maquinas']);
  const [healthLimitations, setHealthLimitations] = useState<string[]>(['nenhuma']);
  const [gender, setGender] = useState<'masculino' | 'feminino'>('masculino');

  // Active App States
  const [activeTab, setActiveTab] = useState<'treino' | 'alimentacao' | 'perfil'>('treino');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>({});
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [userWorkouts, setUserWorkouts] = useState<DayWorkout[]>([]);
  const [substitutingExerciseId, setSubstitutingExerciseId] = useState<string | null>(null);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editSeries, setEditSeries] = useState<string>('');
  const [editRest, setEditRest] = useState<number>(60);

  // Simulated day tracking to restrict access and editing based on chronological constraints
  const [simulatedDay, setSimulatedDay] = useState<string>(() => {
    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return weekdays[new Date().getDay()];
  });

  const WEEKDAY_ORDER: Record<string, number> = {
    'Segunda-feira': 1,
    'Terça-feira': 2,
    'Quarta-feira': 3,
    'Quinta-feira': 4,
    'Sexta-feira': 5,
    'Sábado': 6,
    'Domingo': 7
  };

  const getDayStatus = (dayName: string) => {
    const cleanDayName = dayName.split(' - ')[0].trim();
    const targetOrder = WEEKDAY_ORDER[cleanDayName];
    const currentOrder = WEEKDAY_ORDER[simulatedDay];
    
    if (!targetOrder || !currentOrder) return 'hoje';
    if (targetOrder < currentOrder) return 'passado';
    if (targetOrder > currentOrder) return 'futuro';
    return 'hoje';
  };

  // Auto-select the workout corresponding to the simulated today
  useEffect(() => {
    if (userWorkouts.length > 0) {
      const todayIdx = userWorkouts.findIndex(w => {
        const cleanName = w.dayName.split(' - ')[0].trim();
        return cleanName === simulatedDay;
      });
      if (todayIdx !== -1) {
        setSelectedDayIdx(todayIdx);
      }
    }
  }, [simulatedDay, userWorkouts]);

  // Synchronize custom workouts based on profile configuration or load custom edits from localStorage
  useEffect(() => {
    if (profile) {
      const currentProfileKey = `${profile.objective}_${profile.location}_${profile.daysPerWeek}_${profile.workoutDurationCategory || 'moderado'}_${profile.experienceLevel || 'intermediario'}`;
      const savedDataStr = localStorage.getItem('personalpessoal_custom_workouts_v3');
      if (savedDataStr) {
        try {
          const savedData = JSON.parse(savedDataStr);
          if (savedData.profileKey === currentProfileKey) {
            setUserWorkouts(savedData.workouts);
            return;
          }
        } catch (e) {
          // fallback to generation
        }
      }
      // Generate if not present or key mismatched
      const generated = getWorkoutForUser(
        profile.objective, 
        profile.location, 
        profile.daysPerWeek,
        profile.workoutDurationCategory || 'moderado',
        profile.experienceLevel || 'intermediario'
      );
      setUserWorkouts(generated);
      localStorage.setItem('personalpessoal_custom_workouts_v3', JSON.stringify({
        profileKey: currentProfileKey,
        workouts: generated
      }));
    } else {
      setUserWorkouts([]);
    }
  }, [
    profile?.objective, 
    profile?.location, 
    profile?.daysPerWeek, 
    profile?.workoutDurationCategory, 
    profile?.experienceLevel
  ]);

  // Water log states
  const [waterDrunk, setWaterDrunk] = useState<number>(() => {
    const saved = localStorage.getItem('gymdemocra_water');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Food Replacements filtering
  const [selectedReplacementCategory, setSelectedReplacementCategory] = useState<'todas' | 'proteina' | 'carbo' | 'gordura'>('todas');
  const [searchFood, setSearchFood] = useState<string>('');

  // Nutrition Sub-Tab & AI Chat States
  const [alimentacaoSubTab, setAlimentacaoSubTab] = useState<'lista' | 'chat'>('lista');
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'user' | 'assistant'; text: string; timestamp: string }>>(() => {
    const saved = localStorage.getItem('gymdemocra_nutrition_chat');
    return saved ? JSON.parse(saved) : [
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Olá! Sou o **NutriAI**, seu nutricionista de bolso especialista em dieta barata. Pode me perguntar sobre a quantidade de calorias de um alimento, sugestões de substituições baratas (como trocar patinho ou frango), ou ideias de refeição para seu objetivo! 🥦🍗',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Save chat to localStorage
  useEffect(() => {
    localStorage.setItem('gymdemocra_nutrition_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading]);

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const messageText = chatInput.trim();
    if (!messageText || isChatLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: messageText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Keep only the last 6 messages as history to prevent exceeding token limit in the simulator API
      const historyToSend = chatMessages.slice(-6);

      const response = await fetch('/api/nutrition/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          history: historyToSend
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Erro ao obter resposta do assistente.');
      }

      const data = await response.json();
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant' as const,
        text: data.text,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant' as const,
        text: `⚠️ **Ops!** Ocorreu um erro ao falar com o NutriAI: ${err.message || 'Sem conexão com o servidor'}. Verifique se a sua chave da API do Gemini está adicionada corretamente nas configurações do projeto.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChatHistory = () => {
    const defaultWelcome = {
      id: 'welcome',
      sender: 'assistant' as const,
      text: 'Olá! Sou o **NutriAI**, seu nutricionista de bolso especialista em dieta barata. Pode me perguntar sobre a quantidade de calorias de um alimento, sugestões de substituições baratas (como trocar patinho ou frango), ou ideias de refeição para seu objetivo! 🥦🍗',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([defaultWelcome]);
  };

  const renderLineContent = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(<strong key={`b-li-${match.index}`} className="font-bold text-white">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  const renderMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let cleanLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`b-${match.index}`} className="font-bold text-white">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < cleanLine.length) {
        parts.push(cleanLine.substring(lastIndex));
      }

      const renderedText = parts.length > 0 ? parts : cleanLine;

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const content = line.trim().substring(2);
        return (
          <li key={idx} className="list-disc list-inside text-zinc-300 ml-2 mb-1">
            {renderLineContent(content)}
          </li>
        );
      }
      return (
        <p key={idx} className="mb-1 text-zinc-300 min-h-[1em] leading-relaxed">
          {renderedText}
        </p>
      );
    });
  };

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timerMax, setTimerMax] = useState<number>(60);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerCompleted, setTimerCompleted] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Context for buzzer (using Web Audio API to prevent heavy external files)
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // Frequency in hertz
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3); // Play for 0.3 seconds
    } catch (e) {
      console.log('Audio contextual beep failed', e);
    }
  };

  // Timer effect
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            setTimerActive(false);
            setTimerCompleted(true);
            playBeep();
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive]);

  const startTimer = (seconds: number) => {
    setTimerMax(seconds);
    setTimerSeconds(seconds);
    setTimerActive(true);
    setTimerCompleted(false);
  };

  // Onboarding completion
  const handleCompleteOnboarding = () => {
    const newProfile: UserProfile = {
      objective,
      location,
      daysPerWeek: days,
      weight,
      height,
      desiredWeight,
      experienceLevel,
      workoutDurationCategory,
      allowedMachines,
      healthLimitations,
      waterDrunk: 0,
      gender
    };
    setProfile(newProfile);
    localStorage.setItem('gymdemocra_profile', JSON.stringify(newProfile));
    setWaterDrunk(0);
    localStorage.setItem('gymdemocra_water', '0');
    setActiveTab('treino');
    setSelectedDayIdx(0);
    setCheckedExercises({});
  };

  const handleResetProfile = () => {
    setConfirmAction('reset_profile');
  };

  const handleGoogleLogout = () => {
    setConfirmAction('logout');
  };

  const executeResetProfile = () => {
    setProfile(null);
    setOnboardingStep(1);
    setSelectedDayIdx(0);
    setCheckedExercises({});
    localStorage.removeItem('gymdemocra_profile');
    localStorage.removeItem('gymdemocra_water');
    setConfirmAction(null);
  };

  const executeGoogleLogout = () => {
    setGoogleUser(null);
    setProfile(null);
    setSelectedDayIdx(0);
    setCheckedExercises({});
    localStorage.removeItem('gymdemocra_google_user');
    localStorage.removeItem('gymdemocra_profile');
    localStorage.removeItem('gymdemocra_water');
    setConfirmAction(null);
  };

  const handleSelectGoogleAccount = (email: string, name: string) => {
    setShowGoogleSelectModal(false);
    setIsLoggingIn(true);
    
    // Simular o delay de requisição de validação de token do Supabase Auth
    setTimeout(() => {
      const mockUser: GoogleUser = {
        id: Math.random().toString(36).substring(2, 11).toUpperCase(),
        email: email,
        name: name,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      };
      setGoogleUser(mockUser);
      localStorage.setItem('gymdemocra_google_user', JSON.stringify(mockUser));
      setIsLoggingIn(false);
    }, 1200);
  };

  const addWater = (amount: number) => {
    const updated = Math.min(waterDrunk + amount, 6000);
    setWaterDrunk(updated);
    localStorage.setItem('gymdemocra_water', updated.toString());
  };

  const resetWater = () => {
    setWaterDrunk(0);
    localStorage.setItem('gymdemocra_water', '0');
  };

  const toggleExerciseCheck = (id: string) => {
    if (activeWorkout) {
      const status = getDayStatus(activeWorkout.dayName);
      if (status !== 'hoje') return;
    }
    setCheckedExercises(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReplaceWithRandomAlternative = (dayIdx: number, exerciseId: string) => {
    if (!profile) return;
    const targetWorkout = userWorkouts[dayIdx];
    if (targetWorkout) {
      const status = getDayStatus(targetWorkout.dayName);
      if (status !== 'hoje') return;
    }
    const currentProfileKey = `${profile.objective}_${profile.location}_${profile.daysPerWeek}`;
    
    setUserWorkouts(prevWorkouts => {
      const updatedWorkouts = prevWorkouts.map((dayWorkout, dIdx) => {
        if (dIdx !== dayIdx) return dayWorkout;
        
        const exercises = dayWorkout.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          
          const alternatives = getAlternativesForExercise(ex, profile.location, profile.objective);
          if (alternatives.length === 0) return ex;
          
          const randomIdx = Math.floor(Math.random() * alternatives.length);
          return alternatives[randomIdx];
        });
        
        return { ...dayWorkout, exercises };
      });
      
      localStorage.setItem('gymdemocra_custom_workouts_v2', JSON.stringify({
        profileKey: currentProfileKey,
        workouts: updatedWorkouts
      }));
      return updatedWorkouts;
    });
  };

  const handleManualSubstituteExercise = (dayIdx: number, exerciseId: string, substitute: Exercise) => {
    if (!profile) return;
    const targetWorkout = userWorkouts[dayIdx];
    if (targetWorkout) {
      const status = getDayStatus(targetWorkout.dayName);
      if (status !== 'hoje') return;
    }
    const currentProfileKey = `${profile.objective}_${profile.location}_${profile.daysPerWeek}`;
    
    setUserWorkouts(prevWorkouts => {
      const updatedWorkouts = prevWorkouts.map((dayWorkout, dIdx) => {
        if (dIdx !== dayIdx) return dayWorkout;
        
        const exercises = dayWorkout.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          return substitute;
        });
        
        return { ...dayWorkout, exercises };
      });
      
      localStorage.setItem('gymdemocra_custom_workouts_v2', JSON.stringify({
        profileKey: currentProfileKey,
        workouts: updatedWorkouts
      }));
      return updatedWorkouts;
    });
  };

  const handleStartEdit = (ex: Exercise) => {
    if (activeWorkout) {
      const status = getDayStatus(activeWorkout.dayName);
      if (status !== 'hoje') return; // Do not edit if not today
    }
    setEditingExerciseId(ex.id);
    setEditName(ex.name);
    setEditSeries(ex.series);
    setEditRest(ex.rest);
  };

  const handleSaveEdit = (dayIdx: number, exerciseId: string) => {
    if (!profile) return;
    const targetWorkout = userWorkouts[dayIdx];
    if (targetWorkout) {
      const status = getDayStatus(targetWorkout.dayName);
      if (status !== 'hoje') return;
    }
    const currentProfileKey = `${profile.objective}_${profile.location}_${profile.daysPerWeek}`;
    
    setUserWorkouts(prevWorkouts => {
      const updatedWorkouts = prevWorkouts.map((dayWorkout, dIdx) => {
        if (dIdx !== dayIdx) return dayWorkout;
        
        const exercises = dayWorkout.exercises.map(ex => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            name: editName,
            series: editSeries,
            rest: editRest
          };
        });
        
        return { ...dayWorkout, exercises };
      });
      
      localStorage.setItem('gymdemocra_custom_workouts_v2', JSON.stringify({
        profileKey: currentProfileKey,
        workouts: updatedWorkouts
      }));
      return updatedWorkouts;
    });
    setEditingExerciseId(null);
  };

  const activeWorkout = userWorkouts[selectedDayIdx] || userWorkouts[0] || null;

  // Nutritional limits
  const waterTarget = profile ? profile.weight * 35 : 2500;
  const proteinTarget = profile ? profile.weight * 2.0 : 150;

  // Filter food replacements
  const filteredReplacements = foodReplacements.filter(food => {
    const matchCat = selectedReplacementCategory === 'todas' || food.category === selectedReplacementCategory;
    const matchSearch =
      food.original.toLowerCase().includes(searchFood.toLowerCase()) ||
      food.substitute.toLowerCase().includes(searchFood.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col items-center justify-center p-2 lg:p-6 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl h-full select-none">
      {/* Dynamic Smartphone Frame */}
      <div className="relative w-full max-w-[370px] h-[720px] bg-zinc-950 rounded-[48px] p-3.5 border-[6px] border-zinc-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
        {/* Smartphone Camera Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-zinc-900 rounded-full mb-1"></div>
          <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full ml-2 absolute right-8"></div>
        </div>

        {/* Smartphone Screen Canvas */}
        <div className={`flex-1 ${isDark ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-900'} rounded-[38px] overflow-hidden flex flex-col relative pt-5 pb-2 transition-colors duration-200`}>
          {/* Mock Status Bar */}
          <div className={`px-5 py-1.5 flex justify-between items-center text-[11px] font-medium font-sans ${isDark ? 'text-zinc-400 bg-zinc-950/20' : 'text-zinc-600 bg-zinc-200/40'} z-10 transition-colors`}>
            <span>09:41</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] bg-orange-600/30 text-orange-400 px-1.5 py-0.5 rounded font-bold font-mono">5G</span>
              <Droplet size={10} className="text-orange-500 fill-orange-500" />
              <div className={`w-5 h-2.5 border ${isDark ? 'border-zinc-500' : 'border-zinc-400'} rounded-sm p-0.5 flex items-center`}>
                <div className={`h-full w-4 ${isDark ? 'bg-zinc-300' : 'bg-zinc-700'} rounded-2xs`}></div>
              </div>
            </div>
          </div>

          {/* Core Simulator Screen Content */}
          <div className={`flex-1 overflow-y-auto px-4 py-2 flex flex-col ${isDark ? 'scrollbar-thin scrollbar-thumb-zinc-800' : 'scrollbar-thin scrollbar-thumb-zinc-300'}`}>
            <AnimatePresence mode="wait">
              {!googleUser ? (
                /* ================= GOOGLE LOGIN FLOW ================= */
                <motion.div
                  key="login"
                  variants={screenVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex-1 flex flex-col justify-between py-4"
                >
                <div className="space-y-4 my-auto">
                  <div className="text-center pt-2">
                    <div className="inline-flex bg-orange-600/20 p-2.5 rounded-2xl border border-orange-500/30 text-orange-500 mb-2 animate-pulse">
                      <Dumbbell size={28} />
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-white font-sans uppercase">
                      Gym<span className="text-orange-500">Democra</span>
                    </h1>
                    <p className="text-[11px] text-zinc-400 mt-0.5 font-sans leading-relaxed px-4">
                      Treino e dicas de alimentação para todos, sem o custo de um personal trainer.
                    </p>
                  </div>

                  <div className="space-y-2.5 px-1">
                    <div className="p-3 bg-zinc-950/40 border border-zinc-850 rounded-xl">
                      <h4 className="text-[9px] font-bold text-orange-400 uppercase tracking-wider mb-0.5">Democratização de Treinos</h4>
                      <p className="text-[9px] text-zinc-400 leading-normal">
                        Fichas de exercícios focadas no seu objetivo, fáceis de usar no dia a dia da academia ou em casa.
                      </p>
                    </div>

                    <div className="p-3 bg-zinc-950/40 border border-zinc-850 rounded-xl">
                      <h4 className="text-[9px] font-bold text-green-400 uppercase tracking-wider mb-0.5">Tecnologia Supabase + Google</h4>
                      <p className="text-[9px] text-zinc-400 leading-normal">
                        Acesso seguro e simplificado utilizando Google Sign-In nativo e salvando seus dados na nuvem via Supabase.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4">
                  <button
                    onClick={() => setShowGoogleSelectModal(true)}
                    className="w-full py-2.5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl font-bold font-sans text-[11px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Fazer Login com Google
                  </button>
                  <p className="text-[8px] text-zinc-500 text-center px-4 leading-normal">
                    *Esta é uma simulação do fluxo de login em iFrame. No app real, abre-se o Google Sign-In nativo do Android/iOS.
                  </p>
                </div>
              </motion.div>
            ) : !profile ? (
              /* ================= ONBOARDING WIZARD FLOW ================= */
              <motion.div
                key="onboarding"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-1 flex flex-col justify-between py-2"
              >
                <div className="space-y-3.5">
                  {/* Step Progress Header */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-widest font-sans">
                          Ficha de Atleta
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">
                          • Passo {onboardingStep} de 5
                        </span>
                      </div>
                      {onboardingStep > 1 && (
                        <button
                          onClick={() => setOnboardingStep(s => s - 1)}
                          className="text-[9px] text-zinc-400 hover:text-zinc-200 flex items-center gap-0.5 font-sans"
                        >
                          <ChevronLeft size={10} /> Voltar
                        </button>
                      )}
                    </div>
                    {/* Horizontal Progress bar */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 4, 5].map(step => (
                        <div
                          key={step}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            step <= onboardingStep ? 'bg-orange-500' : 'bg-zinc-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Questionnaire Content Steps */}
                  <div className="space-y-3 min-h-[380px] flex flex-col justify-center">
                    
                    {/* STEP 1: FREQUENCY & DURATION */}
                    {onboardingStep === 1 && (
                      <div className="space-y-3.5 animate-in fade-in duration-200">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                            1. Quantas vezes pretende treinar por semana?
                          </label>
                          <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-850 mt-1">
                            <button
                              type="button"
                              onClick={() => setDays(d => Math.max(1, d - 1))}
                              className="w-9 h-9 bg-zinc-800 hover:bg-zinc-750 text-white rounded-lg flex items-center justify-center font-bold text-base active:scale-90 transition-all cursor-pointer"
                            >
                              -
                            </button>
                            <div className="text-center">
                              <span className="text-3xl font-black font-mono text-orange-500">{days}</span>
                              <span className="text-[9px] text-zinc-400 block font-sans uppercase font-bold tracking-wider">treinos / semana</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setDays(d => Math.min(7, d + 1))}
                              className="w-9 h-9 bg-zinc-800 hover:bg-zinc-750 text-white rounded-lg flex items-center justify-center font-bold text-base active:scale-90 transition-all cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-[9px] text-zinc-500 mt-1.5 leading-snug">
                            {days <= 2 ? '⚡ Rotina condensada focada em treinos integrados (Full-body).' :
                             days <= 4 ? '🔥 Frequência ideal para excelente recuperação e constância.' :
                             days <= 6 ? '🏆 Divisão avançada de alta performance e grupos musculares isolados.' :
                             '👑 Consistência absoluta! Foco em periodização para evitar overtraining.'}
                          </p>
                        </div>

                        <div className="border-t border-zinc-850 pt-3">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                            6. Tempo/Duração Disponível por Treino
                          </label>
                          <div className="space-y-1.5">
                            {[
                              { id: 'rapido', label: 'Treino Rápido (1)', desc: '2 a 3 exercícios eficientes • Ideal para correria' },
                              { id: 'moderado', label: 'Treino Moderado (2)', desc: '4 a 6 exercícios • Volume padrão recomendado' },
                              { id: 'completo', label: 'Treino Completo (3)', desc: '6 ou mais exercícios • Maior isolamento muscular' },
                            ].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setWorkoutDurationCategory(opt.id as any)}
                                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                                  workoutDurationCategory === opt.id
                                    ? 'bg-orange-600/10 border-orange-500 text-white'
                                    : 'bg-zinc-800/50 text-zinc-450 border-zinc-700/60 hover:bg-zinc-850'
                                }`}
                              >
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  workoutDurationCategory === opt.id ? 'border-orange-500 text-orange-500' : 'border-zinc-600'
                                }`}>
                                  {workoutDurationCategory === opt.id && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold leading-none">{opt.label}</p>
                                  <p className="text-[8px] text-zinc-500 mt-0.5">{opt.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: OBJECTIVE & PRACTICE LEVEL */}
                    {onboardingStep === 2 && (
                      <div className="space-y-3.5 animate-in fade-in duration-200">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                            2. Qual o seu Objetivo Principal?
                          </label>
                          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-zinc-800">
                            {[
                              { id: 'ganhar_massa', label: 'Ganho de Massa Muscular (Hipertrofia)', desc: 'Foco em volume muscular, força e dieta limpa', icon: <Award size={12} /> },
                              { id: 'emagrecer', label: 'Emagrecimento Saudável (Foco Queima)', desc: 'Treino voltado ao déficit calórico e queima de gordura', icon: <Flame size={12} /> },
                              { id: 'ganhar_forca', label: 'Ganho de Força e Cargas', desc: 'Foco em força neuromuscular e repetições mais baixas', icon: <Dumbbell size={12} /> },
                              { id: 'definicao', label: 'Definição e Densidade Muscular', desc: 'Foco em tônus, resistência e redução leve de gordura', icon: <Activity size={12} /> },
                              { id: 'saude_longevidade', label: 'Saúde e Longevidade', desc: 'Postura, mobilidade e fortalecimento preventivo', icon: <Heart size={12} /> },
                            ].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setObjective(opt.id as any)}
                                className={`w-full p-2 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                                  objective === opt.id
                                    ? 'bg-orange-600/10 border-orange-500 text-white'
                                    : 'bg-zinc-800/50 text-zinc-450 border-zinc-700/60 hover:bg-zinc-850'
                                }`}
                              >
                                <div className={`p-1 rounded-lg border ${objective === opt.id ? 'bg-orange-600/20 border-orange-500 text-orange-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}>
                                  {opt.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold leading-none">{opt.label}</p>
                                  <p className="text-[8px] text-zinc-500 mt-0.5 truncate">{opt.desc}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-zinc-850 pt-3">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                            8. Nível de Tempo na Academia (Experiência)
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { id: 'iniciante', label: 'Iniciante', time: 'Menos de 1 ano' },
                              { id: 'intermediario', label: 'Interm.', time: '1 a 2 anos' },
                              { id: 'avancado', label: 'Avançado', time: 'Mais de 2 anos' },
                            ].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setExperienceLevel(opt.id as any)}
                                className={`p-2 rounded-xl border text-center transition-all flex flex-col justify-center gap-0.5 cursor-pointer ${
                                  experienceLevel === opt.id
                                    ? 'bg-orange-600 border-orange-500 text-white font-bold'
                                    : 'bg-zinc-800/50 text-zinc-450 border-zinc-700/60 hover:bg-zinc-850'
                                }`}
                              >
                                <span className="text-[10px] font-bold leading-tight">{opt.label}</span>
                                <span className="text-[7.5px] text-zinc-500 font-mono leading-none">{opt.time}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: ENVIRONMENT & EQUIPMENT LIST */}
                    {onboardingStep === 3 && (
                      <div className="space-y-3.5 animate-in fade-in duration-200">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                            3. Tipo de Academia que Frequenta
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {[
                              { id: 'academia_pequena', label: 'Academia Pequena', place: 'De bairro / Sem filas' },
                              { id: 'academia_media', label: 'Academia Média', place: 'Boa variedade básica' },
                              { id: 'academia_franquia', label: 'Franquia / Redes', place: 'SmartFit, BlueFit, etc' },
                              { id: 'casa_calistenia', label: 'Em Casa / Calistenia', place: 'Peso corporal / Elásticos' },
                            ].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setLocation(opt.id as any)}
                                className={`p-2 rounded-xl border text-left transition-all flex flex-col gap-0.5 cursor-pointer ${
                                  location === opt.id
                                    ? 'bg-orange-600 border-orange-500 text-white font-bold'
                                    : 'bg-zinc-800/50 text-zinc-450 border-zinc-700/60 hover:bg-zinc-850'
                                }`}
                              >
                                <span className="text-[10px] font-bold leading-tight">{opt.label}</span>
                                <span className="text-[7.5px] text-zinc-500 leading-none">{opt.place}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-zinc-850 pt-3">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                            4. Quais Máquinas e Pesos Pode Usar?
                          </label>
                          <p className="text-[8px] text-zinc-500 mb-1.5 leading-none">Selecione todos os tipos que tem acesso:</p>
                          <div className="grid grid-cols-2 gap-1.5 max-h-[170px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-zinc-800">
                            {EQUIPMENT_OPTIONS.map(opt => {
                              const isSelected = allowedMachines.includes(opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setAllowedMachines(prev => prev.filter(x => x !== opt.id));
                                    } else {
                                      setAllowedMachines(prev => [...prev, opt.id]);
                                    }
                                  }}
                                  className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-zinc-800 border-orange-500 text-white font-bold'
                                      : 'bg-zinc-900/60 border-zinc-850 text-zinc-500 hover:border-zinc-700'
                                  }`}
                                >
                                  <span className="text-xs">{opt.icon}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-bold truncate leading-none text-zinc-250">{opt.name}</p>
                                    <p className="text-[7px] text-zinc-500 truncate mt-0.5 leading-none font-mono">{opt.type}</p>
                                  </div>
                                  <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                                    isSelected ? 'bg-orange-500 border-orange-400 text-zinc-950' : 'border-zinc-700'
                                  }`}>
                                    {isSelected && <Check size={8} strokeWidth={4} className="text-white" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: HEALTH CONDITIONS / LIMITATIONS */}
                    {onboardingStep === 4 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                            5. Algum Problema de Saúde ou Deficiência Física?
                          </label>
                          <p className="text-[8px] text-zinc-500 mb-1.5 leading-snug">
                            O app sinalizará avisos específicos de segurança nos seus exercícios.
                          </p>
                          <div className="space-y-1.5">
                            {HEALTH_LIMITATIONS_OPTIONS.map(opt => {
                              const isSelected = healthLimitations.includes(opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    if (opt.id === 'nenhuma') {
                                      setHealthLimitations(['nenhuma']);
                                    } else {
                                      setHealthLimitations(prev => {
                                        const filtered = prev.filter(x => x !== 'nenhuma');
                                        if (filtered.includes(opt.id)) {
                                          const next = filtered.filter(x => x !== opt.id);
                                          return next.length === 0 ? ['nenhuma'] : next;
                                        } else {
                                          return [...filtered, opt.id];
                                        }
                                      });
                                    }
                                  }}
                                  className={`w-full p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-zinc-800 border-orange-500 text-white font-bold'
                                      : 'bg-zinc-900/60 text-zinc-450 border-zinc-850 hover:border-zinc-800'
                                  }`}
                                >
                                  <span className="text-xs">{opt.icon}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold leading-none text-zinc-200">{opt.name}</p>
                                    <p className="text-[8px] text-zinc-500 mt-0.5 leading-tight font-sans">{opt.desc}</p>
                                  </div>
                                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                    isSelected ? 'bg-orange-500 border-orange-400 text-zinc-950' : 'border-zinc-700'
                                  }`}>
                                    {isSelected && <Check size={8} strokeWidth={4} className="text-white" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="bg-orange-950/20 p-2.5 border border-orange-900/40 rounded-xl mt-2">
                          <p className="text-[7.5px] text-orange-400 leading-normal font-sans">
                            *IMPORTANTE: Os treinos gerados servem como sugestão educacional adaptada. Consulte sempre seu médico ou profissional de educação física antes de iniciar cargas de alta resistência.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* STEP 5: ANTROPOMETRY, DYNAMIC IMC & ESTIMATE TIME */}
                    {onboardingStep === 5 && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                            7. Medir IMC, Peso Desejado & Previsão de Tempo
                          </label>
                          
                          <div className="space-y-3.5 bg-zinc-950/70 p-3 rounded-2xl border border-zinc-850">
                            {/* Sexo Biológico */}
                            <div className="pb-1.5 border-b border-zinc-900/60">
                              <span className="text-[9px] font-bold text-zinc-400 font-mono block mb-1.5 uppercase">Sexo Biológico</span>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setGender('masculino')}
                                  className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold font-sans flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                    gender === 'masculino'
                                      ? 'bg-orange-500/15 border-orange-500 text-orange-400'
                                      : 'bg-zinc-900 border-zinc-800 text-zinc-450 hover:text-white'
                                  }`}
                                >
                                  👨 Masculino
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setGender('feminino')}
                                  className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold font-sans flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                    gender === 'feminino'
                                      ? 'bg-orange-500/15 border-orange-500 text-orange-400'
                                      : 'bg-zinc-900 border-zinc-800 text-zinc-450 hover:text-white'
                                  }`}
                                >
                                  👩 Feminino
                                </button>
                              </div>
                            </div>

                            {/* Altura */}
                            <div>
                              <div className="flex justify-between text-[10px] font-mono leading-none mb-1">
                                <span className="text-zinc-400 font-bold">Sua Altura</span>
                                <span className="text-orange-500 font-bold">{height} cm</span>
                              </div>
                              <input
                                type="range"
                                min="130"
                                max="220"
                                value={height}
                                onChange={e => setHeight(parseInt(e.target.value, 10))}
                                className="w-full accent-orange-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            {/* Peso Atual */}
                            <div>
                              <div className="flex justify-between text-[10px] font-mono leading-none mb-1">
                                <span className="text-zinc-400 font-bold">Peso Atual</span>
                                <span className="text-orange-500 font-bold">{weight} kg</span>
                              </div>
                              <input
                                type="range"
                                min="40"
                                max="150"
                                value={weight}
                                onChange={e => setWeight(parseInt(e.target.value, 10))}
                                className="w-full accent-orange-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            {/* Peso Desejado */}
                            <div>
                              <div className="flex justify-between text-[10px] font-mono leading-none mb-1">
                                <span className="text-zinc-400 font-bold">Peso Desejado</span>
                                <span className="text-green-400 font-bold">{desiredWeight} kg</span>
                              </div>
                              <input
                                type="range"
                                min="40"
                                max="150"
                                value={desiredWeight}
                                onChange={e => setDesiredWeight(parseInt(e.target.value, 10))}
                                className="w-full accent-green-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Dynamic IMC & Previsão Calculation Rendering */}
                          {(() => {
                            const hM = height / 100;
                            const imc = weight / (hM * hM);
                            let classification = '';
                            let colorClass = '';
                            if (imc < 18.5) {
                              classification = 'Abaixo do peso';
                              colorClass = 'text-blue-400 bg-blue-950/40 border border-blue-900/30';
                            } else if (imc < 25) {
                              classification = 'Peso saudável';
                              colorClass = 'text-green-400 bg-green-950/40 border border-green-900/30';
                            } else if (imc < 30) {
                              classification = 'Sobrepeso (Atenção)';
                              colorClass = 'text-yellow-400 bg-yellow-950/40 border border-yellow-900/30';
                            } else {
                              classification = 'Obesidade (Cuidado)';
                              colorClass = 'text-red-400 bg-red-950/40 border border-red-900/30';
                            }

                            const diff = weight - desiredWeight;
                            let timeText = '';
                            if (Math.abs(diff) < 0.5) {
                              timeText = 'Você já está na sua meta de peso ideal! Foque em definição muscular e reeducação alimentar.';
                            } else if (diff > 0) {
                              const weeks = Math.ceil(diff / 0.7);
                              const months = Math.round(weeks / 4.3);
                              timeText = `Perda de peso saudável recomendada: Aproximadamente ${weeks} semanas (~${months > 0 ? months : 1} meses) de dieta hipocalórica e musculação consistente.`;
                            } else {
                              const weeks = Math.ceil(Math.abs(diff) / 0.25);
                              const months = Math.round(weeks / 4.3);
                              timeText = `Ganho de massa magra/músculo limpo: Cerca de ${weeks} semanas (~${months > 0 ? months : 1} meses) de superávit calórico controlado.`;
                            }

                            return (
                              <div className="mt-2.5 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] text-zinc-400 font-bold uppercase font-sans">Seu IMC Atual:</span>
                                  <div className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${colorClass}`}>
                                    {imc.toFixed(1)} • {classification}
                                  </div>
                                </div>
                                <div className="p-2 bg-orange-600/10 border border-orange-500/20 rounded-xl">
                                  <h5 className="text-[8px] font-extrabold text-orange-400 uppercase tracking-wider">Estimativa de Tempo de Meta</h5>
                                  <p className="text-[8px] text-zinc-300 leading-relaxed mt-0.5 font-sans">
                                    {timeText}
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Confirm step navigation */}
                <div className="pt-2 border-t border-zinc-850 flex gap-2">
                  {onboardingStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(s => s - 1)}
                      className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl font-bold font-sans text-xs transition-all flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft size={13} />
                    </button>
                  )}
                  
                  {onboardingStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => setOnboardingStep(s => s + 1)}
                      className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold font-sans text-[11px] flex items-center justify-center gap-1 transition-all active:scale-98 cursor-pointer"
                    >
                      Avançar Etapa
                      <ChevronRight size={13} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCompleteOnboarding}
                      className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold font-sans text-[11px] flex items-center justify-center gap-1.5 shadow-lg shadow-green-950/20 transition-all active:scale-98 cursor-pointer animate-pulse"
                    >
                      <Check size={13} strokeWidth={3} />
                      Gerar Ficha Completa!
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              /* ================= ACTIVE WORKOUT APPLICATION ================= */
              <motion.div
                key="app"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-1 flex flex-col justify-between"
              >
                <div className="flex-1 flex flex-col min-h-0">
                  <AnimatePresence mode="wait">
                    {/* 1. TREINO TAB VIEW */}
                    {activeTab === 'treino' && (
                      <motion.div
                        key="treino"
                        variants={tabVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-4 flex-1 flex flex-col min-h-0"
                      >
                    {/* Header Workout Context */}
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                      <div>
                        <span className="text-[10px] font-mono font-bold bg-zinc-800 px-2 py-0.5 rounded text-orange-400 border border-zinc-700 uppercase tracking-wider">
                          {profile.location === 'academia' ? 'Academia' : 'Em Casa'}
                        </span>
                        <h2 className="text-sm font-bold text-zinc-100 font-sans mt-1">
                          {profile.objective === 'ganhar_massa'
                            ? 'Foco Massa Muscular'
                            : profile.objective === 'emagrecer'
                            ? 'Foco Emagrecimento'
                            : 'Foco Condicionamento'}
                        </h2>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-zinc-500 block">PROTEÍNA RECOMENDADA</span>
                        <span className="text-xs font-mono font-bold text-orange-500">{proteinTarget}g / dia</span>
                      </div>
                    </div>

                    {/* Simulated Today Selector Widget */}
                    <div className="bg-zinc-950/90 border border-zinc-850 rounded-xl p-2.5 flex items-center justify-between gap-2.5 shadow-inner">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Clock size={10} className="text-zinc-500" /> Simulando Hoje:
                        </span>
                      </div>
                      <select
                        value={simulatedDay}
                        onChange={(e) => setSimulatedDay(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg text-[10px] font-bold font-sans text-orange-400 px-2.5 py-1 cursor-pointer focus:outline-none"
                      >
                        <option value="Segunda-feira">📅 Segunda-feira</option>
                        <option value="Terça-feira">📅 Terça-feira</option>
                        <option value="Quarta-feira">📅 Quarta-feira</option>
                        <option value="Quinta-feira">📅 Quinta-feira</option>
                        <option value="Sexta-feira">📅 Sexta-feira</option>
                        <option value="Sábado">📅 Sábado</option>
                        <option value="Domingo">📅 Domingo</option>
                      </select>
                    </div>

                    {/* Day selector tabs */}
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {userWorkouts.map((workout, idx) => {
                        const cleanDayName = workout.dayName.split('-')[0].trim();
                        const status = getDayStatus(workout.dayName);
                        
                        let statusEmoji = '';
                        if (status === 'passado') statusEmoji = ' ✅';
                        else if (status === 'hoje') statusEmoji = ' 🔥';
                        else if (status === 'futuro') statusEmoji = ' ⏳';

                        const isSelected = selectedDayIdx === idx;

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedDayIdx(idx);
                              setTimerActive(false);
                            }}
                            className={`py-1.5 px-3 rounded-lg text-xs font-bold font-sans whitespace-nowrap transition-all flex items-center gap-1 ${
                              isSelected
                                ? 'bg-orange-600 text-white'
                                : status === 'passado'
                                ? 'bg-zinc-900/60 border border-zinc-850 text-emerald-500 hover:bg-zinc-850'
                                : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-850'
                            }`}
                          >
                            {cleanDayName}{statusEmoji}
                          </button>
                        );
                      })}
                    </div>

                    {/* Rest Countdown Timer Card */}
                    <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 relative overflow-hidden flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                          Cronômetro de Descanso
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black font-mono tracking-widest text-accent transition-colors duration-500">
                            {timerSeconds}s
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500">/ {timerMax}s</span>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => setTimerActive(!timerActive)}
                          className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                            timerActive
                              ? 'bg-red-950/40 text-red-400 border-red-900/60'
                              : 'bg-green-950/40 text-green-400 border-green-900/60'
                          }`}
                        >
                          {timerActive ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                        </button>
                        <button
                          onClick={() => {
                            setTimerActive(false);
                            setTimerSeconds(timerMax);
                            setTimerCompleted(false);
                          }}
                          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700 rounded-xl"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>

                      {timerCompleted && (
                        <div className="absolute inset-0 bg-green-950/90 border border-green-500/30 flex items-center justify-center gap-2 animate-pulse">
                          <Check className="text-green-400" size={16} />
                          <span className="text-xs font-bold text-green-400 font-sans tracking-wide">
                            FIM DO DESCANSO! VAI!
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Active exercises list */}
                    {activeWorkout ? (
                      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px] pr-0.5">
                        
                        {/* Day Status Banner */}
                        {(() => {
                          const status = getDayStatus(activeWorkout.dayName);
                          if (status === 'passado') {
                            return (
                              <div className="bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-xl flex items-center gap-2">
                                <Check size={14} className="text-emerald-400 shrink-0" />
                                <div>
                                  <span className="text-[9px] font-extrabold uppercase text-emerald-400 tracking-wide block">
                                    Histórico Concluído (Bloqueado)
                                  </span>
                                  <span className="text-[8px] text-zinc-400 font-sans block mt-0.5">
                                    Este treino já passou. Os dados de progresso estão salvos e não podem ser alterados.
                                  </span>
                                </div>
                              </div>
                            );
                          } else if (status === 'futuro') {
                            return (
                              <div className="bg-zinc-900/40 border border-zinc-800/80 p-2.5 rounded-xl flex items-center gap-2">
                                <Clock size={14} className="text-orange-400 shrink-0" />
                                <div>
                                  <span className="text-[9px] font-extrabold uppercase text-orange-400 tracking-wide block">
                                    Treino Agendado (Bloqueado)
                                  </span>
                                  <span className="text-[8px] text-zinc-400 font-sans block mt-0.5">
                                    Aguardando a {activeWorkout.dayName.split(' - ')[0]}. Não é permitido iniciar este treino antecipadamente.
                                  </span>
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div className="bg-orange-950/20 border border-orange-900/30 p-2.5 rounded-xl flex items-center gap-2">
                                <Activity size={14} className="text-orange-500 shrink-0 animate-pulse" />
                                <div>
                                  <span className="text-[9px] font-extrabold uppercase text-orange-400 tracking-wide block">
                                    Treino de Hoje (Liberado)
                                  </span>
                                  <span className="text-[8px] text-zinc-350 font-sans block mt-0.5">
                                    Seu treino do dia está ativo! Complete as séries e registre seu progresso.
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        })()}

                        {/* Health Limitation Warning Banner */}
                        {profile.healthLimitations && profile.healthLimitations.length > 0 && !profile.healthLimitations.includes('nenhuma') && (
                          <div className="bg-red-950/30 border border-red-900/40 p-2.5 rounded-xl space-y-1 animate-pulse">
                            <div className="flex items-center gap-1.5 text-red-400">
                              <AlertTriangle size={12} />
                              <span className="text-[9px] font-extrabold uppercase tracking-wide">Atenção Médica / Postura</span>
                            </div>
                            <div className="space-y-1">
                              {profile.healthLimitations.map(limitId => {
                                const option = HEALTH_LIMITATIONS_OPTIONS.find(o => o.id === limitId);
                                if (!option) return null;
                                return (
                                  <p key={limitId} className="text-[8px] text-zinc-300 leading-normal">
                                    • <strong className="text-red-300">{option.name}:</strong> {option.warning}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Allowed Machines Quick Indicator */}
                        {profile.allowedMachines && profile.allowedMachines.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center bg-zinc-950/40 p-2 rounded-xl border border-zinc-850/60">
                            <span className="text-[8px] font-bold text-zinc-500 uppercase mr-1">Aparelhos Ativos:</span>
                            <div className="flex flex-wrap gap-1">
                              {profile.allowedMachines.map(machineId => {
                                const eq = EQUIPMENT_OPTIONS.find(o => o.id === machineId);
                                if (!eq) return null;
                                return (
                                  <span key={machineId} className="text-[8px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded font-sans flex items-center gap-1">
                                    <span>{eq.icon}</span>
                                    <span>{eq.name}</span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                          Grupo: {activeWorkout.muscleGroup}
                        </h3>

                        {activeWorkout.exercises.map((ex, idx) => {
                          const dayStatus = getDayStatus(activeWorkout.dayName);
                          const isChecked = dayStatus === 'passado' ? true : checkedExercises[ex.id];
                          const isExpanded = expandedExerciseId === ex.id;
                          const isEditing = editingExerciseId === ex.id;

                          if (isEditing) {
                            return (
                              <div
                                key={ex.id}
                                className="p-3 bg-zinc-900 border border-accent/40 rounded-2xl space-y-3 animate-in fade-in duration-150"
                              >
                                <div className="space-y-1">
                                  <span className="text-[8px] font-bold text-accent uppercase tracking-wider block font-sans">
                                    Editar Exercício
                                  </span>
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 text-xs px-2.5 py-1.5 rounded-lg text-white font-sans focus:outline-none focus:border-accent"
                                    placeholder="Nome do exercício"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block font-sans">
                                      Séries / Reps
                                    </span>
                                    <input
                                      type="text"
                                      value={editSeries}
                                      onChange={(e) => setEditSeries(e.target.value)}
                                      className="w-full bg-zinc-950 border border-zinc-800 text-[11px] px-2.5 py-1 rounded-lg text-white font-mono focus:outline-none focus:border-accent"
                                      placeholder="Ex: 4 x 10"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block font-sans">
                                      Descanso (s)
                                    </span>
                                    <input
                                      type="number"
                                      value={editRest}
                                      onChange={(e) => setEditRest(parseInt(e.target.value, 10) || 0)}
                                      className="w-full bg-zinc-950 border border-zinc-800 text-[11px] px-2.5 py-1 rounded-lg text-white font-mono focus:outline-none focus:border-accent"
                                      placeholder="Ex: 60"
                                    />
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-1">
                                  <button
                                    onClick={() => handleSaveEdit(selectedDayIdx, ex.id)}
                                    className="flex-1 py-1.5 bg-accent hover:bg-accent-hover text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer font-sans"
                                  >
                                    Salvar
                                  </button>
                                  <button
                                    onClick={() => setEditingExerciseId(null)}
                                    className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-[10px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer font-sans"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={ex.id}
                              className={`rounded-2xl border transition-all ${
                                isChecked
                                  ? 'bg-zinc-950/50 border-green-900/50 opacity-60'
                                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              {/* Main Card Header (Clickable to Expand Animation) */}
                              <div 
                                onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                                className="p-3 pb-2 flex items-start justify-between gap-2 cursor-pointer select-none"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className={`text-xs font-bold truncate ${isChecked ? 'line-through text-zinc-500' : 'text-white'}`}>
                                      {idx + 1}. {ex.name}
                                    </h4>
                                    <span className="flex-shrink-0 text-[8px] bg-accent/10 text-accent font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-accent/15">
                                      <Sparkles size={8} /> DEMO
                                    </span>
                                  </div>
                                  <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                                    {ex.series}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ChevronDown 
                                    size={14} 
                                    className={`text-zinc-500 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-accent' : ''}`} 
                                  />
                                  <button
                                    disabled={dayStatus !== 'hoje'}
                                    onClick={(e) => {
                                      e.stopPropagation(); // Don't trigger expand
                                      toggleExerciseCheck(ex.id);
                                    }}
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                      isChecked
                                        ? dayStatus === 'passado'
                                          ? 'bg-zinc-800/80 border-zinc-700 text-zinc-400 cursor-not-allowed'
                                          : 'bg-green-600 border-green-500 text-zinc-950 cursor-pointer'
                                        : dayStatus === 'futuro'
                                        ? 'border-zinc-800 bg-zinc-950/20 text-zinc-700 cursor-not-allowed'
                                        : 'border-zinc-700 hover:border-zinc-500 cursor-pointer'
                                    }`}
                                  >
                                    {isChecked && (
                                      dayStatus === 'passado' ? (
                                        <Check size={12} strokeWidth={3} className="text-emerald-500" />
                                      ) : (
                                        <Check size={12} strokeWidth={3} className="text-white" />
                                      )
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Collapsible Area */}
                              <div className="px-3 pb-3 space-y-2">
                                {/* Exercise description */}
                                <p className="text-[9px] text-zinc-400 font-sans leading-relaxed">
                                  {ex.description}
                                </p>

                                {/* Animated GIF / SVG representation */}
                                {isExpanded && (
                                  <div className="animate-in slide-in-from-top-1 duration-200">
                                    <ExerciseAnimation type={ex.animationType} name={ex.name} />
                                  </div>
                                )}

                                {/* Action buttons: Start Rest & Substitute */}
                                {dayStatus === 'hoje' ? (
                                  <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-2">
                                    {ex.tips && (
                                      <p className="text-[8.5px] font-mono text-accent/80 italic leading-snug" title={ex.tips}>
                                        Dica: {ex.tips}
                                      </p>
                                    )}
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => setSubstitutingExerciseId(substitutingExerciseId === ex.id ? null : ex.id)}
                                          className={`text-[9px] font-bold px-2 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                                            substitutingExerciseId === ex.id
                                              ? 'bg-accent/15 border-accent/30 text-accent'
                                              : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700 text-zinc-300'
                                          }`}
                                        >
                                          <Shuffle size={9} /> Substituir
                                        </button>
                                        <button
                                          onClick={() => handleStartEdit(ex)}
                                          className="text-[9px] font-bold px-2 py-1 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-300 rounded-lg flex items-center gap-1 transition-all"
                                        >
                                          <Sliders size={9} /> Editar
                                        </button>
                                      </div>
                                      <button
                                        onClick={() => startTimer(ex.rest)}
                                        className="text-[9px] font-bold text-white bg-zinc-850 hover:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700 flex items-center gap-1 transition-colors"
                                      >
                                        <Play size={8} fill="currentColor" /> Descanso {ex.rest}s
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-[8px] text-zinc-500 font-mono">
                                    <span className="flex items-center gap-1">
                                      <span>🔒</span> Módulo de Leitura
                                    </span>
                                    <span className="uppercase tracking-wider font-bold text-[7.5px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850">
                                      {dayStatus === 'passado' ? 'Realizado' : 'Bloqueado'}
                                    </span>
                                  </div>
                                )}

                                {/* Substitution Options Panel */}
                                {substitutingExerciseId === ex.id && (
                                  <div className="mt-2.5 p-2 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-2 animate-in slide-in-from-top-1 duration-150">
                                    <div className="flex justify-between items-center px-0.5">
                                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                                        Opções de Substituição
                                      </span>
                                      <span className="text-[8px] bg-accent/10 text-accent border border-accent/20 rounded font-mono px-1 py-0.5 font-bold">
                                        {ex.animationType.toUpperCase()}
                                      </span>
                                    </div>

                                    {/* Random option */}
                                    <button
                                      onClick={() => {
                                        handleReplaceWithRandomAlternative(selectedDayIdx, ex.id);
                                        setSubstitutingExerciseId(null);
                                      }}
                                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent text-[9.5px] font-bold rounded-lg transition-all"
                                    >
                                      <Shuffle size={10} />
                                      Gerar Alternativa Aleatória
                                    </button>

                                    {/* Manual options list */}
                                    <div className="space-y-1">
                                      <span className="text-[7.5px] font-semibold text-zinc-500 tracking-wider uppercase block px-0.5">
                                        Ou selecione uma abaixo:
                                      </span>
                                      <div className="max-h-[120px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-zinc-800 pr-0.5">
                                        {profile && getAlternativesForExercise(ex, profile.location, profile.objective).length > 0 ? (
                                          getAlternativesForExercise(ex, profile.location, profile.objective).map(alt => (
                                            <div
                                              key={alt.id}
                                              onClick={() => {
                                                handleManualSubstituteExercise(selectedDayIdx, ex.id, alt);
                                                setSubstitutingExerciseId(null);
                                              }}
                                              className="p-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-accent/30 rounded-lg flex justify-between items-center cursor-pointer transition-all"
                                            >
                                              <div className="flex-1 min-w-0 pr-1.5">
                                                <span className="text-[9.5px] font-bold text-white block truncate">{alt.name}</span>
                                                <span className="text-[8px] font-mono text-zinc-400 block mt-0.5">{alt.series}</span>
                                              </div>
                                              <button className="text-[8px] font-bold text-accent bg-accent/5 px-1.5 py-0.5 rounded border border-accent/10 hover:bg-accent hover:text-white hover:border-accent transition-all">
                                                Substituir
                                              </button>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="text-center py-2 text-zinc-500 text-[8px]">
                                            Nenhuma outra alternativa disponível.
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-zinc-950 rounded-2xl border border-zinc-800">
                        <AlertTriangle className="text-yellow-500 mx-auto mb-2" size={24} />
                        <p className="text-xs text-zinc-400 font-sans">Nenhum treino montado para este dia.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. ALIMENTAÇÃO TAB VIEW */}
                {activeTab === 'alimentacao' && (
                  <motion.div
                    key="alimentacao"
                    variants={tabVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4 flex-1 flex flex-col min-h-0"
                  >
                    {/* Header Calculators summary */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Water Goal Tracker */}
                      <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 flex flex-col justify-between overflow-hidden relative">
                        <div className="space-y-0.5 z-10">
                          <span className="text-[9px] font-bold text-blue-400 uppercase font-sans tracking-wide">Água Consumida</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black font-mono">{waterDrunk}</span>
                            <span className="text-[10px] text-zinc-500">/ {waterTarget}ml</span>
                          </div>
                        </div>

                        {/* Animated Water Level background wave */}
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-blue-600/10 border-t border-blue-500/20 transition-all duration-500"
                          style={{ height: `${Math.min((waterDrunk / waterTarget) * 100, 100)}%` }}
                        ></div>

                        <div className="flex gap-1 mt-3 z-10">
                          <button
                            onClick={() => addWater(250)}
                            className="bg-blue-950/60 text-blue-400 border border-blue-900/60 hover:bg-blue-900 p-1 rounded-lg text-[9px] font-bold flex-1 flex items-center justify-center gap-0.5"
                          >
                            <Plus size={10} /> 250ml
                          </button>
                          <button
                            onClick={() => addWater(500)}
                            className="bg-blue-950/60 text-blue-400 border border-blue-900/60 hover:bg-blue-900 p-1 rounded-lg text-[9px] font-bold flex-1 flex items-center justify-center gap-0.5"
                          >
                            <Plus size={10} /> 500ml
                          </button>
                        </div>
                      </div>

                      {/* Protein Tracker */}
                      <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 flex flex-col justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-accent uppercase font-sans tracking-wide">Alvo de Proteínas</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black font-mono text-accent">{proteinTarget}g</span>
                            <span className="text-[9px] text-zinc-500">recom. diária</span>
                          </div>
                        </div>
                        <div className="text-[9px] text-zinc-400 leading-tight mt-1 bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
                          Ideal para hipertrofia, recuperação muscular rápida e controle glicêmico.
                        </div>
                      </div>
                    </div>

                    {/* Switcher de Sub-abas de Alimentação */}
                    <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800/80 gap-1">
                      <button
                        onClick={() => setAlimentacaoSubTab('lista')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                          alimentacaoSubTab === 'lista'
                            ? 'bg-zinc-900 text-white border border-zinc-800 shadow'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Utensils size={11} />
                        Lista de Alimentos
                      </button>
                      <button
                        onClick={() => setAlimentacaoSubTab('chat')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all relative ${
                          alimentacaoSubTab === 'chat'
                            ? 'bg-accent text-white font-black'
                            : 'text-zinc-400 hover:text-accent'
                        }`}
                      >
                        <Sparkles size={11} className={alimentacaoSubTab === 'chat' ? 'animate-pulse text-yellow-300' : 'text-zinc-500'} />
                        Perguntar ao NutriAI
                        {alimentacaoSubTab !== 'chat' && (
                          <span className="absolute top-1 right-1.5 flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                          </span>
                        )}
                      </button>
                    </div>

                    {alimentacaoSubTab === 'lista' ? (
                      /* Food Replacement Hub */
                      <div className="space-y-2 flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            Substituições de Baixo Custo
                          </h3>
                          {waterDrunk > 0 && (
                            <button onClick={resetWater} className="text-[9px] text-zinc-500 hover:text-white">
                              Zerar Água
                            </button>
                          )}
                        </div>

                        {/* Search & Filter */}
                        <div className="space-y-1.5">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Buscar alimento (ex: frango, ovos)..."
                              value={searchFood}
                              onChange={e => setSearchFood(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-800/80 text-xs rounded-xl px-2.5 py-1.5 pl-7 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-accent"
                            />
                            <Search className="absolute left-2.5 top-2 text-zinc-600" size={12} />
                          </div>

                          {/* Category Buttons */}
                          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                            {(['todas', 'proteina', 'carbo', 'gordura'] as const).map(cat => (
                              <button
                                key={cat}
                                onClick={() => setSelectedReplacementCategory(cat)}
                                className={`py-1 px-2.5 rounded-lg text-[9px] font-semibold uppercase font-mono transition-colors ${
                                  selectedReplacementCategory === cat
                                    ? 'bg-accent text-white'
                                    : 'bg-zinc-950 text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                {cat === 'todas' ? 'Todas' : cat === 'proteina' ? 'Proteínas' : cat === 'carbo' ? 'Carbos' : 'Gorduras'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Food Cards Scroll */}
                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[175px] pr-0.5">
                          {filteredReplacements.length > 0 ? (
                            filteredReplacements.map((food, idx) => (
                              <div key={idx} className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80 space-y-1.5">
                                {/* Original vs Substitute Title */}
                                <div className="flex items-center justify-between text-[11px]">
                                  <div className="text-zinc-500 truncate max-w-[120px] font-medium line-through">
                                    {food.original}
                                  </div>
                                  <ChevronRight size={10} className="text-zinc-600" />
                                  <div className="text-green-400 font-bold truncate max-w-[140px] flex items-center gap-1">
                                    {food.substitute}
                                    <span className="text-[8px] px-1 bg-green-950 text-green-400 border border-green-900 rounded font-mono font-medium">
                                      {food.substitutePrice === 'muito_baixo' ? 'R$ muito baixo' : 'R$ baixo'}
                                    </span>
                                  </div>
                                </div>

                                {/* Protein info */}
                                <div className="flex justify-between items-center bg-zinc-900/60 p-1 rounded border border-zinc-800 text-[9px] font-mono text-zinc-400">
                                  <span>{food.originalProtein}</span>
                                  <span className="text-zinc-600">➔</span>
                                  <span className="text-green-400 font-bold">{food.substituteProtein}</span>
                                </div>

                                {/* Conversion Tip */}
                                <div className="text-[9px] text-zinc-400 leading-normal font-sans">
                                  <span className="text-accent font-bold">Proporção:</span> {food.ratio}
                                </div>

                                {/* Saving Architect recommendation */}
                                <div className="text-[8px] text-zinc-500 bg-zinc-900 p-1.5 rounded border border-zinc-850/50 leading-relaxed font-sans">
                                  <span className="text-zinc-400 font-bold uppercase tracking-wider">Dica Econômica:</span> {food.savingTip}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center py-6 text-[10px] text-zinc-600 font-sans">Nenhum substituto de baixo custo encontrado.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* NutriAI Chat View */
                      <div className="flex-1 flex flex-col min-h-0 bg-zinc-950/60 rounded-2xl border border-zinc-850/60 overflow-hidden relative">
                        {/* Chat Header */}
                        <div className="bg-zinc-900/50 px-3 py-1.5 border-b border-zinc-850 flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                              <Bot size={11} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black font-sans leading-none text-zinc-100">NutriAI Assistant</p>
                              <span className="text-[8px] text-green-400 flex items-center gap-0.5 font-sans">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                                Online e Pronto
                              </span>
                            </div>
                          </div>
                          {chatMessages.length > 1 && (
                            <button
                              onClick={clearChatHistory}
                              title="Limpar Conversa"
                              className="text-zinc-600 hover:text-red-450 p-1 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>

                        {/* Messages List Area */}
                        <div className="flex-1 overflow-y-auto p-2.5 space-y-2 min-h-0 scrollbar-thin scrollbar-thumb-zinc-800">
                          {chatMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex flex-col max-w-[85%] ${
                                msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                              }`}
                            >
                              <div
                                className={`p-2 rounded-xl text-[10px] font-sans leading-normal ${
                                  msg.sender === 'user'
                                    ? 'bg-accent text-white rounded-br-none shadow-sm'
                                    : 'bg-zinc-900 border border-zinc-850 text-zinc-200 rounded-bl-none shadow-sm'
                                }`}
                              >
                                <div className="space-y-1 break-words">
                                  {renderMessageText(msg.text)}
                                </div>
                              </div>
                              <span className="text-[7px] text-zinc-600 mt-0.5 px-1 font-mono">
                                {msg.timestamp}
                              </span>
                            </div>
                          ))}

                          {isChatLoading && (
                            <div className="flex flex-col items-start max-w-[85%]">
                              <div className="bg-zinc-900 border border-zinc-850 p-2 rounded-xl rounded-bl-none flex items-center gap-1.5">
                                <div className="flex gap-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <span className="text-[8px] text-zinc-500 font-sans italic">NutriAI está respondendo...</span>
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </div>

                        {/* Quick Prompt Suggester Buttons */}
                        {chatMessages.length === 1 && !isChatLoading && (
                          <div className="px-2 pb-1.5 flex gap-1 flex-wrap shrink-0">
                            <button
                              onClick={() => { setChatInput('Trocar peito de frango por outra proteína barata'); }}
                              className="text-[8px] bg-zinc-900 border border-zinc-850 hover:border-accent/50 text-zinc-400 hover:text-white px-1.5 py-0.5 rounded-md font-sans transition-all cursor-pointer"
                            >
                              🍗 Substituir Frango
                            </button>
                            <button
                              onClick={() => { setChatInput('Quantas calorias tem 100g de arroz e feijão?'); }}
                              className="text-[8px] bg-zinc-900 border border-zinc-850 hover:border-accent/50 text-zinc-400 hover:text-white px-1.5 py-0.5 rounded-md font-sans transition-all cursor-pointer"
                            >
                              🍚 Calorias Arroz/Feijão
                            </button>
                            <button
                              onClick={() => { setChatInput('Ideia de pré-treino barato para massa muscular'); }}
                              className="text-[8px] bg-zinc-900 border border-zinc-850 hover:border-accent/50 text-zinc-400 hover:text-white px-1.5 py-0.5 rounded-md font-sans transition-all cursor-pointer"
                            >
                              ⚡ Pré-treino Barato
                            </button>
                          </div>
                        )}

                        {/* Input Form at the bottom */}
                        <form
                          onSubmit={handleSendChatMessage}
                          className="p-1.5 bg-zinc-900/50 border-t border-zinc-850 flex gap-1 shrink-0"
                        >
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            disabled={isChatLoading}
                            placeholder="Perguntar sobre calorias, substitutos..."
                            className="flex-1 bg-zinc-950 border border-zinc-800/80 text-[10px] rounded-xl px-2.5 py-1 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-accent disabled:opacity-50"
                          />
                          <button
                            type="submit"
                            disabled={isChatLoading || !chatInput.trim()}
                            className="bg-accent hover:bg-accent-hover disabled:bg-zinc-800 disabled:text-zinc-600 text-white p-1.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <Send size={10} />
                          </button>
                        </form>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. PERFIL TAB VIEW */}
                {activeTab === 'perfil' && (
                  <motion.div
                    key="perfil"
                    variants={tabVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4 flex-1 flex flex-col justify-between py-2"
                  >
                    <div className="space-y-3">
                      <div className="text-center pt-1.5">
                        <div className="relative w-14 h-14 mx-auto mb-1.5">
                          {googleUser?.avatarUrl ? (
                            <img
                              src={googleUser.avatarUrl}
                              alt="Avatar"
                              referrerPolicy="no-referrer"
                              className="w-14 h-14 rounded-full border-2 border-accent bg-zinc-800 object-cover"
                            />
                          ) : (
                            <div className={`w-14 h-14 rounded-full border-2 border-accent flex items-center justify-center ${isDark ? 'bg-zinc-800 text-zinc-350' : 'bg-zinc-200 text-zinc-650'}`}>
                              <User size={28} />
                            </div>
                          )}
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
                        </div>
                        <h3 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-zinc-900'} font-sans`}>{googleUser?.name || 'Atleta PersonalPessoal'}</h3>
                        <p className={`text-[9px] ${isDark ? 'text-zinc-500' : 'text-zinc-600'} font-mono truncate px-4`}>{googleUser?.email || 'atleta@exemplo.com'}</p>
                        <span className="inline-block text-[7px] bg-green-950 text-green-400 border border-green-900/60 rounded px-1.5 py-0.5 mt-1 font-mono uppercase tracking-wider font-semibold">
                          Google Auth Ativo
                        </span>
                      </div>

                      {/* Info list */}
                      <div className={`${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'} border rounded-2xl p-3 space-y-2 max-h-[175px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 transition-colors`}>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-zinc-500 font-sans">Sexo Biológico</span>
                          <select
                            value={profile.gender || 'masculino'}
                            onChange={(e) => {
                              const newGender = e.target.value as any;
                              const updatedProfile = { ...profile, gender: newGender };
                              setProfile(updatedProfile);
                              localStorage.setItem('gymdemocra_profile', JSON.stringify(updatedProfile));
                            }}
                            className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} text-accent text-[10px] font-bold font-sans rounded px-1.5 py-0.5 focus:outline-none focus:border-accent cursor-pointer`}
                          >
                            <option value="masculino" className={isDark ? "bg-zinc-950 text-zinc-350" : "bg-white text-zinc-700"}>Masculino</option>
                            <option value="feminino" className={isDark ? "bg-zinc-950 text-zinc-350" : "bg-white text-zinc-700"}>Feminino</option>
                          </select>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-zinc-500 font-sans">Objetivo</span>
                          <select
                            value={profile.objective}
                            onChange={(e) => {
                              const newObj = e.target.value as any;
                              const updatedProfile = { ...profile, objective: newObj };
                              setProfile(updatedProfile);
                              localStorage.setItem('gymdemocra_profile', JSON.stringify(updatedProfile));
                              setSelectedDayIdx(0);
                            }}
                            className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} text-accent text-[10px] font-bold font-sans rounded px-1.5 py-0.5 focus:outline-none focus:border-accent cursor-pointer`}
                          >
                            <option value="ganhar_massa" className={isDark ? "bg-zinc-950 text-zinc-350" : "bg-white text-zinc-700"}>Ganhar Massa</option>
                            <option value="emagrecer" className={isDark ? "bg-zinc-950 text-zinc-350" : "bg-white text-zinc-700"}>Emagrecer</option>
                            <option value="ganhar_forca" className={isDark ? "bg-zinc-950 text-zinc-350" : "bg-white text-zinc-700"}>Ganhar Força</option>
                            <option value="definicao" className={isDark ? "bg-zinc-950 text-zinc-350" : "bg-white text-zinc-700"}>Definição</option>
                            <option value="saude_longevidade" className={isDark ? "bg-zinc-950 text-zinc-350" : "bg-white text-zinc-700"}>Saúde</option>
                          </select>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-zinc-500 font-sans">Localização</span>
                          <select
                            value={profile.location}
                            onChange={(e) => {
                              const newLoc = e.target.value as any;
                              const updatedProfile = { ...profile, location: newLoc };
                              setProfile(updatedProfile);
                              localStorage.setItem('gymdemocra_profile', JSON.stringify(updatedProfile));
                              setSelectedDayIdx(0);
                            }}
                            className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} text-accent text-[10px] font-bold font-sans rounded px-1.5 py-0.5 focus:outline-none focus:border-accent cursor-pointer`}
                          >
                            <option value="academia_media" className={isDark ? "bg-zinc-950 text-zinc-350" : "bg-white text-zinc-700"}>Academia</option>
                            <option value="casa_calistenia" className={isDark ? "bg-zinc-950 text-zinc-350" : "bg-white text-zinc-700"}>Em Casa</option>
                          </select>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-zinc-500 font-sans">Frequência Semanal</span>
                          <select
                            value={profile.daysPerWeek}
                            onChange={(e) => {
                              const newDays = parseInt(e.target.value, 10);
                              const updatedProfile = { ...profile, daysPerWeek: newDays };
                              setProfile(updatedProfile);
                              localStorage.setItem('gymdemocra_profile', JSON.stringify(updatedProfile));
                              setSelectedDayIdx(0);
                            }}
                            className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} text-accent text-[10px] font-bold font-sans rounded px-1.5 py-0.5 focus:outline-none focus:border-accent cursor-pointer`}
                          >
                            {[1, 2, 3, 4, 5, 6, 7].map(d => (
                              <option key={d} value={d} className={isDark ? "bg-zinc-950 text-zinc-350" : "bg-white text-zinc-700"}>
                                {d} {d === 1 ? 'dia' : 'dias'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-zinc-500 font-sans">Peso Registrado</span>
                          <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'} font-mono`}>{profile.weight} kg</span>
                        </div>
                        {profile.height && (
                          <div className={`flex justify-between items-center text-[10.5px] border-t ${isDark ? 'border-zinc-900/60' : 'border-zinc-150'} pt-1.5`}>
                            <span className="text-zinc-500 font-sans">Altura Registrada</span>
                            <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-zinc-800'} font-mono`}>{profile.height} cm</span>
                          </div>
                        )}
                        {profile.desiredWeight && (
                          <div className="flex justify-between items-center text-[10.5px]">
                            <span className="text-zinc-500 font-sans">Meta de Peso</span>
                            <span className="font-bold text-green-500 font-mono">{profile.desiredWeight} kg</span>
                          </div>
                        )}
                        {profile.height && profile.weight && (
                          <div className="flex justify-between items-center text-[10.5px]">
                            <span className="text-zinc-500 font-sans">IMC Calculado</span>
                            <span className="font-bold text-accent font-mono">
                              {(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)}
                            </span>
                          </div>
                        )}

                        {profile.experienceLevel && (
                          <div className={`flex justify-between items-center text-[10.5px] border-t ${isDark ? 'border-zinc-900/60' : 'border-zinc-150'} pt-1.5`}>
                            <span className="text-zinc-500 font-sans">Experiência</span>
                            <span className={`font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-800'} capitalize font-sans`}>{profile.experienceLevel}</span>
                          </div>
                        )}
                        {profile.workoutDurationCategory && (
                          <div className="flex justify-between items-center text-[10.5px]">
                            <span className="text-zinc-500 font-sans">Tempo de Treino</span>
                            <span className={`font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-800'} capitalize font-sans`}>{profile.workoutDurationCategory}</span>
                          </div>
                        )}
                        {profile.healthLimitations && (
                          <div className={`flex justify-between items-start text-[10.5px] border-t ${isDark ? 'border-zinc-900/60' : 'border-zinc-150'} pt-1.5`}>
                            <span className="text-zinc-500 font-sans">Limitações</span>
                            <div className="text-right flex flex-col gap-0.5 max-w-[120px]">
                              {profile.healthLimitations.includes('nenhuma') ? (
                                <span className="font-bold text-green-500">Nenhuma</span>
                              ) : (
                                profile.healthLimitations.map(lim => {
                                  const label = HEALTH_LIMITATIONS_OPTIONS.find(o => o.id === lim)?.name || lim;
                                  return (
                                    <span key={lim} className="text-[9px] font-bold text-red-500 capitalize">
                                      {label}
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Configurações de Aparência (Desejo do Usuário) */}
                      <div className={`${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200/80 shadow-2xs'} border rounded-2xl p-3 space-y-2.5 transition-colors`}>
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className={`font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-650'} font-sans flex items-center gap-1`}>
                            {isDark ? <Moon size={11} className="text-yellow-400 fill-yellow-400/10" /> : <Sun size={11} className="text-amber-500 fill-amber-500/10" />}
                            Tema do Simulador
                          </span>
                          <div className={`flex p-0.5 rounded-lg border max-w-[130px] w-full shrink-0 ${isDark ? 'bg-zinc-900/45 border-zinc-800/60' : 'bg-zinc-100 border-zinc-200'}`}>
                            <button
                              onClick={() => { if (isDark) toggleDarkMode(); }}
                              className={`flex-1 py-1 px-1.5 rounded-md text-[8px] font-bold font-sans transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                !isDark
                                  ? 'bg-accent text-white shadow-xs'
                                  : 'text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              ☀️ Claro
                            </button>
                            <button
                              onClick={() => { if (!isDark) toggleDarkMode(); }}
                              className={`flex-1 py-1 px-1.5 rounded-md text-[8px] font-bold font-sans transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                isDark
                                  ? 'bg-accent text-white shadow-xs'
                                  : 'text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              🌙 Escuro
                            </button>
                          </div>
                        </div>

                        {/* Seletor de Paleta de Cores de Alta Visibilidade */}
                        <div className={`border-t ${isDark ? 'border-zinc-900' : 'border-zinc-150'} pt-2`}>
                          <span className={`text-[9px] font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-600'} uppercase tracking-wide block mb-1.5 font-sans flex items-center gap-1`}>
                            <Sparkles size={11} className="text-accent animate-pulse" />
                            Cor de Destaque
                          </span>
                          <div className="grid grid-cols-3 gap-1">
                            {Object.entries(PALETTE_COLORS).map(([id, item]) => {
                              const isSelected = activePalette === id;
                              return (
                                <button
                                  key={id}
                                  onClick={() => handlePaletteChange(id)}
                                  className={`py-1 px-0.5 rounded-lg border flex items-center justify-center gap-1 transition-all text-[8px] font-bold cursor-pointer ${
                                    isSelected
                                      ? 'bg-accent/15 border-accent text-accent'
                                      : isDark
                                        ? 'bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:text-white'
                                        : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:text-zinc-900'
                                  }`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                                  <span className="truncate">{item.name.split(' ')[0]}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <button
                        onClick={handleResetProfile}
                        className={`w-full py-2 ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-750' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-750 border-zinc-300'} border rounded-xl text-[10px] font-bold font-sans flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                      >
                        <RefreshCw size={11} /> Refazer Questionário
                      </button>
                      <button
                        onClick={handleGoogleLogout}
                        className={`w-full py-2 ${isDark ? 'bg-red-950/40 hover:bg-red-950/60 text-red-400 border-red-900/40' : 'bg-red-50 hover:bg-red-100 text-red-500 border-red-200'} border rounded-xl text-[10px] font-bold font-sans flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
                      >
                        Sair da Conta Google
                      </button>
                      <p className={`text-[8px] ${isDark ? 'text-zinc-650' : 'text-zinc-500'} text-center font-sans`}>
                        Este simulador salva seus dados localmente via localStorage.
                      </p>
                    </div>
                  </motion.div>
                )}
                  </AnimatePresence>
                </div>

                {/* Smartphone Bottom App Tabs Navigation */}
                <div className="bg-zinc-950 border-t border-zinc-800/80 -mx-4 px-4 pt-2.5 pb-1 flex justify-around items-center rounded-b-[38px] z-10">
                  <button
                    onClick={() => setActiveTab('treino')}
                    className={`flex flex-col items-center gap-0.5 pb-1 transition-colors ${
                      activeTab === 'treino' ? 'text-accent' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Dumbbell size={16} />
                    <span className="text-[9px] font-bold font-sans">Meu Treino</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('alimentacao')}
                    className={`flex flex-col items-center gap-0.5 pb-1 transition-colors ${
                      activeTab === 'alimentacao' ? 'text-accent' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Utensils size={16} />
                    <span className="text-[9px] font-bold font-sans">Alimentação</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('perfil')}
                    className={`flex flex-col items-center gap-0.5 pb-1 transition-colors ${
                      activeTab === 'perfil' ? 'text-accent' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <User size={16} />
                    <span className="text-[9px] font-bold font-sans">Perfil</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Custom Confirmation Modal for Iframe Support */}
          {confirmAction && (
            <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
              <div className="bg-zinc-900 border border-zinc-800 w-full max-w-[280px] rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-sm font-extrabold text-white font-sans uppercase tracking-wider">
                    {confirmAction === 'reset_profile' ? 'Refazer Ficha?' : 'Sair da Conta?'}
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-normal font-sans">
                    {confirmAction === 'reset_profile'
                      ? 'Deseja refazer o questionário completo de saúde, objetivos, aparelhos e treinos? Seu progresso atual de água também será reiniciado.'
                      : 'Deseja realmente sair da sua conta do Google? Isso limpará seus dados de treino locais.'}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={confirmAction === 'reset_profile' ? executeResetProfile : executeGoogleLogout}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold font-sans transition-all active:scale-95 cursor-pointer text-white ${
                      confirmAction === 'reset_profile'
                        ? 'bg-accent hover:bg-accent-hover'
                        : 'bg-red-600 hover:bg-red-500'
                    }`}
                  >
                    {confirmAction === 'reset_profile' ? 'Sim, Refazer Ficha' : 'Sim, Sair da Conta'}
                  </button>
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-xl text-xs font-bold font-sans transition-all active:scale-95 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Simulated Google Sign-In Account Selector Modal */}
          {showGoogleSelectModal && (
            <div className="absolute inset-0 bg-black/80 flex items-end justify-center z-50 p-3">
              <div className="bg-zinc-900 border border-zinc-800 w-full rounded-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
                <div className="text-center space-y-1">
                  <div className="flex justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 mb-1">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-white font-sans">Fazer login com o Google</h3>
                  <p className="text-[10px] text-zinc-400 font-sans">para prosseguir para <span className="text-accent font-semibold">PersonalPessoal</span></p>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
                  {/* Account option 1 (The workspace user's email!) */}
                  <button
                    onClick={() => handleSelectGoogleAccount('c.katsumi@gmail.com', 'Carlos Katsumi')}
                    className="w-full flex items-center gap-3 p-3 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 rounded-2xl text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-zinc-950 font-sans text-xs">
                      CK
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white font-sans">Carlos Katsumi</p>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">c.katsumi@gmail.com</p>
                    </div>
                    <div className="text-[9px] bg-accent/10 text-accent border border-accent/20 px-1.5 py-0.5 rounded font-mono font-bold">
                      Você
                    </div>
                  </button>

                  {/* Account option 2 */}
                  <button
                    onClick={() => handleSelectGoogleAccount('atleta.comum@gmail.com', 'Atleta PersonalPessoal')}
                    className="w-full flex items-center gap-3 p-3 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 rounded-2xl text-left transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-750 flex items-center justify-center font-bold text-zinc-200 font-sans text-xs">
                      A
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white font-sans">Atleta PersonalPessoal</p>
                      <p className="text-[10px] text-zinc-500 font-mono truncate">atleta.comum@gmail.com</p>
                    </div>
                  </button>

                  {/* Custom Input */}
                  <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-2">
                    <p className="text-[9px] text-zinc-500 font-bold uppercase font-sans">Ou usar outro e-mail:</p>
                    <input
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs px-2.5 py-2 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-accent font-sans"
                    />
                    <button
                      onClick={() => {
                        if (customEmail.includes('@')) {
                          const name = customEmail.split('@')[0];
                          const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
                          handleSelectGoogleAccount(customEmail, capitalizedName);
                        } else {
                          alert('Por favor, digite um e-mail válido.');
                        }
                      }}
                      className="w-full py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-[10px] font-bold font-sans transition-colors cursor-pointer"
                    >
                      Entrar com este e-mail
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowGoogleSelectModal(false)}
                  className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-[11px] font-bold font-sans transition-colors pt-1 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Simulated loading state during authenticating on Supabase */}
          {isLoggingIn && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white font-sans">Conectando ao Supabase Auth...</p>
                <p className="text-[9px] text-zinc-500 font-mono animate-pulse">Validando Google ID Token...</p>
                <p className="text-[9px] text-accent/80 font-sans">Sincronizando tabelas e perfis de usuário</p>
              </div>
            </div>
          )}

          {/* Smartphone Bottom Home Indicator Bar */}
          <div className="w-28 h-1 bg-zinc-700/80 rounded-full mx-auto mt-2 mb-0.5"></div>
        </div>
      </div>
    </div>
  );
}
