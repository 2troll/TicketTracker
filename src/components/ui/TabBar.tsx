import { NavLink } from 'react-router-dom';
import { MapPinned, BarChart3, Plus, Wallet, FolderOpen } from 'lucide-react';

const items = [
  { to: '/',          icon: MapPinned,  label: 'Map' },
  { to: '/analytics', icon: BarChart3,  label: 'Stats' },
  { to: '/add',       icon: Plus,       label: 'Add', primary: true },
  { to: '/currency',  icon: Wallet,     label: 'FX' },
  { to: '/tickets',   icon: FolderOpen, label: 'Library' },
];

export function TabBar() {
  return (
    <div className="fixed left-0 right-0 bottom-0 z-[900] pointer-events-none">
      <div
        className="max-w-[560px] mx-auto px-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
      >
        <div className="glass-strong rounded-full h-16 flex items-stretch justify-between px-1.5 pointer-events-auto shadow-float">
          {items.map(({ to, icon: Icon, label, primary }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `press flex-1 flex flex-col items-center justify-center gap-0.5 rounded-full ${
                  isActive ? 'text-accent-600 dark:text-accent-300' : 'text-ink-3'
                }`
              }
              aria-label={label}
            >
              {({ isActive }) =>
                primary ? (
                  <div className="w-11 h-11 rounded-full grid place-items-center bg-gradient-to-br from-accent-500 to-[#9b5bff] text-white shadow-[0_8px_18px_-6px_rgba(59,91,255,.55)]">
                    <Icon size={20} strokeWidth={2.6} />
                  </div>
                ) : (
                  <>
                    <Icon size={21} strokeWidth={isActive ? 2.6 : 2} />
                    <span className="text-[10px] font-semibold tracking-wide leading-none mt-0.5">{label}</span>
                  </>
                )
              }
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
