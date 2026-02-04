import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';

export default function Collision() {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const ballsRef = useRef([]);
  
  const [mass1, setMass1] = useState(5);
  const [mass2, setMass2] = useState(5);
  const [velocity1, setVelocity1] = useState(3);
  const [velocity2, setVelocity2] = useState(-2);
  const [collisionType, setCollisionType] = useState('elastic');
  const [isRunning, setIsRunning] = useState(false);
  const [showVectors, setShowVectors] = useState(true);
  const [showCOM, setShowCOM] = useState(false);
  const [stats, setStats] = useState({
    totalMomentum: 0,
    totalKE: 0,
    v1Final: 0,
    v2Final: 0,
    hasCollided: false
  });

  const canvasWidth = 800;
  const canvasHeight = 400;
  const scale = 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const updateCanvasSize = () => {
        const isMobile = window.innerWidth < 768;
        canvas.width = isMobile ? Math.min(window.innerWidth - 32, 600) : canvasWidth;
        canvas.height = isMobile ? 300 : canvasHeight;
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
    
    const radius1 = Math.sqrt(mass1) * 5;
    const radius2 = Math.sqrt(mass2) * 5;
    
    ballsRef.current = [
      {
        x: 150,
        y: canvasHeight / 2,
        vx: velocity1,
        vy: 0,
        mass: mass1,
        radius: radius1,
        color: '#3b82f6'
      },
      {
        x: 650,
        y: canvasHeight / 2,
        vx: velocity2,
        vy: 0,
        mass: mass2,
        radius: radius2,
        color: '#ef4444'
      }
    ];
    
    updateStats();
    animate();
  };

  const animate = () => {
    const dt = 0.016;
    const balls = ballsRef.current;
    
    if (balls.length === 2) {
      balls[0].x += balls[0].vx * scale * dt * 60;
      balls[1].x += balls[1].vx * scale * dt * 60;
      
      const distance = Math.abs(balls[1].x - balls[0].x);
      const minDistance = balls[0].radius + balls[1].radius;
      
      if (distance <= minDistance && !stats.hasCollided) {
        handleCollision();
      }
      
      if (balls[0].x - balls[0].radius < 0 || balls[0].x + balls[0].radius > canvasWidth) {
        balls[0].vx *= -0.8;
        balls[0].x = Math.max(balls[0].radius, Math.min(canvasWidth - balls[0].radius, balls[0].x));
      }
      if (balls[1].x - balls[1].radius < 0 || balls[1].x + balls[1].radius > canvasWidth) {
        balls[1].vx *= -0.8;
        balls[1].x = Math.max(balls[1].radius, Math.min(canvasWidth - balls[1].radius, balls[1].x));
      }
      
      updateStats();
      draw();
    }
    
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const handleCollision = () => {
    const balls = ballsRef.current;
    const m1 = balls[0].mass;
    const m2 = balls[1].mass;
    const v1 = balls[0].vx;
    const v2 = balls[1].vx;
    
    let v1Final, v2Final;
    
    if (collisionType === 'elastic') {
      v1Final = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
      v2Final = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
    } else {
      const coeffRestitution = collisionType === 'inelastic' ? 0 : 0.5;
      v1Final = ((m1 - coeffRestitution * m2) * v1 + (1 + coeffRestitution) * m2 * v2) / (m1 + m2);
      v2Final = ((m2 - coeffRestitution * m1) * v2 + (1 + coeffRestitution) * m1 * v1) / (m1 + m2);
    }
    
    balls[0].vx = v1Final;
    balls[1].vx = v2Final;
    
    const overlap = (balls[0].radius + balls[1].radius) - Math.abs(balls[1].x - balls[0].x);
    if (overlap > 0) {
      balls[0].x -= overlap / 2;
      balls[1].x += overlap / 2;
    }
    
    setStats(prev => ({
      ...prev,
      v1Final: v1Final.toFixed(2),
      v2Final: v2Final.toFixed(2),
      hasCollided: true
    }));
  };

  const updateStats = () => {
    const balls = ballsRef.current;
    if (balls.length === 2) {
      const totalMomentum = balls[0].mass * balls[0].vx + balls[1].mass * balls[1].vx;
      const totalKE = 0.5 * balls[0].mass * Math.pow(balls[0].vx, 2) + 
                      0.5 * balls[1].mass * Math.pow(balls[1].vx, 2);
      
      setStats(prev => ({
        ...prev,
        totalMomentum: totalMomentum.toFixed(2),
        totalKE: totalKE.toFixed(2)
      }));
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
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
    
    ctx.strokeStyle = '#525252';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    if (showCOM && ballsRef.current.length === 2) {
      const balls = ballsRef.current;
      const totalMass = balls[0].mass + balls[1].mass;
      const comX = (balls[0].mass * balls[0].x + balls[1].mass * balls[1].x) / totalMass;
      
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(comX, height / 2, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = '#fbbf24';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(comX, 0);
      ctx.lineTo(comX, height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    ballsRef.current.forEach((ball, index) => {
      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.strokeStyle = index === 0 ? '#1e40af' : '#7f1d1d';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${ball.mass}kg`, ball.x, ball.y);
      
      if (showVectors && Math.abs(ball.vx) > 0.1) {
        const vectorLength = Math.abs(ball.vx) * 30;
        const vectorX = ball.x + (ball.vx > 0 ? 1 : -1) * (ball.radius + vectorLength);
        
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ball.x + (ball.vx > 0 ? ball.radius : -ball.radius), ball.y);
        ctx.lineTo(vectorX, ball.y);
        ctx.stroke();
        
        const angle = ball.vx > 0 ? 0 : Math.PI;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(vectorX, ball.y);
        ctx.lineTo(vectorX - 10 * Math.cos(angle - Math.PI / 6), ball.y - 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(vectorX - 10 * Math.cos(angle + Math.PI / 6), ball.y - 10 * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#10b981';
        ctx.font = '12px sans-serif';
        ctx.fillText(`${ball.vx.toFixed(1)} m/s`, vectorX, ball.y - 20);
      }
    });
  };

  const reset = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    setIsRunning(false);
    ballsRef.current = [];
    setStats({
      totalMomentum: 0,
      totalKE: 0,
      v1Final: 0,
      v2Final: 0,
      hasCollided: false
    });
    draw();
  };

  useEffect(() => {
    if (!isRunning) {
      draw();
    }
  }, [mass1, mass2, velocity1, velocity2, showVectors, showCOM]);

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
              Collision Simulator
            </h1>
            <p className="text-neutral-400">
              Explore conservation of momentum and energy in elastic and inelastic collisions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
              <canvas
                ref={canvasRef}
                className="w-full border border-neutral-800 rounded-lg"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={start}
                  disabled={isRunning}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600 disabled:from-neutral-700 disabled:to-neutral-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition"
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

            <div className="space-y-4">
              <div className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-400">Ball 1 (Blue)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">
                      Mass: <span className="text-blue-400">{mass1} kg</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={mass1}
                      onChange={(e) => setMass1(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Velocity: <span className="text-blue-400">{velocity1} m/s</span>
                    </label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="0.5"
                      value={velocity1}
                      onChange={(e) => setVelocity1(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-400">Ball 2 (Red)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">
                      Mass: <span className="text-red-400">{mass2} kg</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={mass2}
                      onChange={(e) => setMass2(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Velocity: <span className="text-red-400">{velocity2} m/s</span>
                    </label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="0.5"
                      value={velocity2}
                      onChange={(e) => setVelocity2(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full accent-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">Collision Type</h3>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="collision"
                      value="elastic"
                      checked={collisionType === 'elastic'}
                      onChange={(e) => setCollisionType(e.target.value)}
                      disabled={isRunning}
                      className="accent-purple-500"
                    />
                    <span className="text-sm">Elastic (e = 1)</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="collision"
                      value="partial"
                      checked={collisionType === 'partial'}
                      onChange={(e) => setCollisionType(e.target.value)}
                      disabled={isRunning}
                      className="accent-purple-500"
                    />
                    <span className="text-sm">Partially Elastic (e = 0.5)</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="collision"
                      value="inelastic"
                      checked={collisionType === 'inelastic'}
                      onChange={(e) => setCollisionType(e.target.value)}
                      disabled={isRunning}
                      className="accent-purple-500"
                    />
                    <span className="text-sm">Perfectly Inelastic (e = 0)</span>
                  </label>
                </div>
              </div>

              <div className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">Display</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showVectors}
                      onChange={(e) => setShowVectors(e.target.checked)}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-sm">Show Velocity Vectors</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCOM}
                      onChange={(e) => setShowCOM(e.target.checked)}
                      className="w-4 h-4 accent-purple-500"
                    />
                    <span className="text-sm">Show Center of Mass</span>
                  </label>
                </div>
              </div>

              <div className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">Statistics</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Momentum:</span>
                    <span className="font-mono">{stats.totalMomentum} kg⋅m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total KE:</span>
                    <span className="font-mono">{stats.totalKE} J</span>
                  </div>
                  {stats.hasCollided && (
                    <>
                      <div className="h-px bg-neutral-700 my-2"></div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Ball 1 Final v:</span>
                        <span className="font-mono">{stats.v1Final} m/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Ball 2 Final v:</span>
                        <span className="font-mono">{stats.v2Final} m/s</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">Physics Concepts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-300">
              <div>
                <h4 className="font-medium text-neutral-200 mb-1">Conservation of Momentum</h4>
                <p className="text-neutral-400">Total momentum is always conserved: p₁ᵢ + p₂ᵢ = p₁f + p₂f</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-200 mb-1">Elastic Collisions</h4>
                <p className="text-neutral-400">Both momentum and kinetic energy are conserved (e = 1)</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-200 mb-1">Inelastic Collisions</h4>
                <p className="text-neutral-400">Momentum conserved, but kinetic energy is lost to heat/deformation (e = 0)</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-200 mb-1">Center of Mass</h4>
                <p className="text-neutral-400">The center of mass moves at constant velocity regardless of collision type</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
