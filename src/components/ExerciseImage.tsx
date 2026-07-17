import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, Dumbbell, Sparkles } from 'lucide-react';
import { EXERCISE_ID_MAPPING, EXERCISE_NAME_SEARCH_TERMS } from '../data/exerciseMapping';
import exercisesDb from '../data/exercises.json';

interface ExerciseImageProps {
  exerciseId: string;
  exerciseName: string;
  customImageUrl?: string;
}

export const ExerciseImage: React.FC<ExerciseImageProps> = ({
  exerciseId,
  exerciseName,
  customImageUrl
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // 1. Resolve the exercise details from exercises.json
  const resolvedExercise = useMemo(() => {
    // A. Check ID Mapping first
    const mappedId = EXERCISE_ID_MAPPING[exerciseId];
    if (mappedId) {
      const match = (exercisesDb as any[]).find(ex => ex.id === mappedId);
      if (match) return match;
    }

    // B. Try matching directly by lowercase ID
    const directIdMatch = (exercisesDb as any[]).find(
      ex => ex.id.toLowerCase() === exerciseId.toLowerCase().replace(/_/g, '-')
    );
    if (directIdMatch) return directIdMatch;

    // C. Search using simplified terms
    const lowerName = exerciseName.toLowerCase();

    // Determine equipment preference based on Portuguese and English keywords
    const isDumbbellPref = lowerName.includes('halter') || lowerName.includes('halteres') || lowerName.includes('dumbbell');
    const isBarbellPref = lowerName.includes('barra') || lowerName.includes('barbell');
    const isCablePref = lowerName.includes('polia') || lowerName.includes('cabo') || lowerName.includes('cable');
    const isMachinePref = lowerName.includes('maquina') || lowerName.includes('máquina') || lowerName.includes('machine');

    for (const [key, term] of Object.entries(EXERCISE_NAME_SEARCH_TERMS)) {
      if (lowerName.includes(key)) {
        // Direct override mappings to enforce specific high-quality matches if dumbbell is requested
        let finalTerm = term;
        if (isDumbbellPref) {
          if (key === 'desenvolvimento') {
            finalTerm = 'arnold dumbbell press';
          } else if (key === 'supino' || key === 'supino reto' || key === 'supino inclinado') {
            finalTerm = 'decline dumbbell bench';
          }
        }

        // Helper to check if an exercise matches equipment
        const matchesEquipment = (ex: any) => {
          const eq = (ex.equipment || '').toLowerCase();
          const exName = (ex.name || '').toLowerCase();
          const exId = (ex.id || '').toLowerCase();
          
          if (isDumbbellPref) {
            return eq === 'dumbbell' || exName.includes('dumbbell') || exId.includes('dumbbell') || exName.includes('db') || exId.includes('db');
          }
          if (isBarbellPref) {
            return eq === 'barbell' || exName.includes('barbell') || exId.includes('barbell');
          }
          if (isCablePref) {
            return eq === 'cable' || exName.includes('cable') || exId.includes('cable') || exName.includes('rope') || exId.includes('rope');
          }
          if (isMachinePref) {
            return eq === 'machine' || exName.includes('machine') || exId.includes('machine') || eq === 'smith machine' || eq === 'leverage machine';
          }
          return true;
        };

        // Pass 1: Try to find a match that contains the term AND satisfies the equipment preference
        const eqMatch = (exercisesDb as any[]).find(ex => {
          const matchesTerm = ex.name.toLowerCase().includes(finalTerm) || ex.id.toLowerCase().includes(finalTerm.replace(/\s+/g, '_'));
          return matchesTerm && matchesEquipment(ex);
        });
        if (eqMatch) return eqMatch;

        // Pass 2: Fallback to general search without equipment filter
        const fallbackMatch = (exercisesDb as any[]).find(
          ex => ex.name.toLowerCase().includes(finalTerm) || ex.id.toLowerCase().includes(finalTerm.replace(/\s+/g, '_'))
        );
        if (fallbackMatch) return fallbackMatch;
      }
    }

    // D. Fuzzy search/fallback containing any word of the name
    const words = lowerName.split(/\s+/).filter(w => w.length > 3);
    for (const word of words) {
      const match = (exercisesDb as any[]).find(ex => ex.name.toLowerCase().includes(word));
      if (match) return match;
    }

    return null;
  }, [exerciseId, exerciseName]);

  // 2. Build image URLs list
  const imageUrls = useMemo(() => {
    if (customImageUrl) return [customImageUrl];

    if (resolvedExercise && resolvedExercise.images && resolvedExercise.images.length > 0) {
      return resolvedExercise.images.map((img: string) => {
        // Ensure we load from the official yuhonas/free-exercise-db repository master branch
        return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/master/exercises/${img}`;
      });
    }
    return [];
  }, [resolvedExercise, customImageUrl]);

  // 3. Flipbook animation loop
  useEffect(() => {
    if (imageUrls.length <= 1 || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % imageUrls.length);
    }, 600); // 600ms is the sweet spot for a smooth, readable movement loop

    return () => clearInterval(interval);
  }, [imageUrls, isPlaying]);

  // Reset frame when source images change
  useEffect(() => {
    setCurrentFrame(0);
  }, [imageUrls]);

  // Preload all frames in background to ensure zero-flicker instant flipbook transitions
  useEffect(() => {
    if (imageUrls.length <= 1) return;
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imageUrls]);

  if (imageUrls.length === 0) {
    return (
      <div id="exercise-image-placeholder" className="relative flex flex-col items-center justify-center h-48 bg-zinc-950 rounded-xl border border-zinc-800/80 p-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-orange-500/5 to-transparent pointer-events-none" />
        <Dumbbell className="w-10 h-10 text-zinc-600 mb-2 animate-pulse" />
        <p className="text-xs text-zinc-400 font-sans font-medium">{exerciseName}</p>
        <span className="text-[10px] text-zinc-600 mt-1 font-mono">Nenhum GIF mapeado</span>
      </div>
    );
  }

  return (
    <div id={`exercise-media-${exerciseId}`} className="relative flex flex-col bg-zinc-950 rounded-xl border border-zinc-800/80 overflow-hidden group">
      {/* Frame Container */}
      <div className="relative w-full aspect-video md:h-48 bg-white flex items-center justify-center p-2 overflow-hidden select-none">
        <img
          src={imageUrls[currentFrame]}
          alt={`${exerciseName} - Frame ${currentFrame + 1}`}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain mix-blend-multiply transition-opacity duration-250 ease-in-out"
        />

        {/* Level badge */}
        {resolvedExercise?.level && (
          <div className="absolute top-2 left-2 bg-zinc-900/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-zinc-700/50 text-[9px] font-black text-orange-500 uppercase tracking-wider font-sans">
            {resolvedExercise.level}
          </div>
        )}

        {/* Target muscle badge */}
        {resolvedExercise?.primaryMuscles?.[0] && (
          <div className="absolute top-2 right-2 bg-zinc-900/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-zinc-700/50 text-[9px] font-bold text-zinc-300 font-sans">
            {resolvedExercise.primaryMuscles[0].toUpperCase()}
          </div>
        )}

        {/* Play/Pause overlay indicator */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-zinc-900/90 backdrop-blur-xs px-2 py-1 rounded-lg border border-zinc-800 shadow-lg opacity-80 hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-zinc-300 hover:text-orange-500 focus:outline-none transition-colors"
            title={isPlaying ? "Pausar" : "Iniciar"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>
          <span className="text-[9px] font-mono font-medium text-zinc-400 select-none">
            {currentFrame + 1}/{imageUrls.length}
          </span>
        </div>
      </div>

      {/* Equipment info & details under-bar */}
      <div className="bg-zinc-900/80 px-3 py-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
        <div className="flex items-center gap-1 font-sans">
          <Dumbbell className="w-3 h-3 text-orange-500" />
          <span className="capitalize">{resolvedExercise?.equipment || 'Peso Corporal'}</span>
        </div>
        {resolvedExercise?.mechanic && (
          <div className="flex items-center gap-1 font-sans">
            <Sparkles className="w-3 h-3 text-yellow-500/80 animate-pulse" />
            <span className="capitalize">{resolvedExercise.mechanic === 'compound' ? 'Composto' : 'Isolador'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
