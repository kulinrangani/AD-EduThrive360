import {
  IconHome,
  IconSchool,
  IconUsers,
  IconBell,
  IconGear,
  IconChart,
  IconHeart,
  IconLogout,
} from './Icons.jsx';
import { cn, Avatar } from './UI.jsx';

function Sidebar({ current, onNav, collapsed, onToggleCollapsed, onLogout, user }) {
  const roleLabel = user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'org_admin' ? 'Org Admin' : 'Admin';
  const items = [
    { key: 'dashboard', label: 'Dashboard', icon: <IconHome size={20}/> },
    { key: 'quizzes', label: 'Quizzes', icon: <IconChart size={20}/> },
    { key: 'organizations', label: 'Organizations', icon: <IconSchool size={20}/> },
    { key: 'users',     label: 'Users',     icon: <IconUsers size={20}/> },
    { key: 'wellness',  label: 'Wellness',  icon: <IconHeart size={20}/> },
    { key: 'alerts',    label: 'Alerts',    icon: <IconBell size={20}/>, badge: '3', badgeTone: 'orange' },
    { key: 'reports',   label: 'Reports',   icon: <IconChart size={20}/> },
    { key: 'settings',  label: 'Settings',  icon: <IconGear size={20}/> },
  ];
  return (
    <aside
      className={cn(
        'bg-ink text-beige relative flex flex-col transition-[width] duration-300 shrink-0 grain overflow-hidden',
        'sticky top-0 h-screen',
        collapsed ? 'w-[76px]' : 'w-[248px]',
      )}
    >
      {/* Logo — sticky top */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-yellow flex items-center justify-center shrink-0 shadow-lift">
          <span className="font-display text-ink font-bold text-lg">E</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-display text-[17px] leading-none text-beige">EduThrive<span className="text-orange">360</span></div>
            <div className="text-[11px] text-beige/50 mt-1 tracking-wide uppercase">{roleLabel}</div>
          </div>
        )}
      </div>

      <div className="px-3 pt-2 pb-1 shrink-0">
        {!collapsed && <div className="text-[11px] uppercase tracking-wider text-beige/40 px-3 mb-2">Workspace</div>}
      </div>

      <nav className="px-3 flex-1 min-h-0 overflow-y-auto scrollbar">
        {items.map((it) => {
          const active = current === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onNav(it.key)}
              className={cn(
                'w-full flex items-center gap-3 px-3 h-11 rounded-xl mb-1 no-tap transition-all',
                active ? 'bg-teal text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]' : 'text-beige/75 hover:bg-white/5 hover:text-beige',
                collapsed && 'justify-center px-0',
              )}
              title={collapsed ? it.label : ''}
            >
              <span className="shrink-0">{it.icon}</span>
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1 text-left">{it.label}</span>
                  {it.badge && (
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 min-w-[20px] h-5 rounded-md flex items-center justify-center',
                      it.badgeTone === 'orange' ? 'bg-orange text-ink' : active ? 'bg-white/20 text-white' : 'bg-white/10 text-beige',
                    )}>{it.badge}</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Wellness mini card — sticky bottom */}
      {!collapsed && (
        <div className="px-4 pb-4 shrink-0">
          <div className="rounded-2xl p-4 bg-gradient-to-br from-teal/30 to-orange/20 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-yellow pulse-dot"/>
              <span className="text-[11px] uppercase tracking-wider text-beige/80 font-semibold">System healthy</span>
            </div>
            <p className="text-sm text-beige/90 leading-snug">
              {user?.organizationId?.name
                ? `${user.organizationId.name} workspace`
                : 'Platform workspace active.'}
            </p>
          </div>
        </div>
      )}

      {/* User footer — sticky bottom */}
      <div className={cn('border-t border-white/5 p-3 flex items-center gap-3 shrink-0', collapsed && 'justify-center')}>
        <Avatar name={user?.fullName ?? 'Admin'} size={38}/>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">{user?.fullName ?? 'Signed in'}</div>
            <div className="text-[11px] text-beige/50 truncate">{user?.email ?? ''}</div>
          </div>
        )}
        {!collapsed && (
          <button onClick={onLogout} title="Logout" className="w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center text-beige/60 hover:text-beige transition">
            <IconLogout size={18}/>
          </button>
        )}
      </div>

    </aside>
  );
}

window.Sidebar = Sidebar;
export { Sidebar };
