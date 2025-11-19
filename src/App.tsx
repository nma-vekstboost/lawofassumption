import { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface Star {
  x: number;
  y: number;
  z: number;
  prevX?: number;
  prevY?: number;
}

type AppPhase = 'silence' | 'breath' | 'awakening' | 'ready';

function App() {
  const [phase, setPhase] = useState<AppPhase>('silence');
  const [breathOpacity, setBreathOpacity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();
  const speedRef = useRef(0.001);
  const targetSpeedRef = useRef(0.001);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const silenceTimer = setTimeout(() => {
      setPhase('breath');

      const breathSequence = [
        { time: 0, opacity: 0 },
        { time: 800, opacity: 0.3 },
        { time: 1600, opacity: 0.1 },
        { time: 2400, opacity: 0.25 },
        { time: 3200, opacity: 0 },
      ];

      breathSequence.forEach(({ time, opacity }) => {
        setTimeout(() => setBreathOpacity(opacity), time);
      });

      setTimeout(() => {
        setPhase('awakening');
        targetSpeedRef.current = 0.002;
      }, 3500);

      setTimeout(() => {
        setPhase('ready');
      }, 6500);

      setTimeout(() => {
        setIsVisible(true);
      }, 9000);
    }, 2500);

    return () => clearTimeout(silenceTimer);
  }, []);

  useEffect(() => {
    if (phase === 'silence' || phase === 'breath') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const NUM_STARS = 100;
    const MAX_Z = 2.5;
    const MIN_Z = 0.001;

    const initStars = () => {
      starsRef.current = Array.from({ length: NUM_STARS }, () => ({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: Math.random() * (MAX_Z - MIN_Z) + MIN_Z,
      }));
    };

    if (starsRef.current.length === 0) {
      initStars();
    }

    const animate = () => {
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.05;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      starsRef.current.forEach((star) => {
        star.z -= speedRef.current;

        if (star.z <= MIN_Z) {
          star.x = (Math.random() - 0.5) * 2;
          star.y = (Math.random() - 0.5) * 2;
          star.z = MAX_Z;
          star.prevX = undefined;
          star.prevY = undefined;
        }

        const scale = 1 / star.z;
        const x = star.x * scale * centerX + centerX;
        const y = star.y * scale * centerY + centerY;

        if (x < -50 || x > canvas.width + 50 || y < -50 || y > canvas.height + 50) {
          return;
        }

        const size = Math.max(0, (1 - star.z / MAX_Z) * 2);
        const opacity = Math.min(1, (1 - star.z / MAX_Z) * 1.5);

        if (star.prevX !== undefined && star.prevY !== undefined && star.z < 0.5) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
          ctx.lineWidth = size * 0.5;
          ctx.moveTo(star.prevX, star.prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        star.prevX = x;
        star.prevY = y;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'ready') return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(40, audioContext.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(80, audioContext.currentTime);
    filter.Q.setValueAtTime(1, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 2);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    return () => {
      oscillator.stop();
      audioContext.close();
    };
  }, [phase]);

  useEffect(() => {
    if (inputValue.length > 0) {
      targetSpeedRef.current = 0.003;
    } else {
      targetSpeedRef.current = 0.002;
    }
  }, [inputValue]);

  const handleSimulationStart = () => {
    setIsSimulating(true);
    targetSpeedRef.current = 0.018;

    setTimeout(() => {
      targetSpeedRef.current = 0.006;
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
      {phase === 'breath' && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: breathOpacity,
            transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            className="w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)',
            }}
          />
        </div>
      )}

      {phase !== 'silence' && phase !== 'breath' && (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-radial from-blue-950/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        </>
      )}

      {phase === 'ready' && (
        <div
          className={`relative z-10 w-full max-w-3xl px-6 transition-all duration-2000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <Sparkles
              className={`w-8 h-8 text-blue-400/60 transition-all duration-1000 ${
                isFocused ? 'scale-110 text-blue-300' : 'scale-100'
              }`}
            />
          </div>

          <h1
            className="text-2xl md:text-3xl font-light text-white/90 mb-3 tracking-wide"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            What future do you want to see?
          </h1>

          <p className="text-sm text-white/40 font-light tracking-wider">
            Your mind creates what it can clearly imagine
          </p>
        </div>

        <div className="relative group">
          <div
            className={`absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-2xl blur-xl transition-opacity duration-500 ${
              isFocused ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe your future in vivid detail..."
            className="relative w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-5 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all duration-300 resize-none text-lg font-light leading-relaxed"
            rows={6}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              caretColor: '#60a5fa'
            }}
          />
        </div>

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={handleSimulationStart}
            disabled={!inputValue.trim()}
            className="group relative px-8 py-3 bg-white/5 hover:bg-white/10 disabled:bg-white/5 border border-white/20 hover:border-white/30 disabled:border-white/10 rounded-full text-white/80 disabled:text-white/30 font-light tracking-wide transition-all duration-300 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span>Begin Simulation</span>
              <Sparkles className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-xs text-white/20 font-light tracking-widest uppercase">
            Meditation in 4D
          </p>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;
