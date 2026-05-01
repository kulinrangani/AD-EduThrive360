import {
  IconMenu,
  IconChevron,
  IconSearch,
  IconBell,
  IconPlus,
} from "./Icons.jsx";
import { Input, Button, Avatar } from "./UI.jsx";

function Navbar({ title, subtitle, onOpenMobileNav }) {
  return (
    <header className="sticky top-0 z-30 bg-beige/85 backdrop-blur-md border-b border-ink/5">
      <div className="px-5 lg:px-8 h-[72px] flex items-center gap-4">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden w-10 h-10 rounded-xl bg-white border border-ink/10 flex items-center justify-center text-ink/70"
        >
          <IconMenu size={20} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="hidden md:flex items-center gap-2 text-xs text-ink/50 mb-0.5">
            <span>EduThrive360</span>
            <IconChevron size={12} />
            <span className="text-ink/70 font-medium">{title}</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl text-ink leading-tight truncate">
            {subtitle ?? title}
          </h1>
        </div>

        {/* Search */}
        <div className="hidden md:block w-[320px]">
          <Input
            icon={<IconSearch size={16} />}
            placeholder="Search schools, users, reports…"
          />
        </div>

        {/* Alerts */}
        <button className="relative w-11 h-11 rounded-xl bg-white border border-ink/10 flex items-center justify-center text-ink/70 hover:text-teal hover:border-teal transition">
          <IconBell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange pulse-dot" />
        </button>

        {/* Quick action */}
        <Button
          size="md"
          className="hidden md:inline-flex"
          icon={<IconPlus size={16} />}
        >
          New
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-ink/10">
          <Avatar name="Aarav Mehta" size={40} />
          <div className="hidden lg:block">
            <div className="text-sm font-semibold leading-none">
              Aarav Mehta
            </div>
            <div className="text-[11px] text-ink/50 mt-1">
              Super Admin · India
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

window.Navbar = Navbar;
export { Navbar };
