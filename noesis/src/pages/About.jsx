import Header from '../components/Header';

export default function About() {
  const features = [
    {
      icon: '⚡',
      title: 'Real-Time Physics',
      description: 'All simulations run at 60fps with accurate physics calculations'
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Modern, clean interface that puts focus on the physics'
    },
    {
      icon: '📱',
      title: 'Fully Responsive',
      description: 'Works seamlessly on desktop, tablet, and mobile devices'
    },
    {
      icon: '🎯',
      title: 'Interactive Learning',
      description: 'Learn by doing - adjust parameters and see immediate results'
    }
  ];

  const technologies = [
    { name: 'React', purpose: 'UI Framework' },
    { name: 'Canvas API', purpose: 'High-performance rendering' },
    { name: 'Tailwind CSS', purpose: 'Modern styling' },
    { name: 'Custom Physics Engine', purpose: 'Accurate simulations' }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Noesis
            </h1>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-4">
              Interactive physics and mathematics simulations for students, educators, and curious minds
            </p>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Explore complex physics concepts through beautiful, interactive visualizations. 
              No textbooks required - just curiosity and a willingness to experiment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-8 hover:border-neutral-700 transition-all">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-neutral-100">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-12 mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-neutral-100">Our Mission</h2>
            <p className="text-lg text-neutral-300 text-center max-w-3xl mx-auto leading-relaxed">
              We believe physics should be experienced, not just read about. Noesis transforms abstract 
              equations into interactive experiences, making complex concepts intuitive and accessible 
              to everyone. Whether you're a student struggling with homework, a teacher looking for 
              engaging demonstrations, or just someone who loves science - we've got you covered.
            </p>
          </div>

          <div className="bg-neutral-900/50 backdrop-blur border border-neutral-800 rounded-2xl p-12 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-neutral-100">Built With</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technologies.map((tech, idx) => (
                <div key={idx} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2 text-neutral-100">{tech.name}</h3>
                  <p className="text-sm text-neutral-400">{tech.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                4+
              </div>
              <div className="text-neutral-400">Physics Simulations</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                60fps
              </div>
              <div className="text-neutral-400">Smooth Animations</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-neutral-400">Free & Open</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-100">What's Next?</h2>
            <p className="text-neutral-300 mb-6">
              We're constantly adding new simulations and features. Upcoming additions include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🌊</div>
                <div>
                  <h3 className="font-semibold text-neutral-100">Wave Mechanics</h3>
                  <p className="text-sm text-neutral-400">Interference, diffraction, and standing waves</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔄</div>
                <div>
                  <h3 className="font-semibold text-neutral-100">Circular Motion</h3>
                  <p className="text-sm text-neutral-400">Centripetal force and orbital mechanics</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <h3 className="font-semibold text-neutral-100">Electromagnetism</h3>
                  <p className="text-sm text-neutral-400">Electric fields and magnetic forces</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">📊</div>
                <div>
                  <h3 className="font-semibold text-neutral-100">Data Export</h3>
                  <p className="text-sm text-neutral-400">Download simulation data for analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
