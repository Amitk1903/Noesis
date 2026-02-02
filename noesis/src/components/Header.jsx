import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
  return (
    <header className="glass fixed w-full top-0 z-50 px-8 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/">
          <h1 className="text-3xl title-font font-bold gradient-text tracking-tight">NOESIS</h1>
        </Link>
        <nav className="flex gap-8 text-sm font-medium">
          <Link 
            to="/math" 
            className={`transition-colors duration-300 tracking-wide ${
              location.pathname.includes('/math') ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Math
          </Link>
          <Link 
            to="/physics" 
            className={`transition-colors duration-300 tracking-wide ${
              location.pathname.includes('/physics') || location.pathname.includes('/projectile') 
                ? 'text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Physics
          </Link>
        </nav>
      </div>
    </header>
  );
}
