import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Examples() {
  const examples = [
    {
      category: 'Kinematics',
      gradient: 'from-blue-500 to-cyan-500',
      items: [
        {
          title: 'Long Range Artillery',
          params: 'Velocity: 100 m/s, Angle: 45°, No air resistance',
          result: 'Maximum range achieved at 45° angle',
          link: '/projectile',
          icon: '🎯'
        },
        {
          title: 'Realistic Baseball Throw',
          params: 'Velocity: 40 m/s, Angle: 30°, With air resistance',
          result: 'Shows how drag affects trajectory',
          link: '/projectile',
          icon: '⚾'
        },
        {
          title: 'Low Gravity Moon Shot',
          params: 'Velocity: 50 m/s, Gravity: 1.62 m/s²',
          result: 'Projectile travels much farther',
          link: '/projectile',
          icon: '🌙'
        }
      ]
    },
    {
      category: 'Energy',
      gradient: 'from-purple-500 to-pink-500',
      items: [
        {
          title: 'Large Amplitude Swing',
          params: 'Angle: 60°, Length: 200px, No damping',
          result: 'Non-linear behavior at large angles',
          link: '/pendulum',
          icon: '⚖️'
        },
        {
          title: 'Damped Oscillation',
          params: 'Angle: 45°, Damping: 0.2',
          result: 'Energy gradually dissipates over time',
          link: '/pendulum',
          icon: '📉'
        },
        {
          title: 'Low Gravity Pendulum',
          params: 'Angle: 30°, Gravity: 3 m/s²',
          result: 'Slower, longer period of oscillation',
          link: '/pendulum',
          icon: '🪐'
        }
      ]
    },
    {
      category: 'Momentum',
      gradient: 'from-red-500 to-orange-500',
      items: [
        {
          title: 'Equal Mass Head-On',
          params: 'Mass 1: 5kg at 3 m/s, Mass 2: 5kg at -3 m/s, Elastic',
          result: 'Balls exchange velocities perfectly',
          link: '/collision',
          icon: '💥'
        },
        {
          title: 'Heavy vs Light',
          params: 'Mass 1: 2kg at 5 m/s, Mass 2: 10kg at rest, Elastic',
          result: 'Light ball bounces back, heavy moves slowly',
          link: '/collision',
          icon: '🎱'
        },
        {
          title: 'Perfectly Inelastic',
          params: 'Mass 1: 5kg at 4 m/s, Mass 2: 5kg at 0 m/s, e=0',
          result: 'Balls stick together, move as one',
          link: '/collision',
          icon: '🔗'
        }
      ]
    },
    {
      category: 'Fluids',
      gradient: 'from-blue-500 to-purple-500',
      items: [
        {
          title: 'Car Hydraulic Jack',
          params: 'Input: 10 cm², Force: 100N, Output: 80 cm²',
          result: '8× force multiplication (800N output)',
          link: '/pascals-law',
          icon: '🚗'
        },
        {
          title: 'Brake System',
          params: 'Small piston: 5 cm², Large: 40 cm², Force: 50N',
          result: 'Demonstrates automotive brake mechanics',
          link: '/pascals-law',
          icon: '🛑'
        },
        {
          title: 'Industrial Press',
          params: 'Input: 15 cm², Force: 200N, Output: 100 cm²',
          result: 'Massive 1333N crushing force',
          link: '/pascals-law',
          icon: '⚙️'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Examples & Scenarios
            </h1>
            <p className="text-lg text-neutral-400 max-w-3xl">
              Pre-configured examples to help you understand different physics concepts. Try these setups and modify them to explore.
            </p>
          </div>

          <div className="space-y-8">
            {examples.map((category, idx) => (
              <div key={idx} className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-8">
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                    {category.category}
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r ${category.gradient} rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.items.map((example, itemIdx) => (
                    <Link
                      key={itemIdx}
                      to={example.link}
                      className="group bg-neutral-800/30 hover:bg-neutral-800/60 border border-neutral-700/50 hover:border-neutral-600 rounded-xl p-6 transition-all"
                    >
                      <div className="text-4xl mb-4">{example.icon}</div>
                      <h3 className="text-lg font-semibold mb-3 text-neutral-100 group-hover:text-pink-400 transition-colors">
                        {example.title}
                      </h3>
                      <div className="space-y-2 mb-4">
                        <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Parameters</div>
                        <p className="text-sm text-neutral-400">{example.params}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Expected Result</div>
                        <p className="text-sm text-neutral-300 font-medium">{example.result}</p>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-pink-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Try it now</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-neutral-100">Pro Tip</h3>
                <p className="text-neutral-300 mb-4">
                  These examples are just starting points. Once you load an example, experiment by changing parameters 
                  to see how they affect the outcome. There's no right or wrong - physics is all about exploration!
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-sm text-pink-400">
                    Adjust values
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-400">
                    Observe results
                  </span>
                  <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm text-indigo-400">
                    Build intuition
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
