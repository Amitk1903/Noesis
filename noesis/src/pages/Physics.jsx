import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';

export default function Physics() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Kinematics', 'Energy', 'Momentum', 'Fluids', 'Electromagnetism', 'Optics'];

  const simulations = [
    { category: 'Kinematics', name: 'Projectile Motion', link: '/projectile', icon: '🎯', color: 'blue' },
    { category: 'Energy', name: 'Pendulum Simulator', link: '/pendulum', icon: '⚖️', color: 'purple' },
    { category: 'Momentum', name: 'Collision Lab', link: '/collision', icon: '💥', color: 'red' },
    { category: 'Fluids', name: "Pascal's Law", link: '/pascals-law', icon: '⚙️', color: 'cyan' },
    { category: 'Electromagnetism', name: 'Magnetic Field', link: '/magnetic-field', icon: '🧲', color: 'purple' },
    { category: 'Electromagnetism', name: "Faraday's Law", link: '/faradays-law', icon: '🔋', color: 'green' },
    { category: 'Optics', name: 'Refraction', link: '/refraction', icon: '🔦', color: 'cyan' },
    { category: 'Optics', name: 'Lens Simulator', link: '/lens-simulator', icon: '🔍', color: 'blue' },
    { category: 'Optics', name: 'Prism Dispersion', link: '/prism', icon: '🌈', color: 'pink' }
  ];

  const filteredSimulations = activeFilter === 'All' 
    ? simulations 
    : simulations.filter(sim => sim.category === activeFilter);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 bg-gradient-to-br from-neutral-900 to-black p-8 pt-32">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Physics Simulations</h1>
              <p className="text-neutral-400">Explore interactive physics concepts</p>
            </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-neutral-700'
                  }`}
                >
                  {filter}
                  {filter !== 'All' && (
                    <span className="ml-2 text-xs opacity-70">
                      ({simulations.filter(s => s.category === filter).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {filteredSimulations.map((sim, idx) => {
              const categoryColors = {
                blue: { from: 'from-blue-500', to: 'to-cyan-500', bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
                purple: { from: 'from-purple-500', to: 'to-pink-500', bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
                red: { from: 'from-blue-500', to: 'to-red-500', bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' },
                cyan: { from: 'from-blue-500', to: 'to-purple-500', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400' },
                green: { from: 'from-green-500', to: 'to-emerald-500', bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
                pink: { from: 'from-pink-500', to: 'to-purple-500', bg: 'bg-pink-500/20', border: 'border-pink-500/30', text: 'text-pink-400' }
              };
              
              const colors = categoryColors[sim.color];
              
              return (
                <Link 
                  key={idx}
                  to={sim.link} 
                  className="group block bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-800/50"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both`
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center text-2xl`}>
                      {sim.icon}
                    </div>
                    <div className={`px-2 py-1 ${colors.bg} border ${colors.border} rounded text-xs ${colors.text} font-medium`}>
                      {sim.category}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-neutral-100">{sim.name}</h3>
                </Link>
              );
            })}

          </div>
        </main>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}