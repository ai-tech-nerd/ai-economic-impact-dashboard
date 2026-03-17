import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="bg-surface-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-xl font-bold text-white">AI Impact</span>
            <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
              TRACKER
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium no-underline transition-colors ${
                  pathname === item.path
                    ? 'bg-primary-600 text-white'
                    : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <MobileMenuButton />
        </div>
      </div>

      <MobileNav pathname={pathname} />
    </header>
  );
}

function MobileMenuButton() {
  return (
    <button
      className="md:hidden p-2 text-surface-300 hover:text-white"
      onClick={() => {
        const nav = document.getElementById('mobile-nav');
        nav?.classList.toggle('hidden');
      }}
      aria-label="Toggle navigation menu"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav id="mobile-nav" className="hidden md:hidden border-t border-surface-700 pb-3">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`block px-4 py-2 text-sm no-underline ${
            pathname === item.path
              ? 'bg-primary-600 text-white'
              : 'text-surface-300 hover:bg-surface-800'
          }`}
          onClick={() => document.getElementById('mobile-nav')?.classList.add('hidden')}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
