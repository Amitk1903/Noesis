import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import CardNav from '@/component/CardNav';

export default function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const navItems = [
    {
      label: 'Mathematics',
      bgColor: 'rgba(102, 126, 234, 0.1)',
      textColor: '#667eea',
      links: [
        { label: 'Calculus', href: '/math', ariaLabel: 'Go to Calculus' },
        { label: 'Algebra', href: '/math', ariaLabel: 'Go to Algebra' },
        { label: 'Geometry', href: '/math', ariaLabel: 'Go to Geometry' }
      ]
    },
    {
      label: 'Physics',
      bgColor: 'rgba(168, 85, 247, 0.1)',
      textColor: '#a855f7',
      links: [
        { label: 'Overview', href: '/physics', ariaLabel: 'Physics Overview' },
        { label: 'Kinematics', href: '/projectile', ariaLabel: 'Go to Projectile Motion' },
        { label: 'Energy', href: '/pendulum', ariaLabel: 'Go to Pendulum Simulator' },
        { label: 'Momentum', href: '/collision', ariaLabel: 'Go to Collision Lab' },
        { label: 'Fluids', href: '/pascals-law', ariaLabel: "Go to Pascal's Law" },
        { label: 'Electromagnetism', href: '/magnetic-field', ariaLabel: 'Go to Magnetic Field' },
        { label: 'Optics', href: '/refraction', ariaLabel: 'Go to Refraction' }
      ]
    },
    {
      label: 'Resources',
      bgColor: 'rgba(236, 72, 153, 0.1)',
      textColor: '#ec4899',
      links: [
        { label: 'Documentation', href: '/documentation', ariaLabel: 'View Documentation' },
        { label: 'Examples', href: '/examples', ariaLabel: 'View Examples' },
        { label: 'About', href: '/about', ariaLabel: 'About Noesis' }
      ]
    }
  ];

  return (
    <header className="fixed w-full top-0 z-50 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex-1">
          <CardNav
            logoText="Noesis"
            onLogoClick={() => navigate('/')}
            items={navItems}
            baseColor="#121212"
            menuColor="#ffffff"
            buttonBgColor="#667eea"
            buttonTextColor="#ffffff"
          />
        </div>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-xl bg-neutral-900/50 backdrop-blur border border-neutral-800 hover:border-neutral-700 transition-all hover:bg-neutral-800/50 text-neutral-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
