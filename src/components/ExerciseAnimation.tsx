import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Compass, Move, Sparkles, HelpCircle } from 'lucide-react';

interface ExerciseAnimationProps {
  type: 'push' | 'pull' | 'legs' | 'core' | 'cardio';
  name: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface JointInfo {
  [key: string]: Point3D;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({ type, name }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Active palette theme state
  const [activePalette, setActivePalette] = useState(() => {
    return localStorage.getItem('personalpessoal_accent_palette') || 'laranja';
  });

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActivePalette(customEvent.detail);
      }
    };
    window.addEventListener('personalpessoal_palette_changed', handleSync);
    return () => window.removeEventListener('personalpessoal_palette_changed', handleSync);
  }, []);

  const getThemeColors = () => {
    switch (activePalette) {
      case 'azul':
        return {
          core: '#3b82f6',
          coreRGB: '59, 130, 246',
          highlight: '#60a5fa',
          needle: '#3b82f6'
        };
      case 'verde':
        return {
          core: '#10b981',
          coreRGB: '16, 185, 129',
          highlight: '#34d399',
          needle: '#10b981'
        };
      case 'roxo':
        return {
          core: '#8b5cf6',
          coreRGB: '139, 92, 246',
          highlight: '#a78bfa',
          needle: '#8b5cf6'
        };
      case 'rosa':
        return {
          core: '#ec4899',
          coreRGB: '236, 72, 153',
          highlight: '#f472b6',
          needle: '#ec4899'
        };
      case 'amarelo':
        return {
          core: '#eab308',
          coreRGB: '234, 179, 8',
          highlight: '#facc15',
          needle: '#eab308'
        };
      case 'laranja':
      default:
        return {
          core: '#f97316',
          coreRGB: '249, 115, 22',
          highlight: '#f59e0b',
          needle: '#f97316'
        };
    }
  };

  const themeColors = getThemeColors();

  // Interactive camera rotation state
  const [yaw, setYaw] = useState<number>(0.4); // rotation around Y axis
  const [pitch, setPitch] = useState<number>(0.15); // rotation around X axis
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const cameraAngles = useRef({ yaw: 0.4, pitch: 0.15 });

  // Normalizing Portuguese names to detect the exact athletic exercise
  const nameLower = name.toLowerCase();
  let exerciseKey = 'generic_push';
  let exerciseDisplayName = 'Manobras Anatômicas';

  if (nameLower.includes('supino') && nameLower.includes('inclinado')) {
    exerciseKey = 'supino_inclinado';
    exerciseDisplayName = nameLower.includes('halteres') 
      ? 'Supino Inclinado (Halteres)' 
      : 'Supino Inclinado (Barra)';
  } else if (nameLower.includes('supino') && nameLower.includes('reto')) {
    exerciseKey = 'supino_reto';
    exerciseDisplayName = nameLower.includes('halteres')
      ? 'Supino Reto (Halteres)'
      : 'Supino Reto (Barra)';
  } else if (nameLower.includes('desenvolvimento')) {
    exerciseKey = 'desenvolvimento';
    exerciseDisplayName = 'Desenvolvimento de Ombros';
  } else if (nameLower.includes('elevação lateral') || nameLower.includes('elevaçao lateral')) {
    exerciseKey = 'elevacao_lateral';
    exerciseDisplayName = 'Elevação Lateral (Deltoides)';
  } else if (nameLower.includes('tríceps polia') || nameLower.includes('triceps polia')) {
    exerciseKey = 'triceps_polia';
    exerciseDisplayName = 'Tríceps Polia (Cabo)';
  } else if (nameLower.includes('tríceps testa') || nameLower.includes('triceps testa')) {
    exerciseKey = 'triceps_testa';
    exerciseDisplayName = 'Tríceps Testa (Lying Extension)';
  } else if (nameLower.includes('banco') || nameLower.includes('dips')) {
    exerciseKey = 'triceps_dips_banco';
    exerciseDisplayName = 'Tríceps Banco (Dips)';
  } else if (nameLower.includes('crucifixo')) {
    exerciseKey = 'crucifixo';
    exerciseDisplayName = 'Crucifixo / Crossover';
  } else if (nameLower.includes('puxada')) {
    exerciseKey = 'puxada_pulley';
    exerciseDisplayName = 'Puxada Aberta (Pulley)';
  } else if (nameLower.includes('remada baixa')) {
    exerciseKey = 'remada_baixa';
    exerciseDisplayName = 'Remada Baixa Sentado';
  } else if (nameLower.includes('remada curvada')) {
    exerciseKey = 'remada_curvada';
    exerciseDisplayName = 'Remada Curvada';
  } else if (nameLower.includes('unilateral')) {
    exerciseKey = 'remada_unilateral';
    exerciseDisplayName = 'Remada Unilateral (Serrote)';
  } else if (nameLower.includes('rosca')) {
    exerciseKey = 'rosca_biceps';
    exerciseDisplayName = 'Rosca Bíceps (Flexão de Braço)';
  } else if (nameLower.includes('leg press')) {
    exerciseKey = 'leg_press';
    exerciseDisplayName = 'Leg Press 45º';
  } else if (nameLower.includes('extensora')) {
    exerciseKey = 'extensora';
    exerciseDisplayName = 'Cadeira Extensora (Quadríceps)';
  } else if (nameLower.includes('flexora')) {
    exerciseKey = 'flexora';
    exerciseDisplayName = 'Mesa/Cadeira Flexora';
  } else if (nameLower.includes('agachamento')) {
    exerciseKey = 'agachamento';
    exerciseDisplayName = 'Agachamento Livre/Smith';
  } else if (nameLower.includes('passada') || nameLower.includes('afundo')) {
    exerciseKey = 'passada_afundo';
    exerciseDisplayName = 'Passada Unilateral';
  } else if (nameLower.includes('pélvica') || (nameLower.includes('elevacao') && nameLower.includes('quadril'))) {
    exerciseKey = 'elevacao_pelvica';
    exerciseDisplayName = 'Elevação Pélvica';
  } else if (nameLower.includes('panturrilha') || nameLower.includes('gêmeos')) {
    exerciseKey = 'panturrilha';
    exerciseDisplayName = 'Panturrilha (Gêmeos)';
  } else if (nameLower.includes('prancha')) {
    exerciseKey = 'prancha';
    exerciseDisplayName = 'Prancha Abdominal';
  } else if (nameLower.includes('abdominal') || nameLower.includes('crunch')) {
    exerciseKey = 'abdominal';
    exerciseDisplayName = 'Abdominal Supra/Infra';
  } else if (nameLower.includes('esteira') || nameLower.includes('corrida') || nameLower.includes('skipping')) {
    exerciseKey = 'corrida';
    exerciseDisplayName = 'Esteira / Corrida';
  } else if (nameLower.includes('bicicleta') || nameLower.includes('pedal')) {
    exerciseKey = 'bicicleta';
    exerciseDisplayName = 'Bicicleta Ergométrica';
  } else {
    // Fallback based on type
    if (type === 'push') {
      exerciseKey = 'generic_push';
      exerciseDisplayName = 'Exercício de Empurrar (Push)';
    } else if (type === 'pull') {
      exerciseKey = 'generic_pull';
      exerciseDisplayName = 'Exercício de Puxar (Pull)';
    } else if (type === 'legs') {
      exerciseKey = 'generic_legs';
      exerciseDisplayName = 'Treino de Pernas (Legs)';
    } else if (type === 'core') {
      exerciseKey = 'generic_core';
      exerciseDisplayName = 'Estabilização de Core';
    } else {
      exerciseKey = 'generic_cardio';
      exerciseDisplayName = 'Resistência Cardiorrespiratória';
    }
  }

  // Reset camera angles to optimal viewing positions based on specific exercise
  const resetCamera = () => {
    let defaultYaw = 0.4;
    let defaultPitch = 0.15;
    
    if (exerciseKey === 'supino_inclinado') {
      defaultYaw = 0.85; // rotated to show incline angle perfectly from side-front
      defaultPitch = 0.28;
    } else if (exerciseKey === 'supino_reto') {
      defaultYaw = 0.75;
      defaultPitch = 0.25;
    } else if (exerciseKey === 'leg_press') {
      defaultYaw = 1.05;
      defaultPitch = 0.22;
    } else if (exerciseKey === 'extensora' || exerciseKey === 'flexora') {
      defaultYaw = 0.9;
      defaultPitch = 0.18;
    } else if (exerciseKey === 'abdominal' || exerciseKey === 'prancha') {
      defaultYaw = 1.1;
      defaultPitch = 0.2;
    } else if (exerciseKey === 'desenvolvimento' || exerciseKey === 'elevacao_lateral') {
      defaultYaw = 0.35;
      defaultPitch = 0.12;
    } else if (exerciseKey === 'puxada_pulley' || exerciseKey === 'remada_baixa') {
      defaultYaw = 0.85;
      defaultPitch = 0.18;
    } else {
      // standard angled view
      defaultYaw = 0.45;
      defaultPitch = 0.15;
    }
    
    setYaw(defaultYaw);
    setPitch(defaultPitch);
    cameraAngles.current = { yaw: defaultYaw, pitch: defaultPitch };
  };

  // Set default optimal camera on mount/type change
  useEffect(() => {
    resetCamera();
  }, [exerciseKey]);

  // Handle Drag / Swiping to rotate camera
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    const newYaw = cameraAngles.current.yaw + dx * 0.015;
    const newPitch = Math.max(-0.6, Math.min(0.8, cameraAngles.current.pitch + dy * 0.012));
    
    setYaw(newYaw);
    setPitch(newPitch);
    
    dragStart.current = { x: e.clientX, y: e.clientY };
    cameraAngles.current = { yaw: newYaw, pitch: newPitch };
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;
    
    const newYaw = cameraAngles.current.yaw + dx * 0.015;
    const newPitch = Math.max(-0.6, Math.min(0.8, cameraAngles.current.pitch + dy * 0.012));
    
    setYaw(newYaw);
    setPitch(newPitch);
    
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    cameraAngles.current = { yaw: newYaw, pitch: newPitch };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = Date.now();

    // Scale canvas properly for crystal clear display
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 3D perspective projection formula with offset adjustments
    const project = (pt: Point3D, width: number, height: number, customYaw: number, customPitch: number) => {
      const centerX = width / 2;
      const centerY = height / 2 + 12; // Lowered center to give headroom
      const perspective = 240; // focal length
      const distance = 160; // Camera distance from origin

      // Rotate around Y-axis (Yaw)
      const cosY = Math.cos(customYaw);
      const sinY = Math.sin(customYaw);
      let x1 = pt.x * cosY - pt.z * sinY;
      let z1 = pt.x * sinY + pt.z * cosY;

      // Rotate around X-axis (Pitch)
      const cosX = Math.cos(customPitch);
      const sinX = Math.sin(customPitch);
      let y2 = pt.y * cosX - z1 * sinX;
      let z2 = pt.y * sinX + z1 * cosX;

      // Projection scaling factor
      const scale = perspective / (distance + z2);
      
      return {
        x: centerX + x1 * scale,
        y: centerY + y2 * scale,
        depth: z2,
        scale: scale
      };
    };

    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const time = Date.now() - startTime;
      
      // Auto slowly rotate camera when NOT dragging, to give a real dynamic 3D feel
      let activeYaw = cameraAngles.current.yaw;
      if (!isDragging) {
        activeYaw += Math.sin(time * 0.0005) * 0.03; // Slow natural breathing rotation
      }
      const activePitch = cameraAngles.current.pitch;

      // Background clear
      ctx.fillStyle = '#09090b'; // Tailwind slate/zinc-950
      ctx.fillRect(0, 0, width, height);

      // Draw 3D floor grid with fading perspective
      ctx.strokeStyle = 'rgba(39, 39, 42, 0.2)';
      ctx.lineWidth = 1;
      const gridRange = 45;
      const gridSpacing = 15;
      for (let xG = -gridRange; xG <= gridRange; xG += gridSpacing) {
        ctx.beginPath();
        for (let zG = -gridRange; zG <= gridRange; zG += 3) {
          const pt = { x: xG, y: 32, z: zG };
          const proj = project(pt, width, height, activeYaw, activePitch);
          if (zG === -gridRange) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }
      for (let zG = -gridRange; zG <= gridRange; zG += gridSpacing) {
        ctx.beginPath();
        for (let xG = -gridRange; xG <= gridRange; xG += 3) {
          const pt = { x: xG, y: 32, z: zG };
          const proj = project(pt, width, height, activeYaw, activePitch);
          if (xG === -gridRange) ctx.moveTo(proj.x, proj.y);
          else ctx.lineTo(proj.x, proj.y);
        }
        ctx.stroke();
      }

      // Compute joint coordinates based on current physical cycle
      const cycle = (time / 3600) * Math.PI * 2; // ~3.6s cycle
      const phase = (Math.sin(cycle) + 1) / 2; // ranges from 0 (extension) to 1 (contraction)
      
      const joints: JointInfo = {};
      const muscleFocusAreas: { x: number; y: number; z: number; intensity: number; size: number }[] = [];
      
      let isHalteres = nameLower.includes('halteres');

      // PRECISE KINEMATIC SIMULATOR BY EXERCISE KEY
      if (exerciseKey === 'supino_inclinado') {
        // Inclined torso (bench at ~35 degrees)
        const angle = -35 * (Math.PI / 180); // -35 degrees in radians
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        // Map relative points along an inclined line
        const getInclinedPt = (rx: number, ry: number, rz: number) => {
          // ry is distance along the bench incline (z axis of body coordinates)
          // rz is distance perpendicular to the bench (y axis of body coordinates)
          return {
            x: rx,
            y: 10 + ry * sinA + rz * cosA,
            z: ry * cosA - rz * sinA
          };
        };

        joints.hip = getInclinedPt(0, -15, 0);
        joints.lHip = getInclinedPt(-7, -15, 0);
        joints.rHip = getInclinedPt(7, -15, 0);
        
        joints.spine = getInclinedPt(0, 2, 0);
        joints.neck = getInclinedPt(0, 20, 0);
        joints.head = getInclinedPt(0, 28, 0);
        joints.lShoulder = getInclinedPt(-14, 20, 0);
        joints.rShoulder = getInclinedPt(14, 20, 0);

        // Feet planted down on floor
        joints.lKnee = { x: -12, y: 22, z: -18 };
        joints.rKnee = { x: 12, y: 22, z: -18 };
        joints.lFoot = { x: -12, y: 32, z: -14 };
        joints.rFoot = { x: 12, y: 32, z: -14 };

        // Press path is perpendicular to the 35° incline (i.e. pushing "upwards and slightly back")
        // Extension length goes from 6 to 26
        const pressExt = 6 + 20 * phase;
        joints.lHand = getInclinedPt(-18, 20, pressExt);
        joints.rHand = getInclinedPt(18, 20, pressExt);

        // Elbows bend sideways
        const elbowFlare = 20 * (1 - phase * 0.15);
        const elbowOut = 1 + 8 * phase;
        joints.lElbow = getInclinedPt(-elbowFlare, 20, elbowOut);
        joints.rElbow = getInclinedPt(elbowFlare, 20, elbowOut);

        // Muscle focus: Upper pectoral pectorals major (focus of incline!) and anterior deltoids
        muscleFocusAreas.push({ x: -4, y: getInclinedPt(0, 18, 2).y, z: getInclinedPt(0, 18, 2).z, intensity: phase, size: 18 });
        muscleFocusAreas.push({ x: 4, y: getInclinedPt(0, 18, 2).y, z: getInclinedPt(0, 18, 2).z, intensity: phase, size: 18 });
      } 
      else if (exerciseKey === 'supino_reto') {
        // Flat torso (0 degrees horizontal lying)
        const yBench = 13;
        joints.hip = { x: 0, y: yBench, z: -15 };
        joints.lHip = { x: -7, y: yBench, z: -15 };
        joints.rHip = { x: 7, y: yBench, z: -15 };
        joints.spine = { x: 0, y: yBench, z: 2 };
        joints.neck = { x: 0, y: yBench, z: 20 };
        joints.head = { x: 0, y: yBench, z: 28 };
        joints.lShoulder = { x: -14, y: yBench, z: 20 };
        joints.rShoulder = { x: 14, y: yBench, z: 20 };

        joints.lKnee = { x: -12, y: yBench + 10, z: -14 };
        joints.rKnee = { x: 12, y: yBench + 10, z: -14 };
        joints.lFoot = { x: -12, y: 32, z: -10 };
        joints.rFoot = { x: 12, y: 32, z: -10 };

        // Flat vertical press path (purely along Y axis)
        const pressY = yBench - 6 - 22 * phase;
        joints.lHand = { x: -18, y: pressY, z: 20 };
        joints.rHand = { x: 18, y: pressY, z: 20 };

        const elbowFlare = 21 * (1 - phase * 0.15);
        const elbowY = yBench - 1 - 11 * phase;
        joints.lElbow = { x: -elbowFlare, y: elbowY, z: 20 };
        joints.rElbow = { x: elbowFlare, y: elbowY, z: 20 };

        // Muscle focus: Whole chest pectorals
        muscleFocusAreas.push({ x: 0, y: yBench - 3, z: 20, intensity: phase, size: 22 });
      } 
      else if (exerciseKey === 'desenvolvimento') {
        // Seated vertical posture
        joints.hip = { x: 0, y: 15, z: 0 };
        joints.lHip = { x: -7, y: 15, z: 0 };
        joints.rHip = { x: 7, y: 15, z: 0 };
        joints.spine = { x: 0, y: -2, z: -1 };
        joints.neck = { x: 0, y: -18, z: -2 };
        joints.head = { x: 0, y: -26, z: -1 };
        joints.lShoulder = { x: -14, y: -16, z: -2 };
        joints.rShoulder = { x: 14, y: -16, z: -2 };

        // Legs resting comfortably
        joints.lKnee = { x: -10, y: 12, z: 14 };
        joints.rKnee = { x: 10, y: 12, z: 14 };
        joints.lFoot = { x: -10, y: 32, z: 14 };
        joints.rFoot = { x: 10, y: 32, z: 14 };

        // Overhead vertical press path
        const handY = -12 - 25 * phase;
        joints.lHand = { x: -15 + 3 * phase, y: handY, z: -1 };
        joints.rHand = { x: 15 - 3 * phase, y: handY, z: -1 };

        // Elbows moving vertically on side
        const elbowX = -18 + 5 * phase;
        const elbowY = -12 - 10 * phase;
        joints.lElbow = { x: elbowX, y: elbowY, z: -1 };
        joints.rElbow = { x: -elbowX, y: elbowY, z: -1 };

        // Muscle focus: Deltoids (Shoulders) and Triceps
        muscleFocusAreas.push({ x: -14, y: -16, z: -2, intensity: phase, size: 14 });
        muscleFocusAreas.push({ x: 14, y: -16, z: -2, intensity: phase, size: 14 });
      } 
      else if (exerciseKey === 'elevacao_lateral') {
        // Standing upright posture
        joints.hip = { x: 0, y: 2, z: 0 };
        joints.lHip = { x: -7, y: 2, z: 0 };
        joints.rHip = { x: 7, y: 2, z: 0 };
        joints.spine = { x: 0, y: -12, z: 0 };
        joints.neck = { x: 0, y: -26, z: 0 };
        joints.head = { x: 0, y: -34, z: 1 };
        joints.lShoulder = { x: -14, y: -25, z: 0 };
        joints.rShoulder = { x: 14, y: -25, z: 0 };

        joints.lKnee = { x: -7, y: 17, z: 1 };
        joints.rKnee = { x: 7, y: 17, z: 1 };
        joints.lFoot = { x: -7, y: 32, z: 0 };
        joints.rFoot = { x: 7, y: 32, z: 0 };

        // Hands raising in wide lateral arc (Dumbbell)
        const angleLat = (15 + 75 * phase) * (Math.PI / 180);
        const lX = -14 - Math.cos(angleLat) * 24;
        const lY = -25 - Math.sin(angleLat) * 24;
        const rX = 14 + Math.cos(angleLat) * 24;
        const rY = -25 - Math.sin(angleLat) * 24;

        joints.lHand = { x: lX, y: lY, z: 2 * (1-phase) };
        joints.rHand = { x: rX, y: rY, z: 2 * (1-phase) };

        joints.lElbow = { x: (joints.lShoulder.x + lX)/2 - 2, y: (joints.lShoulder.y + lY)/2 + 2, z: 1 };
        joints.rElbow = { x: (joints.rShoulder.x + rX)/2 + 2, y: (joints.rShoulder.y + rY)/2 + 2, z: 1 };

        // Muscle focus: Lateral deltoid
        muscleFocusAreas.push({ x: -15, y: -24, z: 0, intensity: phase, size: 15 });
        muscleFocusAreas.push({ x: 15, y: -24, z: 0, intensity: phase, size: 15 });
      } 
      else if (exerciseKey === 'triceps_polia') {
        // Standing leaning slightly forward
        joints.hip = { x: 0, y: 4, z: -5 };
        joints.lHip = { x: -7, y: 4, z: -5 };
        joints.rHip = { x: 7, y: 4, z: -5 };
        joints.spine = { x: 0, y: -10, z: -2 };
        joints.neck = { x: 0, y: -24, z: 1 };
        joints.head = { x: 0, y: -31, z: 3 };
        joints.lShoulder = { x: -13, y: -23, z: 1 };
        joints.rShoulder = { x: 13, y: -23, z: 1 };

        joints.lKnee = { x: -7, y: 18, z: 4 };
        joints.rKnee = { x: 7, y: 18, z: 4 };
        joints.lFoot = { x: -7, y: 32, z: 2 };
        joints.rFoot = { x: 7, y: 32, z: 2 };

        // Elbows pinned tightly at ribs
        joints.lElbow = { x: -11, y: -11, z: 3 };
        joints.rElbow = { x: 11, y: -11, z: 3 };

        // Hands pressing down extending forearms
        const handY = -12 + 22 * phase;
        const handZ = 8 + 8 * phase;
        joints.lHand = { x: -10, y: handY, z: handZ };
        joints.rHand = { x: 10, y: handY, z: handZ };

        // Muscle focus: Triceps Brachii (back of arms)
        muscleFocusAreas.push({ x: -13, y: -17, z: 2, intensity: phase, size: 12 });
        muscleFocusAreas.push({ x: 13, y: -17, z: 2, intensity: phase, size: 12 });
      }
      else if (exerciseKey === 'triceps_testa') {
        // Lying on flat bench, pulling arms back slightly, elbow stationary, forearm folding
        const yBench = 13;
        joints.hip = { x: 0, y: yBench, z: -15 };
        joints.lHip = { x: -7, y: yBench, z: -15 };
        joints.rHip = { x: 7, y: yBench, z: -15 };
        joints.spine = { x: 0, y: yBench, z: 2 };
        joints.neck = { x: 0, y: yBench, z: 20 };
        joints.head = { x: 0, y: yBench, z: 28 };
        joints.lShoulder = { x: -14, y: yBench, z: 20 };
        joints.rShoulder = { x: 14, y: yBench, z: 20 };

        joints.lKnee = { x: -12, y: yBench + 10, z: -14 };
        joints.rKnee = { x: 12, y: yBench + 10, z: -14 };
        joints.lFoot = { x: -12, y: 32, z: -10 };
        joints.rFoot = { x: 12, y: 32, z: -10 };

        // Elbows stationary, pointed slightly backwards over the face
        joints.lElbow = { x: -14, y: yBench - 16, z: 25 };
        joints.rElbow = { x: 14, y: yBench - 16, z: 25 };

        // Forearms flexion/extension towards forehead
        const angleArm = (-30 + 110 * (1 - phase)) * (Math.PI / 180);
        joints.lHand = { 
          x: -14, 
          y: joints.lElbow.y + Math.sin(angleArm) * 16, 
          z: joints.lElbow.z - Math.cos(angleArm) * 16 
        };
        joints.rHand = { 
          x: 14, 
          y: joints.rElbow.y + Math.sin(angleArm) * 16, 
          z: joints.rElbow.z - Math.cos(angleArm) * 16 
        };

        // Triceps focus
        muscleFocusAreas.push({ x: -14, y: yBench - 8, z: 22, intensity: phase, size: 12 });
        muscleFocusAreas.push({ x: 14, y: yBench - 8, z: 22, intensity: phase, size: 12 });
      }
      else if (exerciseKey === 'triceps_dips_banco') {
        // Seated on edge of bench, hips sliding down/up
        const benchY = 16;
        const dipY = benchY + 12 * (1 - phase);
        joints.hip = { x: 0, y: dipY, z: 8 };
        joints.lHip = { x: -7, y: dipY, z: 8 };
        joints.rHip = { x: 7, y: dipY, z: 8 };

        joints.spine = { x: 0, y: dipY - 14, z: 7 };
        joints.neck = { x: 0, y: dipY - 24, z: 6 };
        joints.head = { x: 0, y: dipY - 31, z: 7 };
        joints.lShoulder = { x: -13, y: dipY - 22, z: 6 };
        joints.rShoulder = { x: 13, y: dipY - 22, z: 6 };

        // Feet extended front
        joints.lKnee = { x: -8, y: dipY + 6, z: 24 };
        joints.rKnee = { x: 8, y: dipY + 6, z: 24 };
        joints.lFoot = { x: -8, y: 32, z: 30 };
        joints.rFoot = { x: 8, y: 32, z: 30 };

        // Hands fixed back on bench edge (Y is fixed, Z is fixed)
        joints.lHand = { x: -15, y: benchY, z: 2 };
        joints.rHand = { x: 15, y: benchY, z: 2 };

        // Elbows bending backwards
        joints.lElbow = { x: -16, y: (joints.lShoulder.y + joints.lHand.y)/2 + 2 * (1-phase), z: -2 - 4 * (1-phase) };
        joints.rElbow = { x: 16, y: (joints.rShoulder.y + joints.rHand.y)/2 + 2 * (1-phase), z: -2 - 4 * (1-phase) };

        // Triceps focus
        muscleFocusAreas.push({ x: -14, y: dipY - 12, z: 4, intensity: phase, size: 12 });
        muscleFocusAreas.push({ x: 14, y: dipY - 12, z: 4, intensity: phase, size: 12 });
      }
      else if (exerciseKey === 'crucifixo') {
        // Wide fly motion (could be standing cross or flat chest fly)
        // Let's draw flat chest fly for supreme clarity
        const yBench = 13;
        joints.hip = { x: 0, y: yBench, z: -15 };
        joints.lHip = { x: -7, y: yBench, z: -15 };
        joints.rHip = { x: 7, y: yBench, z: -15 };
        joints.spine = { x: 0, y: yBench, z: 2 };
        joints.neck = { x: 0, y: yBench, z: 20 };
        joints.head = { x: 0, y: yBench, z: 28 };
        joints.lShoulder = { x: -14, y: yBench, z: 20 };
        joints.rShoulder = { x: 14, y: yBench, z: 20 };

        joints.lKnee = { x: -12, y: yBench + 10, z: -14 };
        joints.rKnee = { x: 12, y: yBench + 10, z: -14 };
        joints.lFoot = { x: -12, y: 32, z: -10 };
        joints.rFoot = { x: 12, y: 32, z: -10 };

        // Hands sweep in a semi-circular lateral arc
        const flyAngle = (10 + 70 * (1 - phase)) * (Math.PI / 180); // 10 to 80 degrees
        const fX = Math.cos(flyAngle) * 22;
        const fY = yBench - 4 - Math.sin(flyAngle) * 22;

        joints.lHand = { x: -fX, y: fY, z: 20 };
        joints.rHand = { x: fX, y: fY, z: 20 };

        // Elbows slightly bent to prevent locking
        joints.lElbow = { x: -fX * 0.7 - 4, y: fY + 2, z: 20 };
        joints.rElbow = { x: fX * 0.7 + 4, y: fY + 2, z: 20 };

        // Outer chest focus
        muscleFocusAreas.push({ x: -10, y: yBench - 2, z: 20, intensity: phase, size: 16 });
        muscleFocusAreas.push({ x: 10, y: yBench - 2, z: 20, intensity: phase, size: 16 });
      }
      else if (exerciseKey === 'puxada_pulley') {
        // Seated pull down position
        joints.hip = { x: 0, y: 15, z: -5 };
        joints.lHip = { x: -7, y: 15, z: -5 };
        joints.rHip = { x: 7, y: 15, z: -5 };
        joints.spine = { x: 0, y: -3, z: -6 };
        joints.neck = { x: 0, y: -19, z: -7 };
        joints.head = { x: 0, y: -27, z: -6 };
        joints.lShoulder = { x: -14, y: -17, z: -7 };
        joints.rShoulder = { x: 14, y: -17, z: -7 };

        joints.lKnee = { x: -8, y: 10, z: 14 };
        joints.rKnee = { x: 8, y: 10, z: 14 };
        joints.lFoot = { x: -8, y: 32, z: 14 };
        joints.rFoot = { x: 8, y: 32, z: 14 };

        // Pull down bar vertical path
        const barY = -42 + 24 * phase;
        joints.lHand = { x: -22, y: barY, z: -2 };
        joints.rHand = { x: 22, y: barY, z: -2 };

        // Elbows pulling down and backwards
        const elbowX = -17 + 8 * phase;
        const elbowY = -21 + 27 * phase;
        const elbowZ = -8 - 7 * phase;
        joints.lElbow = { x: elbowX, y: elbowY, z: elbowZ };
        joints.rElbow = { x: -elbowX, y: elbowY, z: elbowZ };

        // Muscle focus: Latissimus Dorsi (Outer back) and biceps
        muscleFocusAreas.push({ x: -11, y: -8, z: -10, intensity: phase, size: 18 });
        muscleFocusAreas.push({ x: 11, y: -8, z: -10, intensity: phase, size: 18 });
      } 
      else if (exerciseKey === 'remada_baixa') {
        // Seated cable row pulling horizontally
        joints.hip = { x: 0, y: 16, z: -12 };
        joints.lHip = { x: -7, y: 16, z: -12 };
        joints.rHip = { x: 7, y: 16, z: -12 };
        
        // Torso leaning slightly back/forward
        const leanForward = 6 * (1 - phase);
        joints.spine = { x: 0, y: 0, z: -12 + leanForward };
        joints.neck = { x: 0, y: -16, z: -12 + leanForward * 1.5 };
        joints.head = { x: 0, y: -24, z: -11 + leanForward * 1.5 };
        joints.lShoulder = { x: -13, y: -14, z: -12 + leanForward * 1.5 };
        joints.rShoulder = { x: 13, y: -14, z: -12 + leanForward * 1.5 };

        // Legs extended slightly bent
        joints.lKnee = { x: -10, y: 18, z: 10 };
        joints.rKnee = { x: 10, y: 18, z: 10 };
        joints.lFoot = { x: -10, y: 26, z: 24 };
        joints.rFoot = { x: 10, y: 26, z: 24 };

        // Hands pulling grip horizontally (Z = 16 (extension) to -6 (retraction))
        const gripZ = 18 - 25 * phase;
        joints.lHand = { x: -4, y: -8, z: gripZ };
        joints.rHand = { x: 4, y: -8, z: gripZ };

        // Elbows pulling backwards
        const elbZ = 12 - 20 * phase;
        joints.lElbow = { x: -12 + 6 * phase, y: -10, z: elbZ };
        joints.rElbow = { x: 12 - 6 * phase, y: -10, z: elbZ };

        // Muscle focus: Trapezius, Rhomboids, Lats
        muscleFocusAreas.push({ x: 0, y: -8, z: -13 + leanForward, intensity: phase, size: 18 });
      }
      else if (exerciseKey === 'remada_curvada' || exerciseKey === 'remada_unilateral') {
        // Bent over position
        joints.hip = { x: 0, y: 10, z: -12 };
        joints.lHip = { x: -7, y: 10, z: -12 };
        joints.rHip = { x: 7, y: 10, z: -12 };

        // Spine parallel/inclined to floor
        joints.spine = { x: 0, y: 6, z: 4 };
        joints.neck = { x: 0, y: 2, z: 18 };
        joints.head = { x: 0, y: 0, z: 25 };
        joints.lShoulder = { x: -13, y: 2, z: 18 };
        joints.rShoulder = { x: 13, y: 2, z: 18 };

        joints.lKnee = { x: -10, y: 22, z: -10 };
        joints.rKnee = { x: 10, y: 22, z: -10 };
        joints.lFoot = { x: -10, y: 32, z: -6 };
        joints.rFoot = { x: 10, y: 32, z: -6 };

        // Pulling vertical (Y from 20 down to 4)
        const pullY = 22 - 18 * phase;
        joints.lHand = { x: -12, y: pullY, z: 16 };
        joints.rHand = { x: 12, y: pullY, z: 16 };

        // Elbows pulling high up above the spine line
        const elbY = 16 - 15 * phase;
        joints.lElbow = { x: -15, y: elbY, z: 17 };
        joints.rElbow = { x: 15, y: elbY, z: 17 };

        // Middle back focus
        muscleFocusAreas.push({ x: -7, y: 4, z: 10, intensity: phase, size: 15 });
        muscleFocusAreas.push({ x: 7, y: 4, z: 10, intensity: phase, size: 15 });
      }
      else if (exerciseKey === 'rosca_biceps') {
        // Standing curls
        joints.hip = { x: 0, y: 2, z: 0 };
        joints.lHip = { x: -7, y: 2, z: 0 };
        joints.rHip = { x: 7, y: 2, z: 0 };
        joints.spine = { x: 0, y: -12, z: 0 };
        joints.neck = { x: 0, y: -26, z: 0 };
        joints.head = { x: 0, y: -34, z: 1 };
        joints.lShoulder = { x: -14, y: -25, z: 0 };
        joints.rShoulder = { x: 14, y: -25, z: 0 };

        joints.lKnee = { x: -7, y: 17, z: 1 };
        joints.rKnee = { x: 7, y: 17, z: 1 };
        joints.lFoot = { x: -7, y: 32, z: 0 };
        joints.rFoot = { x: 7, y: 32, z: 0 };

        // Elbows pinned stationary at ribcage
        joints.lElbow = { x: -12, y: -12, z: 1 };
        joints.rElbow = { x: 12, y: -12, z: 1 };

        // Hands curling upwards (Y from -12 down to -24)
        const curlY = -10 - 14 * phase;
        const curlZ = 12 * phase;
        joints.lHand = { x: -13, y: curlY, z: curlZ };
        joints.rHand = { x: 13, y: curlY, z: curlZ };

        // Bicep muscle focus (front of arm)
        muscleFocusAreas.push({ x: -13, y: -18, z: 3, intensity: phase, size: 12 });
        muscleFocusAreas.push({ x: 13, y: -18, z: 3, intensity: phase, size: 12 });
      }
      else if (exerciseKey === 'leg_press') {
        // Reclined at 45 degrees, pushing sled
        joints.hip = { x: 0, y: 20, z: -18 };
        joints.lHip = { x: -7, y: 20, z: -18 };
        joints.rHip = { x: 7, y: 20, z: -18 };
        
        joints.spine = { x: 0, y: 10, z: -28 };
        joints.neck = { x: 0, y: -2, z: -35 };
        joints.head = { x: 0, y: -8, z: -36 };
        joints.lShoulder = { x: -12, y: 2, z: -35 };
        joints.rShoulder = { x: 12, y: 2, z: -35 };

        // Hands holding support handles on seat
        joints.lHand = { x: -14, y: 18, z: -18 };
        joints.rHand = { x: 14, y: 18, z: -18 };
        joints.lElbow = { x: -15, y: 10, z: -24 };
        joints.rElbow = { x: 15, y: 10, z: -24 };

        // Legs pushing along 45 degree path (Y and Z both changing)
        // Extension length goes from 5 (fully bent) to 26 (fully extended)
        const legExt = 5 + 23 * phase;
        const legY = 20 - legExt * Math.sin(Math.PI/4);
        const legZ = -18 + legExt * Math.cos(Math.PI/4);

        joints.lFoot = { x: -10, y: legY, z: legZ };
        joints.rFoot = { x: 10, y: legY, z: legZ };

        // Knees bending laterally out of the way
        const kneeY = (20 + legY)/2 + 4 * (1 - phase);
        const kneeZ = (-18 + legZ)/2 - 7 * (1 - phase);
        joints.lKnee = { x: -15 + 4*phase, y: kneeY, z: kneeZ };
        joints.rKnee = { x: 15 - 4*phase, y: kneeY, z: kneeZ };

        // Muscle focus: Quadriceps, Gluteus, and Calves
        muscleFocusAreas.push({ x: -12, y: (joints.lHip.y + kneeY)/2, z: (joints.lHip.z + kneeZ)/2, intensity: phase, size: 20 });
        muscleFocusAreas.push({ x: 12, y: (joints.rHip.y + kneeY)/2, z: (joints.rHip.z + kneeZ)/2, intensity: phase, size: 20 });
      }
      else if (exerciseKey === 'extensora') {
        // Seated upright, leg kicking forwards
        joints.hip = { x: 0, y: 14, z: -8 };
        joints.lHip = { x: -7, y: 14, z: -8 };
        joints.rHip = { x: 7, y: 14, z: -8 };
        
        joints.spine = { x: 0, y: -4, z: -12 };
        joints.neck = { x: 0, y: -19, z: -13 };
        joints.head = { x: 0, y: -27, z: -11 };
        joints.lShoulder = { x: -13, y: -17, z: -13 };
        joints.rShoulder = { x: 13, y: -17, z: -13 };
        
        // Hands holding bench handles
        joints.lHand = { x: -14, y: 14, z: -4 };
        joints.rHand = { x: 14, y: 14, z: -4 };
        joints.lElbow = { x: -15, y: 6, z: -8 };
        joints.rElbow = { x: 15, y: 6, z: -8 };

        // Stationary knees
        joints.lKnee = { x: -10, y: 14, z: 12 };
        joints.rKnee = { x: 10, y: 14, z: 12 };

        // Kicking foot: rotates from vertical hanging (Y=32, Z=12) to horizontal extension (Y=14, Z=28)
        const kickAngle = (0 + 80 * phase) * (Math.PI / 180);
        const fY = 14 + Math.cos(kickAngle) * 17;
        const fZ = 12 + Math.sin(kickAngle) * 17;

        joints.lFoot = { x: -10, y: fY, z: fZ };
        joints.rFoot = { x: 10, y: fY, z: fZ };

        // Muscle focus: Quadriceps (glowing red upper thigh)
        muscleFocusAreas.push({ x: -9, y: 10, z: 2, intensity: phase, size: 16 });
        muscleFocusAreas.push({ x: 9, y: 10, z: 2, intensity: phase, size: 16 });
      }
      else if (exerciseKey === 'flexora') {
        // Seated or lying leg curls. Let's do lying leg curls (mesa flexora) for dramatic variance
        const yBench = 14;
        joints.hip = { x: 0, y: yBench, z: -5 };
        joints.lHip = { x: -7, y: yBench, z: -5 };
        joints.rHip = { x: 7, y: yBench, z: -5 };
        
        joints.spine = { x: 0, y: yBench - 4, z: -18 };
        joints.neck = { x: 0, y: yBench - 8, z: -32 };
        joints.head = { x: 0, y: yBench - 12, z: -38 };
        
        joints.lShoulder = { x: -13, y: yBench - 6, z: -32 };
        joints.rShoulder = { x: 13, y: yBench - 6, z: -32 };
        joints.lHand = { x: -10, y: yBench + 6, z: -34 };
        joints.rHand = { x: 10, y: yBench + 6, z: -34 };
        joints.lElbow = { x: -15, y: yBench, z: -34 };
        joints.rElbow = { x: 15, y: yBench, z: -34 };

        // Knee is anchored stationary
        joints.lKnee = { x: -9, y: yBench + 2, z: 12 };
        joints.rKnee = { x: 9, y: yBench + 2, z: 12 };

        // Leg curls from horizontal straight (Y=16, Z=28) to vertical contracted (Y=1, Z=12)
        const curlAngle = (0 + 90 * phase) * (Math.PI / 180);
        const legY = yBench + 2 - Math.sin(curlAngle) * 16;
        const legZ = 12 + Math.cos(curlAngle) * 16;

        joints.lFoot = { x: -9, y: legY, z: legZ };
        joints.rFoot = { x: 9, y: legY, z: legZ };

        // Muscle focus: Hamstrings (Posterior back of thigh)
        muscleFocusAreas.push({ x: -9, y: yBench - 2, z: 3, intensity: phase, size: 16 });
        muscleFocusAreas.push({ x: 9, y: yBench - 2, z: 3, intensity: phase, size: 16 });
      }
      else if (exerciseKey === 'agachamento') {
        // Leg Squatting animation
        joints.lFoot = { x: -12, y: 32, z: 0 };
        joints.rFoot = { x: 12, y: 32, z: 0 };
        
        // Hips sink down and push backwards
        const hipY = 8 + 18 * phase;
        const hipZ = -5 - 14 * phase;
        joints.hip = { x: 0, y: hipY, z: hipZ };
        joints.lHip = { x: -7, y: hipY, z: hipZ };
        joints.rHip = { x: 7, y: hipY, z: hipZ };

        // Knees bend forward
        const kneeY = 20 + 4 * phase;
        const kneeZ = 10 + 6 * phase;
        joints.lKnee = { x: -11, y: kneeY, z: kneeZ };
        joints.rKnee = { x: 11, y: kneeY, z: kneeZ };

        // Spine and head leaning slightly forward
        const spineY = hipY - 18;
        const spineZ = hipZ + 2 + 5 * phase;
        joints.spine = { x: 0, y: spineY, z: spineZ };

        const neckY = spineY - 16;
        const neckZ = spineZ + 3 + 5 * phase;
        joints.neck = { x: 0, y: neckY, z: neckZ };
        joints.head = { x: 0, y: neckY - 8, z: neckZ + 2 };

        joints.lShoulder = { x: -13, y: neckY + 2, z: neckZ };
        joints.rShoulder = { x: 13, y: neckY + 2, z: neckZ };

        // Arms reach forward for balance (unless barbell squat)
        joints.lHand = { x: -12, y: neckY - 2, z: neckZ + 20 };
        joints.rHand = { x: 12, y: neckY - 2, z: neckZ + 20 };
        joints.lElbow = { x: -13, y: neckY, z: neckZ + 10 };
        joints.rElbow = { x: 13, y: neckY, z: neckZ + 10 };

        // Quadriceps & Gluteus focus
        muscleFocusAreas.push({ x: -10, y: (hipY + kneeY) / 2, z: (hipZ + kneeZ) / 2, intensity: phase, size: 24 });
        muscleFocusAreas.push({ x: 10, y: (hipY + kneeY) / 2, z: (hipZ + kneeZ) / 2, intensity: phase, size: 24 });
      }
      else if (exerciseKey === 'elevacao_pelvica') {
        // Lying, back shoulder supported on bench/floor, hips thrusting up to high bridge
        joints.lFoot = { x: -10, y: 32, z: 12 };
        joints.rFoot = { x: 10, y: 32, z: 12 };

        // Shoulders fixed on bench (Y=18, Z=-20)
        joints.neck = { x: 0, y: 18, z: -20 };
        joints.head = { x: 0, y: 18, z: -27 };
        joints.lShoulder = { x: -13, y: 18, z: -20 };
        joints.rShoulder = { x: 13, y: 18, z: -20 };
        joints.spine = { x: 0, y: 18, z: -10 };

        // Hips rise up (contraction: high horizontal line Y=18; extension: dropped low Y=30)
        const thrustY = 30 - 12 * phase;
        joints.hip = { x: 0, y: thrustY, z: 0 };
        joints.lHip = { x: -7, y: thrustY, z: 0 };
        joints.rHip = { x: 7, y: thrustY, z: 0 };

        // Knees bending dynamically
        joints.lKnee = { x: -9, y: 22 - 2 * phase, z: 10 };
        joints.rKnee = { x: 9, y: 22 - 2 * phase, z: 10 };

        joints.lHand = { x: -12, y: thrustY - 4, z: 2 };
        joints.rHand = { x: 12, y: thrustY - 4, z: 2 };
        joints.lElbow = { x: -14, y: thrustY, z: -2 };
        joints.rElbow = { x: 14, y: thrustY, z: -2 };

        // Muscle focus: Gluteus Maximus & Hamstrings
        muscleFocusAreas.push({ x: 0, y: thrustY + 4, z: -5, intensity: phase, size: 24 });
      }
      else if (exerciseKey === 'panturrilha') {
        // Standing raising heels
        joints.hip = { x: 0, y: 2, z: 0 };
        joints.lHip = { x: -7, y: 2, z: 0 };
        joints.rHip = { x: 7, y: 2, z: 0 };
        joints.spine = { x: 0, y: -12, z: 0 };
        joints.neck = { x: 0, y: -26, z: 0 };
        joints.head = { x: 0, y: -34, z: 1 };
        joints.lShoulder = { x: -14, y: -25, z: 0 };
        joints.rShoulder = { x: 14, y: -25, z: 0 };

        // Hands resting on waist
        joints.lHand = { x: -11, y: 1, z: 2 };
        joints.rHand = { x: 11, y: 1, z: 2 };
        joints.lElbow = { x: -14, y: -5, z: -2 };
        joints.rElbow = { x: 14, y: -5, z: -2 };

        // Heel lift (body rises by 3.5 units)
        const riseY = -3.5 * phase;
        joints.hip.y += riseY;
        joints.lHip.y += riseY;
        joints.rHip.y += riseY;
        joints.spine.y += riseY;
        joints.neck.y += riseY;
        joints.head.y += riseY;
        joints.lShoulder.y += riseY;
        joints.rShoulder.y += riseY;
        joints.lHand.y += riseY;
        joints.rHand.y += riseY;
        joints.lElbow.y += riseY;
        joints.rElbow.y += riseY;

        joints.lKnee = { x: -7, y: 15 + riseY, z: 1 };
        joints.rKnee = { x: 7, y: 15 + riseY, z: 1 };

        // Toes stationary on floor, heels rise
        joints.lFoot = { x: -7, y: 32, z: 0 };
        joints.rFoot = { x: 7, y: 32, z: 0 };

        // Muscle focus: Calves (Soleus / Gastrocnemius)
        muscleFocusAreas.push({ x: -7, y: 24, z: -2, intensity: phase, size: 12 });
        muscleFocusAreas.push({ x: 7, y: 24, z: -2, intensity: phase, size: 12 });
      }
      else if (exerciseKey === 'prancha') {
        // Horizontal straight line (static)
        joints.lFoot = { x: -6, y: 27, z: 24 };
        joints.rFoot = { x: 6, y: 27, z: 24 };

        const hoverY = 19;
        joints.hip = { x: 0, y: hoverY, z: 6 };
        joints.lHip = { x: -6, y: hoverY, z: 6 };
        joints.rHip = { x: 6, y: hoverY, z: 6 };

        joints.spine = { x: 0, y: hoverY - 1, z: -6 };
        joints.neck = { x: 0, y: hoverY - 2, z: -18 };
        joints.head = { x: 0, y: hoverY - 4, z: -25 };
        
        joints.lShoulder = { x: -11, y: hoverY - 2, z: -18 };
        joints.rShoulder = { x: 11, y: hoverY - 2, z: -18 };

        // Supported on elbows
        joints.lElbow = { x: -11, y: 29, z: -18 };
        joints.rElbow = { x: 11, y: 29, z: -18 };
        joints.lHand = { x: -6, y: 29, z: -28 };
        joints.rHand = { x: 6, y: 29, z: -28 };

        joints.lKnee = { x: -6, y: 23, z: 16 };
        joints.rKnee = { x: 6, y: 23, z: 16 };

        // Static core activation pulse
        const corePulse = (Math.sin(time * 0.005) + 1)/2;
        muscleFocusAreas.push({ x: 0, y: hoverY + 2, z: -1, intensity: 0.6 + corePulse * 0.4, size: 24 });
      }
      else if (exerciseKey === 'abdominal') {
        // Floor crunches
        joints.hip = { x: 0, y: 22, z: -10 };
        joints.lHip = { x: -7, y: 22, z: -10 };
        joints.rHip = { x: 7, y: 22, z: -10 };

        joints.lKnee = { x: -8, y: 10, z: 8 };
        joints.rKnee = { x: 8, y: 10, z: 8 };
        joints.lFoot = { x: -8, y: 22, z: 22 };
        joints.rFoot = { x: 8, y: 22, z: 22 };

        // Shoulders rise up
        const torsoY = 22 - 14 * phase;
        const torsoZ = -30 + 10 * phase;
        joints.spine = { x: 0, y: (22 + torsoY) / 2, z: (-10 + torsoZ) / 2 };
        joints.neck = { x: 0, y: torsoY, z: torsoZ };
        joints.head = { x: 0, y: torsoY - 5, z: torsoZ + 2 };

        joints.lShoulder = { x: -12, y: torsoY + 2, z: torsoZ };
        joints.rShoulder = { x: 12, y: torsoY + 2, z: torsoZ };

        joints.lHand = { x: -5, y: torsoY - 4, z: torsoZ - 2 };
        joints.rHand = { x: 5, y: torsoY - 4, z: torsoZ - 2 };
        joints.lElbow = { x: -15, y: torsoY + 2, z: torsoZ - 4 };
        joints.rElbow = { x: 15, y: torsoY + 2, z: torsoZ - 4 };

        // Abs focus
        muscleFocusAreas.push({ x: 0, y: 17 - 5 * phase, z: -10 + 4 * phase, intensity: phase, size: 24 });
      } 
      else if (exerciseKey === 'corrida') {
        // Dynamic running loop
        const runBounce = Math.sin(cycle * 2) * 2.8;
        const lGate = Math.sin(cycle);
        const rGate = Math.sin(cycle + Math.PI);

        joints.hip = { x: 0, y: 6 + runBounce, z: 0 };
        joints.lHip = { x: -6, y: 6 + runBounce, z: 0 };
        joints.rHip = { x: 6, y: 6 + runBounce, z: 0 };

        joints.spine = { x: 0, y: -10 + runBounce, z: 1 };
        joints.neck = { x: 0, y: -24 + runBounce, z: 3 };
        joints.head = { x: 0, y: -31 + runBounce, z: 4 };

        joints.lShoulder = { x: -12, y: -22 + runBounce, z: 3 };
        joints.rShoulder = { x: 12, y: -22 + runBounce, z: 3 };

        joints.lKnee = { x: -6, y: 16 + Math.cos(cycle) * 3, z: lGate * 12 };
        joints.rKnee = { x: 6, y: 16 + Math.cos(cycle + Math.PI) * 3, z: rGate * 12 };

        joints.lFoot = { x: -6, y: 32 + Math.cos(cycle) * 1.5, z: lGate * 18 };
        joints.rFoot = { x: 6, y: 32 + Math.cos(cycle + Math.PI) * 1.5, z: rGate * 18 };

        joints.lElbow = { x: -15, y: -12 + runBounce, z: rGate * 8 - 4 };
        joints.rElbow = { x: 15, y: -12 + runBounce, z: lGate * 8 - 4 };

        joints.lHand = { x: -10, y: -13 + runBounce, z: rGate * 14 + 6 };
        joints.rHand = { x: 10, y: -13 + runBounce, z: lGate * 14 + 6 };

        // Cardio beat
        muscleFocusAreas.push({ x: 0, y: -16 + runBounce, z: 3, intensity: (Math.sin(cycle * 3.5) + 1) / 2, size: 22 });
      }
      else {
        // Generic fallback workout
        const runBounce = Math.sin(cycle * 2) * 1.5;
        joints.hip = { x: 0, y: 10 + runBounce, z: 0 };
        joints.lHip = { x: -7, y: 10 + runBounce, z: 0 };
        joints.rHip = { x: 7, y: 10 + runBounce, z: 0 };

        joints.spine = { x: 0, y: -4 + runBounce, z: 0 };
        joints.neck = { x: 0, y: -18 + runBounce, z: 0 };
        joints.head = { x: 0, y: -25 + runBounce, z: 1 };
        joints.lShoulder = { x: -13, y: -16 + runBounce, z: 0 };
        joints.rShoulder = { x: 13, y: -16 + runBounce, z: 0 };

        joints.lKnee = { x: -9, y: 20 + runBounce + 4 * phase, z: 4 * (1-phase) };
        joints.rKnee = { x: 9, y: 20 + runBounce + 4 * phase, z: -4 * (1-phase) };

        joints.lFoot = { x: -9, y: 32, z: 2 * (1-phase) };
        joints.rFoot = { x: 9, y: 32, z: -2 * (1-phase) };

        joints.lHand = { x: -15, y: -10 - 8*phase, z: 8*phase };
        joints.rHand = { x: 15, y: -10 - 8*phase, z: -8*phase };
        joints.lElbow = { x: -16, y: -12 + 2*phase, z: 2*phase };
        joints.rElbow = { x: 16, y: -12 + 2*phase, z: -2*phase };

        // Active segment focus
        muscleFocusAreas.push({ x: 0, y: -2 + runBounce, z: 0, intensity: phase, size: 18 });
      }

      // Project all 3D joints to 2D screen coordinate space
      const projected: { [key: string]: { x: number; y: number; depth: number; scale: number } } = {};
      Object.keys(joints).forEach((key) => {
        projected[key] = project(joints[key], width, height, activeYaw, activePitch);
      });

      // RENDER 3D EQUIPMENT SUPPORT GEOMETRY (Bench, sled, pulley cables)
      if (exerciseKey === 'supino_inclinado' && projected.lHand && projected.rHand) {
        // Draw the Incline Gym Bench structure support
        const angle = -35 * (Math.PI / 180);
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const getIncline = (ry: number, rz: number) => ({
          x: 0,
          y: 10 + ry * sinA + rz * cosA,
          z: ry * cosA - rz * sinA
        });

        // 4 corners of bench back pad
        const bp1 = project({ ...getIncline(-25, 2), x: -7.5 }, width, height, activeYaw, activePitch);
        const bp2 = project({ ...getIncline(-25, 2), x: 7.5 }, width, height, activeYaw, activePitch);
        const bp3 = project({ ...getIncline(28, 2), x: 7.5 }, width, height, activeYaw, activePitch);
        const bp4 = project({ ...getIncline(28, 2), x: -7.5 }, width, height, activeYaw, activePitch);

        ctx.beginPath();
        ctx.moveTo(bp1.x, bp1.y);
        ctx.lineTo(bp2.x, bp2.y);
        ctx.lineTo(bp3.x, bp3.y);
        ctx.lineTo(bp4.x, bp4.y);
        ctx.closePath();
        ctx.fillStyle = '#111115';
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 2.0;
        ctx.fill();
        ctx.stroke();

        // 4 corners of horizontal seat pad (extending forward from incline base)
        const seat1 = project({ x: -7.5, y: 22, z: -10 }, width, height, activeYaw, activePitch);
        const seat2 = project({ x: 7.5, y: 22, z: -10 }, width, height, activeYaw, activePitch);
        const seat3 = project({ x: 7.5, y: 22, z: -20 }, width, height, activeYaw, activePitch);
        const seat4 = project({ x: -7.5, y: 22, z: -20 }, width, height, activeYaw, activePitch);

        ctx.beginPath();
        ctx.moveTo(seat1.x, seat1.y);
        ctx.lineTo(seat2.x, seat2.y);
        ctx.lineTo(seat3.x, seat3.y);
        ctx.lineTo(seat4.x, seat4.y);
        ctx.closePath();
        ctx.fillStyle = '#18181b';
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1.8;
        ctx.fill();
        ctx.stroke();

        // Bench stands (3D vertical support beams)
        const stand1Bottom = project({ x: 0, y: 32, z: -5 }, width, height, activeYaw, activePitch);
        const stand1Top = project({ ...getIncline(-5, 0), x: 0 }, width, height, activeYaw, activePitch);
        ctx.beginPath();
        ctx.moveTo(stand1Bottom.x, stand1Bottom.y);
        ctx.lineTo(stand1Top.x, stand1Top.y);
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Incline upright barbell racks (taller because it's incline!)
        const rackLeftBottom = project({ x: -14, y: 32, z: 12 }, width, height, activeYaw, activePitch);
        const rackLeftTop = project({ x: -14, y: -12, z: 12 }, width, height, activeYaw, activePitch);
        const rackRightBottom = project({ x: 14, y: 32, z: 12 }, width, height, activeYaw, activePitch);
        const rackRightTop = project({ x: 14, y: -12, z: 12 }, width, height, activeYaw, activePitch);

        ctx.beginPath();
        ctx.moveTo(rackLeftBottom.x, rackLeftBottom.y);
        ctx.lineTo(rackLeftTop.x, rackLeftTop.y);
        ctx.moveTo(rackRightBottom.x, rackRightBottom.y);
        ctx.lineTo(rackRightTop.x, rackRightTop.y);
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 4.0;
        ctx.stroke();
      } 
      else if (exerciseKey === 'supino_reto' && projected.lHand && projected.rHand) {
        // Draw Flat Gym Bench structure
        const bp1 = project({ x: -7.5, y: 13.5, z: -25 }, width, height, activeYaw, activePitch);
        const bp2 = project({ x: 7.5, y: 13.5, z: -25 }, width, height, activeYaw, activePitch);
        const bp3 = project({ x: 7.5, y: 13.5, z: 28 }, width, height, activeYaw, activePitch);
        const bp4 = project({ x: -7.5, y: 13.5, z: 28 }, width, height, activeYaw, activePitch);

        ctx.beginPath();
        ctx.moveTo(bp1.x, bp1.y);
        ctx.lineTo(bp2.x, bp2.y);
        ctx.lineTo(bp3.x, bp3.y);
        ctx.lineTo(bp4.x, bp4.y);
        ctx.closePath();
        ctx.fillStyle = '#111115'; // Dark leather texture
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 2.0;
        ctx.fill();
        ctx.stroke();

        // 3D vertical bench support legs to the floor (y = 32)
        const stand1Bottom = project({ x: 0, y: 32, z: -20 }, width, height, activeYaw, activePitch);
        const stand1Top = project({ x: 0, y: 13.5, z: -20 }, width, height, activeYaw, activePitch);
        const stand2Bottom = project({ x: 0, y: 32, z: 20 }, width, height, activeYaw, activePitch);
        const stand2Top = project({ x: 0, y: 13.5, z: 20 }, width, height, activeYaw, activePitch);

        ctx.beginPath();
        ctx.moveTo(stand1Bottom.x, stand1Bottom.y);
        ctx.lineTo(stand1Top.x, stand1Top.y);
        ctx.moveTo(stand2Bottom.x, stand2Bottom.y);
        ctx.lineTo(stand2Top.x, stand2Top.y);
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Heavy vertical rack stands for the barbell (positioned around shoulders z = 20)
        const rackLeftBottom = project({ x: -14, y: 32, z: 20 }, width, height, activeYaw, activePitch);
        const rackLeftTop = project({ x: -14, y: -4, z: 20 }, width, height, activeYaw, activePitch);
        const rackRightBottom = project({ x: 14, y: 32, z: 20 }, width, height, activeYaw, activePitch);
        const rackRightTop = project({ x: 14, y: -4, z: 20 }, width, height, activeYaw, activePitch);

        ctx.beginPath();
        ctx.moveTo(rackLeftBottom.x, rackLeftBottom.y);
        ctx.lineTo(rackLeftTop.x, rackLeftTop.y);
        ctx.moveTo(rackRightBottom.x, rackRightBottom.y);
        ctx.lineTo(rackRightTop.x, rackRightTop.y);
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 4.0;
        ctx.stroke();

        // Cross connection bar on the floor
        const crossFloorL = project({ x: -14, y: 32, z: 20 }, width, height, activeYaw, activePitch);
        const crossFloorR = project({ x: 14, y: 32, z: 20 }, width, height, activeYaw, activePitch);
        ctx.beginPath();
        ctx.moveTo(crossFloorL.x, crossFloorL.y);
        ctx.lineTo(crossFloorR.x, crossFloorR.y);
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 3.0;
        ctx.stroke();
      }

      // HIGH-FIDELITY METALLIC MANNEQUIN segments
      const segmentBaseColor = '#3f3f46'; // Neutral slate mannequin skin
      const segmentHighlightColor = '#a1a1aa'; // Specular metallic highlights
      const activeSegmentColor = '#ef4444'; // Red glowing muscle tissue contraction

      // Is target active
      const isPush = exerciseKey === 'supino_inclinado' || exerciseKey === 'supino_reto' || exerciseKey === 'desenvolvimento';
      const isPull = exerciseKey === 'puxada_pulley' || exerciseKey === 'remada_baixa' || exerciseKey === 'remada_curvada' || exerciseKey === 'rosca_biceps';
      const isLegs = exerciseKey === 'leg_press' || exerciseKey === 'extensora' || exerciseKey === 'flexora' || exerciseKey === 'agachamento' || exerciseKey === 'elevacao_pelvica';
      const isCore = exerciseKey === 'abdominal' || exerciseKey === 'prancha';

      // 3D volumetric capsule drawing helper
      const drawVolumetricSegment = (fromKey: string, toKey: string, radius: number, baseCol: string, highCol: string, isActive?: boolean) => {
        const pA = projected[fromKey];
        const pB = projected[toKey];
        if (!pA || !pB) return;

        const avgScale = ((pA.scale + pB.scale) / 2) * 0.12;
        const scaledRad = Math.max(1.5, radius * avgScale);

        const dx = pB.x - pA.x;
        const dy = pB.y - pA.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.1) return;

        ctx.save();
        
        // Draw main segment capsule
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineWidth = scaledRad * 2;
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);

        // Perpendicular vector for gradient lighting direction
        const px = -dy / len;
        const py = dx / len;

        const grad = ctx.createLinearGradient(
          pA.x - px * scaledRad, pA.y - py * scaledRad,
          pA.x + px * scaledRad, pA.y + py * scaledRad
        );

        if (isActive) {
          // Glow biological active red/orange muscle overlay
          const pulse = 0.8 + Math.sin(time * 0.008) * 0.2;
          grad.addColorStop(0, '#7f1d1d'); // dark crimson back
          grad.addColorStop(0.3, '#ef4444'); // hot active red
          grad.addColorStop(0.5, themeColors.core); // glowing core active theme
          grad.addColorStop(0.8, themeColors.highlight); // active theme highlight
          grad.addColorStop(1.0, '#7f1d1d');
        } else {
          // Standard modern biomechanical metal mannequin
          grad.addColorStop(0, '#18181b');
          grad.addColorStop(0.2, baseCol);
          grad.addColorStop(0.5, highCol); // Specular highlight sheen
          grad.addColorStop(0.8, baseCol);
          grad.addColorStop(1.0, '#09090b');
        }

        ctx.strokeStyle = grad;
        ctx.stroke();

        // Subtle anatomical muscle fiber lines (simulating real musculature!)
        if (isActive && len > 10) {
          ctx.beginPath();
          ctx.lineWidth = scaledRad * 0.25;
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)'; // bright yellowish overlay fibers
          ctx.setLineDash([4, 6]);
          ctx.moveTo(pA.x - px * scaledRad * 0.2, pA.y - py * scaledRad * 0.2);
          ctx.lineTo(pB.x - px * scaledRad * 0.2, pB.y - py * scaledRad * 0.2);
          ctx.moveTo(pA.x + px * scaledRad * 0.2, pA.y + py * scaledRad * 0.2);
          ctx.lineTo(pB.x + px * scaledRad * 0.2, pB.y + py * scaledRad * 0.2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.restore();
      };

      // 3D anatomical muscle belly drawing helper
      const drawAnatomicalMuscle = (
        fromKey: string,
        toKey: string,
        baseRadius: number,
        bulgeFactor: number, // multiplier for the muscle belly bulge in the center
        bulgeOffset: number, // where along the length the bulge is situated (0.0 to 1.0)
        baseCol: string,
        highCol: string,
        isActive?: boolean
      ) => {
        const pA = projected[fromKey];
        const pB = projected[toKey];
        if (!pA || !pB) return;

        const avgScale = ((pA.scale + pB.scale) / 2) * 0.12;
        const rA = baseRadius * pA.scale * 0.12;
        const rB = baseRadius * pB.scale * 0.12;

        const dx = pB.x - pA.x;
        const dy = pB.y - pA.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1.0) return;

        const nx = -dy / len;
        const ny = dx / len;

        ctx.save();
        ctx.beginPath();

        // Sample points along the length to build a beautiful curved muscle contour
        const numSamples = 10;
        const leftPoints: { x: number; y: number }[] = [];
        const rightPoints: { x: number; y: number }[] = [];

        for (let i = 0; i <= numSamples; i++) {
          const t = i / numSamples;
          const px = pA.x + dx * t;
          const py = pA.y + dy * t;
          const currentRadius = (rA * (1 - t) + rB * t);

          // Bell-curve equation for realistic muscle bellies (biceps, calves, quads)
          const distFromOffset = Math.abs(t - bulgeOffset);
          const bulgePower = Math.max(0, Math.cos(Math.min(0.5, distFromOffset) * Math.PI));
          const currentBulge = 1.0 + (bulgeFactor - 1.0) * bulgePower;
          const rad = currentRadius * currentBulge;

          leftPoints.push({ x: px + nx * rad, y: py + ny * rad });
          rightPoints.push({ x: px - nx * rad, y: py - ny * rad });
        }

        // Connect the left side contour
        ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
        for (let i = 1; i < leftPoints.length; i++) {
          ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
        }
        // Round off the end joint attachment
        ctx.arc(pB.x, pB.y, rB * 0.7, Math.atan2(ny, nx), Math.atan2(-ny, -nx), false);
        // Connect the right side contour (going backward)
        for (let i = rightPoints.length - 1; i >= 0; i--) {
          ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
        }
        // Round off the starting joint attachment
        ctx.arc(pA.x, pA.y, rA * 0.7, Math.atan2(-ny, -nx), Math.atan2(ny, nx), false);
        ctx.closePath();

        // High-contrast 3D linear gradient across the width of the muscle
        const maxRad = Math.max(rA, rB) * bulgeFactor;
        const grad = ctx.createLinearGradient(
          pA.x - nx * maxRad, pA.y - ny * maxRad,
          pA.x + nx * maxRad, pA.y + ny * maxRad
        );

        if (isActive) {
          // Glowing biological anatomical active state (crimson muscle fibers)
          const pulse = 0.85 + Math.sin(time * 0.009) * 0.15;
          grad.addColorStop(0, '#450a0a'); // Deep shadow
          grad.addColorStop(0.2, '#991b1b'); // Dark red
          grad.addColorStop(0.45, '#ef4444'); // Glowing active red
          grad.addColorStop(0.65, '#f87171'); // Highlighted muscle belly
          grad.addColorStop(0.85, '#fca5a5'); // Specular fibers glint
          grad.addColorStop(1.0, '#450a0a');
        } else {
          // Warm premium human athletic muscle look
          grad.addColorStop(0, '#2e150a'); // Shadow
          grad.addColorStop(0.25, '#5c2d1b'); // Muscle base
          grad.addColorStop(0.5, '#d39e82'); // White sheen glint on skin
          grad.addColorStop(0.75, '#874b33'); // Mid-tone curve
          grad.addColorStop(1.0, '#2e150a');
        }

        ctx.fillStyle = grad;
        ctx.fill();

        // Draw internal skeletal muscle fiber striation patterns
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = isActive ? 'rgba(254, 240, 138, 0.45)' : 'rgba(214, 211, 209, 0.22)';
        ctx.setLineDash([5, 8]);
        ctx.beginPath();
        for (let offsetFactor of [-0.4, 0, 0.4]) {
          ctx.moveTo(pA.x + nx * rA * offsetFactor, pA.y + ny * rA * offsetFactor);
          ctx.quadraticCurveTo(
            (pA.x + pB.x) / 2 + nx * (rA + rB) * 0.5 * bulgeFactor * offsetFactor * 1.3,
            (pA.y + pB.y) / 2 + ny * (rA + rB) * 0.5 * bulgeFactor * offsetFactor * 1.3,
            pB.x + nx * rB * offsetFactor,
            pB.y + ny * rB * offsetFactor
          );
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Dark crisp outline vector boundary for anatomical sketch look
        ctx.strokeStyle = isActive ? '#7f1d1d' : '#292524';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.restore();
      };

      // Helper to draw split left and right chest (Pectoral plates)
      const drawAnatomicalChest = () => {
        const pNeck = projected.neck;
        const pSpine = projected.spine;
        const pLShoulder = projected.lShoulder;
        const pRShoulder = projected.rShoulder;
        if (!pNeck || !pSpine || !pLShoulder || !pRShoulder) return;

        const sternumX = (pNeck.x + pSpine.x) / 2;
        const sternumY = (pNeck.y + pSpine.y) / 2;
        const midScale = (pNeck.scale + pSpine.scale) / 2;
        const pecSize = 13.5 * midScale * 0.12;

        const drawSinglePec = (shoulder: typeof pLShoulder, isLeft: boolean) => {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(sternumX, sternumY);
          
          const sideMult = isLeft ? 1 : -1;
          
          // Outer shoulder upper border
          ctx.quadraticCurveTo(
            (sternumX + shoulder.x) / 2, 
            (sternumY + shoulder.y) / 2 - pecSize * 0.35, 
            shoulder.x, 
            shoulder.y
          );
          // Shoulder insert
          ctx.lineTo(shoulder.x, shoulder.y + pecSize * 0.45);
          // Lower chest sweep curving down to lower ribcage
          ctx.quadraticCurveTo(
            (sternumX + shoulder.x) / 2 + pecSize * 0.22 * sideMult, 
            (sternumY + shoulder.y) / 2 + pecSize * 0.85, 
            sternumX, 
            pSpine.y
          );
          ctx.closePath();

          let pecGrad = ctx.createRadialGradient(shoulder.x, shoulder.y, 2, sternumX, sternumY, pecSize * 2.3);
          if (isPush) {
            pecGrad.addColorStop(0, '#f87171');
            pecGrad.addColorStop(0.4, '#b91c1c');
            pecGrad.addColorStop(1, '#450a0a');
          } else {
            pecGrad.addColorStop(0, '#d39e82');
            pecGrad.addColorStop(0.4, '#874b33');
            pecGrad.addColorStop(1, '#2e150a');
          }
          ctx.fillStyle = pecGrad;
          ctx.fill();
          ctx.strokeStyle = isPush ? '#991b1b' : '#292524';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Pectoral fiber striations pointing from sternum outward to shoulder insertion
          ctx.beginPath();
          ctx.lineWidth = 0.9;
          ctx.strokeStyle = isPush ? 'rgba(254, 240, 138, 0.38)' : 'rgba(214, 211, 209, 0.18)';
          ctx.setLineDash([3, 5]);
          for (let f = 0.2; f < 1.0; f += 0.25) {
            ctx.moveTo(shoulder.x, shoulder.y + pecSize * 0.2);
            ctx.quadraticCurveTo(
              (sternumX * f + shoulder.x * (1 - f)),
              (sternumY * f + shoulder.y * (1 - f)) + pecSize * 0.25,
              sternumX,
              sternumY + (pSpine.y - sternumY) * f
            );
          }
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        };

        drawSinglePec(pLShoulder, true);
        drawSinglePec(pRShoulder, false);
      };

      // Helper to draw defined 6-Pack abdominal matrix
      const drawAnatomicalAbs = () => {
        const pSpine = projected.spine;
        const pHip = projected.hip;
        if (!pSpine || !pHip) return;

        const dx = pHip.x - pSpine.x;
        const dy = pHip.y - pSpine.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 6) return;

        const nx = -dy / len;
        const ny = dx / len;

        const midScale = (pSpine.scale + pHip.scale) / 2;
        const abWidth = 5.2 * midScale * 0.12;
        const abHeight = len / 5.2;

        ctx.save();
        // 3 rows of abdominal muscles (total 6-pack grid)
        for (let row = 0; row < 3; row++) {
          const t = 0.25 + row * 0.26; // placement along ribcage-to-waist
          const cx = pSpine.x + dx * t;
          const cy = pSpine.y + dy * t;

          for (let side of [-1, 1]) {
            const bx = cx + nx * abWidth * 0.48 * side;
            const by = cy + ny * abWidth * 0.48 * side;

            ctx.beginPath();
            const rx = abWidth * 0.42;
            const ry = abHeight * 0.38;
            ctx.ellipse(bx, by, rx, ry, Math.atan2(ny, nx) + Math.PI / 2, 0, Math.PI * 2);

            let abGrad = ctx.createRadialGradient(bx, by, 0, bx, by, rx * 1.5);
            if (isCore) {
              const p = 0.85 + Math.sin(time * 0.008) * 0.15;
              abGrad.addColorStop(0, '#fca5a5');
              abGrad.addColorStop(0.4, '#ef4444');
              abGrad.addColorStop(1, '#7f1d1d');
            } else {
              abGrad.addColorStop(0, '#d39e82');
              abGrad.addColorStop(0.5, '#874b33');
              abGrad.addColorStop(1, '#2e150a');
            }

            ctx.fillStyle = abGrad;
            ctx.fill();
            ctx.strokeStyle = isCore ? '#991b1b' : '#292524';
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
        ctx.restore();
      };

      // Helper to draw realistic 3D Deltoid (Shoulder) caps
      const drawShoulderCap = (jointKey: string, isActive?: boolean) => {
        const pS = projected[jointKey];
        if (!pS) return;

        const rad = 6.2 * pS.scale * 0.12;
        ctx.save();
        
        const shGrad = ctx.createRadialGradient(pS.x - rad * 0.2, pS.y - rad * 0.2, 0, pS.x, pS.y, rad);
        if (isActive) {
          shGrad.addColorStop(0, '#fca5a5');
          shGrad.addColorStop(0.4, '#ef4444');
          shGrad.addColorStop(1, '#7f1d1d');
        } else {
          shGrad.addColorStop(0, '#d39e82');
          shGrad.addColorStop(0.4, '#874b33');
          shGrad.addColorStop(1, '#2e150a');
        }

        ctx.beginPath();
        ctx.arc(pS.x, pS.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = shGrad;
        ctx.fill();
        ctx.strokeStyle = isActive ? '#991b1b' : '#292524';
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();
      };

      // DRAW MUSCLES WITH DETAILED BULGES (BIOLOGICAL MUSCULAR LOOK)
      // Thighs (Bulging Quadriceps)
      drawAnatomicalMuscle('lHip', 'lKnee', 5.8, 1.34, 0.45, segmentBaseColor, segmentHighlightColor, isLegs);
      drawAnatomicalMuscle('rHip', 'rKnee', 5.8, 1.34, 0.45, segmentBaseColor, segmentHighlightColor, isLegs);
      
      // Calves (Prominent bulging Gastrocnemius upper, tapering down to Achilles tendon)
      drawAnatomicalMuscle('lKnee', 'lFoot', 4.4, 1.48, 0.32, '#27272a', '#71717a', exerciseKey === 'panturrilha');
      drawAnatomicalMuscle('rKnee', 'rFoot', 4.4, 1.48, 0.32, '#27272a', '#71717a', exerciseKey === 'panturrilha');

      // Abdomen base frame
      drawAnatomicalAbs();

      // Split Chest (Large anatomical pectoral plates)
      drawAnatomicalChest();

      // Lower Pelvic/Hip Plate
      drawAnatomicalMuscle('lHip', 'rHip', 7.5, 1.1, 0.5, '#27272a', '#52525b');

      // Upper arms (Bulging Biceps & Triceps peaks)
      drawAnatomicalMuscle('lShoulder', 'lElbow', 3.8, 1.36, 0.48, segmentBaseColor, segmentHighlightColor, isPush || isPull);
      drawAnatomicalMuscle('rShoulder', 'rElbow', 3.8, 1.36, 0.48, segmentBaseColor, segmentHighlightColor, isPush || isPull);
      
      // Forearms (Thicker near elbow, tapering towards wrists)
      drawAnatomicalMuscle('lElbow', 'lHand', 3.2, 1.24, 0.28, '#27272a', '#71717a');
      drawAnatomicalMuscle('rElbow', 'rHand', 3.2, 1.24, 0.28, '#27272a', '#71717a');

      // Deltoid caps (Shoulders)
      drawShoulderCap('lShoulder', isPush || isPull);
      drawShoulderCap('rShoulder', isPush || isPull);

      // Muscular Neck cylinder
      drawAnatomicalMuscle('neck', 'head', 4.4, 1.15, 0.5, '#27272a', '#52525b');

      // Draw highlighted biological heatmaps on working muscle target zones (like the red highlights in the screen!)
      muscleFocusAreas.forEach((area) => {
        const proj = project(area, width, height, activeYaw, activePitch);
        const rad = area.size * proj.scale * 0.12;
        if (rad < 1) return;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        const pulse = 0.7 + Math.sin(time * 0.009 + area.x) * 0.3;
        const intensity = area.intensity * pulse;
        
        const focusGrad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, rad);
        focusGrad.addColorStop(0, `rgba(239, 68, 68, ${0.85 * intensity})`); // primary crimson red
        focusGrad.addColorStop(0.4, `rgba(${themeColors.coreRGB}, ${0.5 * intensity})`); // glowing theme core
        focusGrad.addColorStop(1.0, 'rgba(239, 68, 68, 0)');
        
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = focusGrad;
        ctx.fill();
        ctx.restore();
      });
      
      const pH = projected.head;
      if (pH) {
        const headRad = 7.8 * pH.scale * 0.12;
        if (headRad > 1) {
          ctx.save();
          ctx.beginPath();
          
          // Face direction offset based on Yaw rotation (positive means facing right, negative facing left)
          const faceDir = Math.sin(activeYaw);
          
          // Generate realistic contoured profile of a head
          const chinX = pH.x - faceDir * headRad * 0.58;
          const chinY = pH.y + headRad * 0.68;
          const backHeadX = pH.x + faceDir * headRad * 0.42;
          const backHeadY = pH.y + headRad * 0.42;
          
          ctx.moveTo(pH.x, pH.y - headRad); // Top of head skull cap
          
          // Outer curve of back skull
          ctx.quadraticCurveTo(pH.x + faceDir * headRad * 1.05, pH.y - headRad * 0.45, pH.x + faceDir * headRad * 0.85, pH.y + headRad * 0.42);
          // Back neck insertion
          ctx.lineTo(pH.x + faceDir * headRad * 0.45, pH.y + headRad * 0.62); 
          // Jawline down to chin
          ctx.lineTo(chinX, chinY); 
          // Lower lip & mouth cleft
          ctx.lineTo(pH.x - faceDir * headRad * 0.88, pH.y + headRad * 0.38);
          ctx.lineTo(pH.x - faceDir * headRad * 0.72, pH.y + headRad * 0.28);
          // Nose bridge & prominent nose tip
          ctx.lineTo(pH.x - faceDir * headRad * 1.12, pH.y + headRad * 0.08);
          ctx.lineTo(pH.x - faceDir * headRad * 0.75, pH.y - headRad * 0.12); // Eye socket depression
          // Muscular brow ridge & forehead
          ctx.lineTo(pH.x - faceDir * headRad * 0.82, pH.y - headRad * 0.32);
          ctx.quadraticCurveTo(pH.x - faceDir * headRad * 0.45, pH.y - headRad * 1.02, pH.x, pH.y - headRad);
          ctx.closePath();
          
          // Gorgeous high-fidelity volumetric radial metal shading
          const headGrad = ctx.createRadialGradient(
            pH.x - faceDir * headRad * 0.4, 
            pH.y - headRad * 0.4, 
            1, 
            pH.x, 
            pH.y, 
            headRad * 1.3
          );
          headGrad.addColorStop(0, '#ffeedd'); // Specular highlight
          headGrad.addColorStop(0.3, '#dca685'); // Warm skin tone
          headGrad.addColorStop(0.75, '#7c4b35'); // Shaded bone structures
          headGrad.addColorStop(1, '#33170c'); // Extreme shadow
          
          ctx.fillStyle = headGrad;
          ctx.fill();
          
          ctx.strokeStyle = '#5c2d1b';
          ctx.lineWidth = 1.3;
          ctx.stroke();
          
          // Draw subtle ear contour for complete anatomical detail
          const earX = pH.x + faceDir * headRad * 0.15;
          const earY = pH.y + headRad * 0.1;
          const earRad = headRad * 0.25;
          ctx.beginPath();
          ctx.ellipse(earX, earY, earRad * 0.7, earRad, Math.PI / 12, 0, Math.PI * 2);
          ctx.fillStyle = '#7c4b35';
          ctx.fill();
          ctx.strokeStyle = '#5c2d1b';
          ctx.stroke();
          
          ctx.restore();
        }
      }

      // DRAW DYNAMIC EXERCISE EQUIPMENT (BARBELL VS DUMBBELLS)
      if (projected.lHand && projected.rHand) {
        const lH = projected.lHand;
        const rH = projected.rHand;
        
        if (isHalteres) {
          // DRAW DUMBBELLS IN HANDS
          const drawDumbbell = (hand: { x: number; y: number; scale: number }, angleRad: number) => {
            const hScale = hand.scale * 0.12;
            const dbLength = 12 * hScale;
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);

            // Steel handle bar
            const x1 = hand.x - cos * dbLength;
            const y1 = hand.y - sin * dbLength;
            const x2 = hand.x + cos * dbLength;
            const y2 = hand.y + sin * dbLength;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = '#e4e4e7';
            ctx.lineWidth = 2.5 * hScale;
            ctx.stroke();

            // Plate ends
            const drawDBPlate = (px: number, py: number) => {
              ctx.beginPath();
              ctx.arc(px, py, 5.5 * hScale, 0, Math.PI * 2);
              ctx.fillStyle = '#18181b';
              ctx.strokeStyle = '#71717a';
              ctx.lineWidth = 1 * hScale;
              ctx.fill();
              ctx.stroke();
            };

            drawDBPlate(x1, y1);
            drawDBPlate(x2, y2);
          };

          const angleLeft = exerciseKey === 'elevacao_lateral' ? Math.atan2(rH.y - lH.y, rH.x - lH.x) + Math.PI/2 : 0;
          const angleRight = exerciseKey === 'elevacao_lateral' ? Math.atan2(rH.y - lH.y, rH.x - lH.x) + Math.PI/2 : 0;
          
          drawDumbbell(lH, angleLeft);
          drawDumbbell(rH, angleRight);
        } 
        else if (exerciseKey === 'supino_reto' || exerciseKey === 'supino_inclinado' || exerciseKey === 'agachamento' || exerciseKey === 'remada_curvada' || exerciseKey === 'triceps_testa') {
          // DRAW SOLID BARBELL WITH HEAVY plates
          const dx = rH.x - lH.x;
          const dy = rH.y - lH.y;
          
          // Extrapolate barbell ends
          const barExt = 0.38;
          const b1x = lH.x - dx * barExt;
          const b1y = lH.y - dy * barExt;
          const b2x = rH.x + dx * barExt;
          const b2y = rH.y + dy * barExt;

          // Steel barbell rod
          ctx.beginPath();
          ctx.moveTo(b1x, b1y);
          ctx.lineTo(b2x, b2y);
          ctx.strokeStyle = '#e4e4e7';
          ctx.lineWidth = 2.8;
          ctx.stroke();

          // Highlight specular line
          ctx.beginPath();
          ctx.moveTo(b1x, b1y);
          ctx.lineTo(b2x, b2y);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Draw double 3D Plates at each side
          const drawBarbellPlates = (px: number, py: number, r: number) => {
            const rot = Math.atan2(dy, dx);
            
            // Draw 2 adjacent rings for depth thickness representation
            for (let offset = -1.5; offset <= 1.5; offset += 3.0) {
              const ox = px + Math.cos(rot + Math.PI/2) * offset * 0.15;
              const oy = py + Math.sin(rot + Math.PI/2) * offset * 0.15;

              ctx.beginPath();
              ctx.ellipse(ox, oy, r, r * 0.35, rot, 0, Math.PI * 2);
              ctx.fillStyle = '#18181b';
              ctx.strokeStyle = '#ef4444'; // Red plates for intensity
              ctx.lineWidth = 2;
              ctx.fill();
              ctx.stroke();
            }
          };

          const plateLeft_x = lH.x - dx * 0.22;
          const plateLeft_y = lH.y - dy * 0.22;
          const plateRight_x = rH.x + dx * 0.22;
          const plateRight_y = rH.y + dy * 0.22;

          drawBarbellPlates(plateLeft_x, plateLeft_y, 13);
          drawBarbellPlates(plateRight_x, plateRight_y, 13);
        }
        else if (exerciseKey === 'puxada_pulley') {
          // Wide Lat Pulldown Bar
          const dx = rH.x - lH.x;
          const dy = rH.y - lH.y;
          const b1x = lH.x - dx * 0.2;
          const b1y = lH.y - dy * 0.2;
          const b2x = rH.x + dx * 0.2;
          const b2y = rH.y + dy * 0.2;

          ctx.beginPath();
          ctx.moveTo(b1x, b1y);
          ctx.lineTo(b2x, b2y);
          ctx.strokeStyle = '#71717a';
          ctx.lineWidth = 3.2;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(b1x, b1y);
          ctx.lineTo(b2x, b2y);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.0;
          ctx.stroke();

          // Cable lines going to pulley at center ceiling
          const ceilingPulley = project({ x: 0, y: -48, z: -5 }, width, height, activeYaw, activePitch);
          ctx.beginPath();
          ctx.moveTo((lH.x + rH.x) / 2, (lH.y + rH.y) / 2);
          ctx.lineTo(ceilingPulley.x, ceilingPulley.y);
          ctx.strokeStyle = 'rgba(161, 161, 170, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Compass camera orientation needle in corner
      const compassX = 25;
      const compassY = 25;
      ctx.beginPath();
      ctx.arc(compassX, compassY, 12, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const needleX = Math.cos(activeYaw) * 9;
      const needleY = Math.sin(activeYaw) * 9;
      ctx.beginPath();
      ctx.moveTo(compassX, compassY);
      ctx.lineTo(compassX + needleX, compassY - needleY);
      ctx.strokeStyle = themeColors.needle; // active theme needle
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(compassX, compassY, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [exerciseKey, yaw, pitch, isDragging]);

  return (
    <div 
      className="relative w-full h-[162px] bg-zinc-950 rounded-2xl border border-zinc-800/80 overflow-hidden group select-none cursor-grab active:cursor-grabbing shadow-inner"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUpOrLeave}
    >
      {/* 3D Interactive Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />

      {/* Control Overlay */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            resetCamera();
          }}
          className="p-1.5 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-lg text-[9px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-all active:scale-90"
          title="Resetar Câmera"
        >
          <RotateCcw size={10} />
          <span>Foco 3D</span>
        </button>
        <span className="text-[7px] font-mono text-zinc-300 bg-zinc-900 border border-accent/15 flex items-center gap-1 shadow-sm uppercase">
          <Sparkles size={8} className="text-accent" /> {type}
        </span>
      </div>

      {/* Floating details / instruction label */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[8px] font-sans text-zinc-500 pointer-events-none">
        <span className="flex items-center gap-1">
          <Compass size={10} className="text-zinc-600 animate-spin-slow" />
          <span>Arraste para rotacionar o manequim 3D ({exerciseDisplayName})</span>
        </span>
        <span className="font-mono text-zinc-600 uppercase">
          yaw: {yaw.toFixed(2)} | pitch: {pitch.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
