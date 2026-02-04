import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';

export default function Projectile() {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const projectileRef = useRef(null);
  const trajectoryRef = useRef([]);
  
  const [velocity, setVelocity] = useState(50);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.81);
  const [height, setHeight] = useState(0);
  const [airResistance, setAirResistance] = useState(false);
  const [dragCoeff, setDragCoeff] = useState(0.47);
  const [stats, setStats] = useState({
    maxHeight: 0,
    range: 0,
    flightTime: 0,
    impactVelocity: 0
  });

  const scale = 2;
  const originX = 50;
  const originY = 550;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const updateCanvasSize = () => {
        const isMobile = window.innerWidth < 768;
        canvas.width = isMobile ? Math.min(window.innerWidth - 32, 600) : 1000;
        canvas.height = isMobile ? 400 : 600;
        draw();
      };
      
      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);
      return () => window.removeEventListener('resize', updateCanvasSize);
    }
  }, []);

  const launch = () => {
    reset();
    
    const v0 = velocity;
    const angleRad = angle * Math.PI / 180;
    const g = gravity;
    const h0 = height;
    
    projectileRef.current = {
      x: 0,
      y: h0,
      vx: v0 * Math.cos(angleRad),
      vy: v0 * Math.sin(angleRad),
      g: g,
      useAirResistance: airResistance,
      dragCoeff: dragCoeff,
      mass: 1,
      radius: 0.05,
      airDensity: 1.225,
      time: 0
    };
    
    trajectoryRef.current = [{ x: 0, y: h0 }];
    setStats(prev => ({ ...prev, maxHeight: h0 }));
    
    animate();
  };

  const reset = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    projectileRef.current = null;
    trajectoryRef.current = [];
    setStats({
      maxHeight: 0,
      range: 0,
      flightTime: 0,
      impactVelocity: 0
    });
    draw();
  };

  const animate = () => {
    if (!projectileRef.current) return;
    
    const dt = 0.016;
    const p = projectileRef.current;
    
    let ax = 0;
    let ay = -p.g;
    
    if (p.useAirResistance) {
      const v = Math.sqrt(p.vx ** 2 + p.vy ** 2);
      const area = Math.PI * p.radius ** 2;
      const dragForce = 0.5 * p.airDensity * v ** 2 * p.dragCoeff * area;
      const dragAccel = dragForce / p.mass;
      
      if (v > 0) {
        ax -= dragAccel * (p.vx / v);
        ay -= dragAccel * (p.vy / v);
      }
    }
    
    p.vx += ax * dt;
    p.vy += ay * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.time += dt;
    
    if (p.y > stats.maxHeight) {
      setStats(prev => ({ ...prev, maxHeight: p.y }));
    }
    
    trajectoryRef.current.push({ x: p.x, y: p.y });
    
    draw();
    
    if (p.y <= 0) {
      p.y = 0;
      setStats({
        maxHeight: stats.maxHeight,
        range: p.x,
        flightTime: p.time,
        impactVelocity: Math.sqrt(p.vx ** 2 + p.vy ** 2)
      });
      projectileRef.current = null;
      return;
    }
    
    if (p.x > 500 || p.y > 300) {
      projectileRef.current = null;
      return;
    }
    
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    ctx.strokeStyle = '#525252';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(canvas.width, originY);
    ctx.stroke();
    
    if (trajectoryRef.current.length > 1) {
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX + trajectoryRef.current[0].x * scale, originY - trajectoryRef.current[0].y * scale);
      for (let i = 1; i < trajectoryRef.current.length; i++) {
        ctx.lineTo(originX + trajectoryRef.current[i].x * scale, originY - trajectoryRef.current[i].y * scale);
      }
      ctx.stroke();
    }
    
    if (projectileRef.current) {
      const p = projectileRef.current;
      
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(originX + p.x * scale, originY - p.y * scale, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      const vecScale = 0.5;
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX + p.x * scale, originY - p.y * scale);
      ctx.lineTo(
        originX + p.x * scale + p.vx * vecScale,
        originY - p.y * scale - p.vy * vecScale
      );
      ctx.stroke();
      
      const angle = Math.atan2(-p.vy, p.vx);
      const headLen = 8;
      const endX = originX + p.x * scale + p.vx * vecScale;
      const endY = originY - p.y * scale - p.vy * vecScale;
      
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(angle - Math.PI / 6),
        endY + headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(angle + Math.PI / 6),
        endY + headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }
    
    ctx.fillStyle = '#737373';
    ctx.font = '12px monospace';
    ctx.fillText('10m', originX + 20 * scale - 15, originY - 5);
    ctx.strokeStyle = '#737373';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(originX, originY - 10);
    ctx.lineTo(originX + 20 * scale, originY - 10);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(originX, originY - 13);
    ctx.lineTo(originX, originY - 7);
    ctx.moveTo(originX + 20 * scale, originY - 13);
    ctx.lineTo(originX + 20 * scale, originY - 7);
    ctx.stroke();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex flex-col md:flex-row flex-1 overflow-hidden pt-16 md:pt-24">
          <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-neutral-800 p-4 md:p-5 space-y-3 md:space-y-4 overflow-y-auto max-h-[40vh] md:max-h-none">
            <div>
              <h2 className="text-sm font-medium mb-3 md:mb-4">Projectile Motion</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-neutral-500 mb-1 block">Initial Velocity (m/s)</label>
                <input 
                  type="number" 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-2 text-sm focus:outline-none focus:border-neutral-600" 
                  value={velocity}
                  onChange={(e) => setVelocity(parseFloat(e.target.value))}
                  min="0" 
                  max="200"
                />
              </div>
              
              <div>
                <label className="text-xs uppercase tracking-wider text-neutral-500 mb-1 block">Launch Angle (°)</label>
                <input 
                  type="number" 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-2 text-sm focus:outline-none focus:border-neutral-600" 
                  value={angle}
                  onChange={(e) => setAngle(parseFloat(e.target.value))}
                  min="0" 
                  max="90"
                />
              </div>
              
              <div>
                <label className="text-xs uppercase tracking-wider text-neutral-500 mb-1 block">Gravity (m/s²)</label>
                <input 
                  type="number" 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-2 text-sm focus:outline-none focus:border-neutral-600" 
                  value={gravity}
                  onChange={(e) => setGravity(parseFloat(e.target.value))}
                  min="0.1" 
                  max="50" 
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="text-xs uppercase tracking-wider text-neutral-500 mb-1 block">Initial Height (m)</label>
                <input 
                  type="number" 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-2 text-sm focus:outline-none focus:border-neutral-600" 
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value))}
                  min="0" 
                  max="100"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="airResistance" 
                className="w-4 h-4 bg-neutral-900 border border-neutral-800 rounded"
                checked={airResistance}
                onChange={(e) => setAirResistance(e.target.checked)}
              />
              <label htmlFor="airResistance" className="text-xs uppercase tracking-wider text-neutral-500">Air Resistance</label>
            </div>
            
            {airResistance && (
              <div>
                <label className="text-xs uppercase tracking-wider text-neutral-500 mb-1 block">Drag Coefficient</label>
                <input 
                  type="number" 
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-2 text-sm focus:outline-none focus:border-neutral-600" 
                  value={dragCoeff}
                  onChange={(e) => setDragCoeff(parseFloat(e.target.value))}
                  min="0" 
                  max="2" 
                  step="0.01"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 pt-2 md:pt-4">
              <button 
                onClick={launch}
                className="w-full bg-neutral-100 text-neutral-900 rounded-md py-2 text-sm font-medium hover:bg-neutral-200 transition active:bg-neutral-300"
              >
                Launch
              </button>
              <button 
                onClick={reset}
                className="w-full bg-neutral-800 text-neutral-200 rounded-md py-2 text-sm font-medium hover:bg-neutral-700 transition active:bg-neutral-600"
              >
                Reset
              </button>
            </div>
            
            <div className="pt-3 md:pt-4 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-1 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Max Height:</span>
                <span>{stats.maxHeight > 0 ? `${stats.maxHeight.toFixed(2)} m` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Range:</span>
                <span>{stats.range > 0 ? `${stats.range.toFixed(2)} m` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Flight Time:</span>
                <span>{stats.flightTime > 0 ? `${stats.flightTime.toFixed(2)} s` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Impact Velocity:</span>
                <span>{stats.impactVelocity > 0 ? `${stats.impactVelocity.toFixed(2)} m/s` : '—'}</span>
              </div>
            </div>
          </aside>

          <section className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-black p-4 overflow-auto">
            <canvas ref={canvasRef} className="border border-neutral-800 rounded max-w-full"></canvas>
          </section>
        </main>
      </div>
    </div>
  );
}
