'use client';

import { Bell, Plus } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onAddTransaction?: () => void; // Nova prop para ação do botão
}

export function Header({ title, subtitle, onAddTransaction }: HeaderProps) {
  return (
    <header className="flex-none px-6 py-5 lg:px-10 border-b border-slate-800/50 bg-background/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-8xl mx-auto w-full flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-white text-2xl lg:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex size-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-white hover:border-primary/50 hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          {/* Botão Corrigido */}
          <button 
            onClick={onAddTransaction}
            className="flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_0_20px_rgba(70,236,19,0.3)] hover:shadow-[0_0_30px_rgba(70,236,19,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="whitespace-nowrap">Nova Transação</span>
          </button>
        </div>
      </div>
    </header>
  );
}