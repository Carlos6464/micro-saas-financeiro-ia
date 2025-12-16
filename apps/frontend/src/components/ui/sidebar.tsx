'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Wallet, 
  LayoutDashboard, 
  ArrowRightLeft,
  LifeBuoy, 
  LogOut, 
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/auth-store'; // Assumindo que você tem isso do login

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transações', href: '/transactions', icon: ArrowRightLeft },
    { name: 'Categorias', href: '/categories', icon: Tag },
  ];

  return (
    <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-slate-800 bg-[#0b1120] p-6 h-screen sticky top-0">
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center size-10 rounded-xl bg-primary shadow-[0_0_15px_rgba(70,236,19,0.4)]">
            <Wallet className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-bold leading-none tracking-tight">FinSaaS</h1>
            <p className="text-primary text-xs font-medium uppercase tracking-wider mt-1">Pro Plan</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-full transition-all",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-text-secondary hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Support */}
      <div className="flex flex-col gap-4">
        <button className="flex items-center gap-4 px-4 py-3 rounded-full text-text-secondary hover:text-white hover:bg-white/5 transition-all w-full text-left">
          <LifeBuoy className="w-5 h-5" />
          <span className="text-sm font-medium">Suporte</span>
        </button>
        
        <div className="h-px bg-slate-800 w-full"></div>
        
        <div className="flex items-center justify-between px-2 group">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-slate-700 ring-2 ring-primary/20 flex items-center justify-center text-white">
               {/* Avatar Fallback */}
               {'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-white text-sm font-semibold truncate max-w-[120px]">{'Usuário'}</p>
              <p className="text-text-secondary text-xs truncate max-w-[120px]">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="text-text-secondary hover:text-danger transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}