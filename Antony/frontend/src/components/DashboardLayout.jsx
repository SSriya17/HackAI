import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ title, subtitle, navItems, children }) {
  return (
    <div className="flex w-full min-h-[calc(100vh-84px)] -ml-[calc(50vw-50%)] -mt-8 border-t border-border">
      <aside className="w-[250px] bg-sidebar border-r border-border py-8 flex flex-col">
        <div className="px-8 mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">NAVIGATION</span>
        </div>
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'px-4 py-3 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-foreground border border-border'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-12 max-w-[1200px]">
        <header className="mb-8">
          <h1 className="text-3xl font-serif font-medium mb-2">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-base">{subtitle}</p>}
        </header>
        <div className="mt-12">{children}</div>
      </main>
    </div>
  );
}
