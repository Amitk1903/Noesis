import Header from '../components/Header';

export default function Documentation() {
  const sections = [
    {
      title: 'Getting Started',
      icon: '🚀',
      items: [
        {
          name: 'What is Noesis?',
          description: 'Interactive platform for exploring physics and mathematics through real-time simulations',
          link: '#what-is-noesis'
        },
        {
          name: 'Quick Start Guide',
          description: 'Learn the basics and start experimenting with simulations in minutes',
          link: '#quick-start'
        },
        {
          name: 'Navigation',
          description: 'Understand the interface and find your way around the platform',
          link: '#navigation'
        }
      ]
    },
    {
      title: 'Physics Simulations',
      icon: '⚛️',
      items: [
        {
          name: 'Kinematics',
          description: 'Projectile motion with velocity, angle, and air resistance controls',
          link: '/projectile'
        },
        {
          name: 'Energy & Oscillations',
          description: 'Pendulum simulation demonstrating SHM and energy conservation',
          link: '/pendulum'
        },
        {
          name: 'Momentum',
          description: 'Elastic and inelastic collisions with conservation laws',
          link: '/collision'
        },
        {
          name: 'Fluids',
          description: 'Pascal\'s law and hydraulic pressure transmission',
          link: '/pascals-law'
        }
      ]
    },
    {
      title: 'Features',
      icon: '✨',
      items: [
        {
          name: 'Real-Time Physics',
          description: 'All simulations run in real-time with accurate physics calculations',
          link: '#real-time'
        },
        {
          name: 'Customizable Parameters',
          description: 'Adjust variables to see how they affect the simulation behavior',
          link: '#parameters'
        },
        {
          name: 'Visual Feedback',
          description: 'Graphs, vectors, and trails help visualize complex physics concepts',
          link: '#visuals'
        },
        {
          name: 'Educational Content',
          description: 'Each simulation includes explanations of the underlying physics',
          link: '#education'
        }
      ]
    },
    {
      title: 'Technical Details',
      icon: '🔧',
      items: [
        {
          name: 'Rendering',
          description: 'Canvas-based rendering for smooth 60fps animations',
          link: '#rendering'
        },
        {
          name: 'Physics Engine',
          description: 'Custom physics calculations using numerical integration methods',
          link: '#physics-engine'
        },
        {
          name: 'Performance',
          description: 'Optimized for both desktop and mobile devices',
          link: '#performance'
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
              Documentation
            </h1>
            <p className="text-lg text-neutral-400 max-w-3xl">
              Everything you need to know about using Noesis. Explore interactive physics and mathematics simulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-8 hover:border-neutral-700 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center text-2xl">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-100">{section.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.link}
                      className="block p-4 rounded-lg bg-neutral-800/30 hover:bg-neutral-800/60 border border-neutral-700/50 hover:border-neutral-600 transition-all group"
                    >
                      <h3 className="font-semibold text-neutral-100 mb-1 group-hover:text-pink-400 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-neutral-400">{item.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-6">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-100">Learn by Doing</h3>
              <p className="text-sm text-neutral-400">
                Interact with simulations to build intuition about physics concepts
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-100">Experiment Freely</h3>
              <p className="text-sm text-neutral-400">
                No wrong answers - adjust parameters and see what happens
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-2xl p-6">
              <div className="text-3xl mb-3">🔬</div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-100">Real Physics</h3>
              <p className="text-sm text-neutral-400">
                All simulations based on actual physics equations and principles
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
