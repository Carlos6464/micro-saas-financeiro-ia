'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Wallet, 
  LayoutDashboard, 
  ArrowRightLeft,
  LifeBuoy, 
  LogOut, 
  Tag,
  Menu // Ícone do Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/store/auth-store';

// Import do Sheet do Shadcn
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from './button';

// --- CONFIGURAÇÃO DO MENU ---
const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transações', href: '/transactions', icon: ArrowRightLeft },
    { name: 'Categorias', href: '/categories', icon: Tag },
];

// --- COMPONENTE DE CONTEÚDO (Reutilizável) ---
interface SidebarContentProps {
  onNavigate?: () => void; // Função opcional para fechar o menu ao clicar
}

function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full justify-between py-6">
       <div className="flex flex-col gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6">
          <div className="flex items-center justify-center size-10 rounded-xl bg-primary shadow-[0_0_15px_rgba(70,236,19,0.4)]">
            <Wallet className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-bold leading-none tracking-tight">FinSaaS</h1>
            <p className="text-primary text-xs font-medium uppercase tracking-wider mt-1">Pro Plan</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate} // Fecha o menu mobile se a função existir
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-full transition-all",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
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
      <div className="flex flex-col gap-4 px-4">
        <button className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all w-full text-left">
          <LifeBuoy className="w-5 h-5" />
          <span className="text-sm font-medium">Suporte</span>
        </button>
        
        <div className="h-px bg-slate-800 w-full"></div>
        
        <div className="flex items-center justify-between px-2 group">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-slate-700 ring-2 ring-primary/20 flex items-center justify-center text-white font-bold">
               {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-white text-sm font-semibold truncate max-w-[120px]">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-slate-400 text-xs truncate max-w-[120px]">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// --- SIDEBAR DESKTOP (Fixa) ---
export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-slate-800 bg-[#0b1120] h-screen sticky top-0">
      <SidebarContent />
    </aside>
  );
}

// --- SIDEBAR MOBILE (Sheet / Gaveta) ---
export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 mr-2">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      
      {/* Conteúdo da Gaveta */}
      <SheetContent side="left" className="p-0 bg-[#0b1120] border-r-slate-800 w-72">
        <SheetHeader className="sr-only">
            <SheetTitle>Menu de Navegação</SheetTitle>
        </SheetHeader>
        {/* Passamos setOpen(false) para fechar o menu ao clicar em um link */}
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}