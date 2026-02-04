import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';

export default function Pendulum() {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const pendulumRef = useRef(null);
  const trailRef = useRef([]);
  
  const [length, setLength] = useState(200);
  const [mass, setMass] = useState(10);
  const [gravity, setGravity] = useState(9.81);
  const [initialAngle, setInitialAngle] = useState(45);
  const [damping, setDamping] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showTrail, setShowTrail] = useState(true);
  const [showVectors, setShowVectors] = useState(false);
  const [stats, setStats] = useState({
    currentAngle: 0,
    angularVelocity: 0,
    energy: 0,
    period: 0
  });

  const originX = 400;
  const originY = 100;
  const scale = 1.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const updateCanvasSize = () => {
        const isMobile = window.innerWidth < 768;
        canvas.width = isMobile ? Math.min(window.innerWidth - 32, 600) : 800;
        canvas.height = isMobile ? 500 : 600;
        draw();
      };
      
      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);
      return () => window.removeEventListener('resize', updateCanvasSize);
    }
  }, []);

  const start = () => {
    reset();
    setIsRunning(true);
    
    const angleRad = initialAngle * Math.PI / 180;
    const L = length / scale;
    const g = gravity;
    const m = mass;
    
    pendulumRef.current = {
      angle: angleRad,
      angularVelocity: 0,
      L: L,
      g: g,
      m: m,
      damping: damping,
      time: 0,
      startEnergy: m * g * L * (1 - Math.cos(angleRad))
    };
    
    trailRef.current = [];
    animate();
  };

  const animate = () => {
    const dt = 0.016;
    const pendulum = pendulumRef.current;
    
    if (pendulum) {
      const angularAccel = -(pendulum.g / pendulum.L) * Math.sin(pendulum.angle) - pendulum.damping * pendulum.angularVelocity;
      
      pendulum.angularVelocity += angularAccel * dt;
      pendulum.angle += pendulum.angularVelocity * dt;
      pendulum.time += dt;
      
      // Calculate bob position
      const x = originX + pendulum.L * scale * Math.sin(pendulum.angle);
      const y = originY + pendulum.L * scale * Math.cos(pendulum.angle);
      
      // Add to trail
      if (showTrail) {
        trailRef.current.push({ x, y });
        if (trailRef.current.length > 150) {
          trailRef.current.shift();
        }
      } else {
        trailRef.current = [];
      }
      
      // Calculate stats
      const currentEnergy = 0.5 * pendulum.m * Math.pow(pendulum.angularVelocity * pendulum.L, 2) + 
                           pendulum.m * pendulum.g * pendulum.L * (1 - Math.cos(pendulum.angle));
      const theoreticalPeriod = 2 * Math.PI * Math.sqrt(pendulum.L / pendulum.g);
      
      setStats({
        currentAngle: (pendulum.angle * 180 / Math.PI).toFixed(1),
        angularVelocity: pendulum.angularVelocity.toFixed(2),
        energy: currentEnergy.toFixed(2),
        period: theoreticalPeriod.toFixed(2)
      });
      
      draw();
    }
    
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    const adjustedOriginX = width < 768 ? width / 2 : originX;
    
    if (pendulumRef.current) {
      const pendulum = pendulumRef.current;
      const bobX = adjustedOriginX + pendulum.L * scale * Math.sin(pendulum.angle);
      const bobY = originY + pendulum.L * scale * Math.cos(pendulum.angle);
      
      // Draw trail
      if (showTrail && trailRef.current.length > 1) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        for (let i = 1; i < trailRef.current.length; i++) {
          const alpha = i / trailRef.current.length;
          ctx.globalAlpha = alpha * 0.5;
          ctx.beginPath();
          ctx.moveTo(trailRef.current[i - 1].x, trailRef.current[i - 1].y);
          ctx.lineTo(trailRef.current[i].x, trailRef.current[i].y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      
      // Draw pivot point
      ctx.fillStyle = '#525252';
      ctx.beginPath();
      ctx.arc(adjustedOriginX, originY, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw rod
      ctx.strokeStyle = '#737373';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(adjustedOriginX, originY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();
      
      // Draw bob
      const bobRadius = Math.sqrt(pendulum.m) * 3;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw velocity vector
      if (showVectors) {
        const vx = pendulum.angularVelocity * pendulum.L * Math.cos(pendulum.angle) * scale * 0.5;
        const vy = -pendulum.angularVelocity * pendulum.L * Math.sin(pendulum.angle) * scale * 0.5;
        
        // Velocity (green)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX + vx, bobY + vy);
        ctx.stroke();
        
        // Draw arrowhead
        const angle = Math.atan2(vy, vx);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(bobX + vx, bobY + vy);
        ctx.lineTo(bobX + vx - 10 * Math.cos(angle - Math.PI / 6), bobY + vy - 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(bobX + vx - 10 * Math.cos(angle + Math.PI / 6), bobY + vy - 10 * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      }
    } else {
      // Draw initial position
      const angleRad = initialAngle * Math.PI / 180;
      const L = length / scale;
      const bobX = adjustedOriginX + L * scale * Math.sin(angleRad);
      const bobY = originY + L * scale * Math.cos(angleRad);
      const bobRadius = Math.sqrt(mass) * 3;
      
      // Draw pivot
      ctx.fillStyle = '#525252';
      ctx.beginPath();
      ctx.arc(adjustedOriginX, originY, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw rod
      ctx.strokeStyle = '#737373';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(adjustedOriginX, originY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();
      
      // Draw bob
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const reset = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    setIsRunning(false);
    pendulumRef.current = null;
    trailRef.current = [];
    setStats({
      currentAngle: 0,
      angularVelocity: 0,
      energy: 0,
      period: 0
    });
    draw();
  };

  useEffect(() => {
    if (!isRunning) {
      draw();
    }
  }, [length, mass, initialAngle, showTrail, showVectors]);

  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <Header />
      
      <main className="pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Pendulum Simulator
            </h1>
            <p className="text-neutral-400">
              Explore simple harmonic motion and energy conservation with an interactive pendulum
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas */}
            <div className="lg:col-span-2 bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
              <canvas
                ref={canvasRef}
                className="w-full border border-neutral-800 rounded-lg"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={start}
                  disabled={isRunning}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  {isRunning ? 'Running...' : 'Start'}
                </button>
                <button
                  onClick={reset}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Parameters */}
              <div className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">Parameters</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">
                      Length: <span className="text-purple-400">{length} px</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Mass: <span className="text-purple-400">{mass} kg</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={mass}
                      onChange={(e) => setMass(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Initial Angle: <span className="text-purple-400">{initialAngle}°</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="170"
                      value={initialAngle}
                      onChange={(e) => setInitialAngle(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Gravity: <span className="text-purple-400">{gravity} m/s²</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.1"
                      value={gravity}
                      onChange={(e) => setGravity(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Damping: <span className="text-purple-400">{damping.toFixed(2)}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.01"
                      value={damping}
                      onChange={(e) => setDamping(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Display Options */}
              <div className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">Display</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTrail}
                      onChange={(e) => setShowTrail(e.target.checked)}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-sm">Show Trail</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showVectors}
                      onChange={(e) => setShowVectors(e.target.checked)}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-sm">Show Velocity Vector</span>
                  </label>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">Statistics</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Current Angle:</span>
                    <span className="font-mono">{stats.currentAngle}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Angular Velocity:</span>
                    <span className="font-mono">{stats.angularVelocity} rad/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Energy:</span>
                    <span className="font-mono">{stats.energy} J</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Period (theory):</span>
                    <span className="font-mono">{stats.period} s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-6 bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">Physics Concepts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-300">
              <div>
                <h4 className="font-medium text-neutral-200 mb-1">Simple Harmonic Motion</h4>
                <p className="text-neutral-400">For small angles (&lt;15°), the pendulum exhibits simple harmonic motion with period T = 2π√(L/g)</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-200 mb-1">Energy Conservation</h4>
                <p className="text-neutral-400">Total energy remains constant without damping: E = KE + PE = ½mv² + mgh</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-200 mb-1">Angular Acceleration</h4>
                <p className="text-neutral-400">α = -(g/L)sin(θ) - damping × ω, where θ is angle from vertical</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-200 mb-1">Damping Effect</h4>
                <p className="text-neutral-400">Air resistance and friction gradually reduce amplitude over time</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
