// Shared UI primitives
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { IconChevronDown, IconX } from './Icons.jsx';

const cn = (...a) => a.filter(Boolean).join(' ');

function Button({ children, variant='primary', size='md', icon=undefined, iconRight=undefined, className='', ...rest }) {
  const sizes = {
    sm: 'h-9 px-3.5 text-sm gap-1.5',
    md: 'h-11 px-5 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
  };
  const variants = {
    primary: 'btn-gradient text-white shadow-soft hover:shadow-lift font-semibold',
    dark: 'bg-ink text-beige hover:bg-inkSoft font-semibold',
    ghost: 'bg-transparent text-ink hover:bg-ink/5 font-medium',
    outline: 'border border-ink/15 bg-white text-ink hover:border-teal hover:text-teal font-medium',
    beige: 'bg-beigeDeep text-ink hover:bg-beige font-medium',
    danger: 'bg-red-50 text-red-700 hover:bg-red-100 font-medium',
  };
  return (
    <button className={cn('rounded-xl inline-flex items-center justify-center transition no-tap', sizes[size], variants[variant], className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

function Card({ children, className='', padded=true }) {
  return <div className={cn('bg-white rounded-2xl shadow-soft border border-ink/[.04]', padded && 'p-6', className)}>{children}</div>;
}

function Badge({ children, tone='teal', dot=false, className='' }) {
  const tones = {
    teal: 'bg-teal/10 text-tealDeep',
    orange: 'bg-orange/15 text-orange',
    yellow: 'bg-yellow/25 text-ink',
    beige: 'bg-beigeDeep text-ink/70',
    red: 'bg-red-50 text-red-600',
    green: 'bg-emerald-50 text-emerald-700',
    ink: 'bg-ink text-beige',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', tones[tone], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', tone==='teal'?'bg-teal':tone==='orange'?'bg-orange':tone==='red'?'bg-red-500':tone==='green'?'bg-emerald-500':'bg-ink/50')} />}
      {children}
    </span>
  );
}

function Input({ icon, className='', wrapperClass='', type='text', ...rest }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cn('relative', wrapperClass)}>
      {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40">{icon}</span>}
      <input
        type={inputType}
        className={cn(
          'w-full h-11 rounded-xl border border-ink/15 bg-white text-sm text-ink placeholder:text-ink/40',
          'focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition',
          icon ? 'pl-10 pr-12' : isPassword ? 'pl-4 pr-12' : 'px-4',
          className,
        )}
        {...rest}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition flex items-center justify-center h-8 w-8 rounded-lg hover:bg-ink/5 focus:outline-none"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

function Select({ children, className='', ...rest }) {
  return (
    <div className="relative">
      <select
        className={cn(
          'appearance-none h-11 w-full rounded-xl border border-ink/15 bg-white text-sm text-ink pl-4 pr-10',
          'focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10 transition',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none">
        <IconChevronDown size={16}/>
      </span>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className="inline-flex items-center gap-3 no-tap"
      type="button"
    >
      <span className={cn('w-11 h-6 rounded-full relative transition', checked ? 'bg-teal' : 'bg-ink/15')}>
        <span className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </span>
      {label && <span className="text-sm text-ink/80">{label}</span>}
    </button>
  );
}

function Modal({ open, onClose, title, subtitle, children, footer, width='max-w-lg' }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div
        className={cn('relative bg-white rounded-2xl shadow-lift w-full', width)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-6 border-b border-ink/5">
          <div>
            <h3 className="font-display text-2xl text-ink">{title}</h3>
            {subtitle && <p className="text-sm text-ink/60 mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-beige hover:bg-beigeDeep flex items-center justify-center text-ink/60">
            <IconX size={16}/>
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-ink/5 flex items-center justify-end gap-3 bg-beige/40 rounded-b-2xl">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}


// Avatar — colored initial, no-art-required
function Avatar({ name, size=36, tone, src }) {
  if (src) {
    const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
    const fullSrc = src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")
      ? src
      : `${apiBase}${src}`;
    return (
      <img
        src={fullSrc}
        alt={name}
        className="inline-block rounded-full object-cover border border-ink/5"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
  const tones = ['bg-teal text-white','bg-orange text-white','bg-ink text-beige','bg-yellow text-ink','bg-tealDeep text-white'];
  const t = tone ?? tones[(name.charCodeAt(0) + name.length) % tones.length];
  return (
    <span
      className={cn('inline-flex items-center justify-center rounded-full font-semibold', t)}
      style={{ width: size, height: size, fontSize: size*0.38 }}
    >{initials}</span>
  );
}

// Sparkline
function Sparkline({ data, stroke='#38938E', fill='rgba(56,147,142,0.12)', w=120, h=36 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v,i) => [i/(data.length-1)*w, h - ((v-min)/(max-min||1))*(h-4) - 2]);
  const d = pts.map((p,i) => (i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const fillD = d + ` L ${w},${h} L 0,${h} Z`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <path d={fillD} fill={fill} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

Object.assign(window, { cn, Button, Card, Badge, Input, Select, Toggle, Modal, Avatar, Sparkline });

export { cn, Button, Card, Badge, Input, Select, Toggle, Modal, Avatar, Sparkline };
