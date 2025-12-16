'use client';

import { Bell, Plus } from 'lucide-react';
import { MobileSidebar } from './sidebar'; 

interface HeaderProps {
  title: string;
  subtitle?: string;
  onAddTransaction?: () => void; // A ação do clique
  actionLabel?: string;          // O texto do botão (Novo: "Nova Categoria", etc)
}

export function Header({ title, subtitle, onAddTransaction, actionLabel }: HeaderProps) {
  return (
    <header className="flex-none px-4 lg:px-10 py-5 border-b border-slate-800/50 bg-background/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-8xl mx-auto w-full flex items-center justify-between gap-4">
        
        {/* Lado Esquerdo */}
        <div className="flex items-center gap-2 lg:gap-0">
          <MobileSidebar />

          <div className="flex flex-col">
            <h2 className="text-white text-xl lg:text-3xl font-bold tracking-tight truncate max-w-[200px] sm:max-w-none">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-xs lg:text-sm mt-1 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {/* Lado Direito */}
        <div className="flex items-center gap-2 lg:gap-3">
          <button className="hidden sm:flex size-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-white hover:border-primary/50 hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          {/* Renderiza botão apenas se tiver função E label */}
          {onAddTransaction && (
            <button 
              onClick={onAddTransaction}
              className="flex size-10 lg:w-auto lg:h-10 items-center justify-center lg:gap-2 rounded-full bg-primary lg:px-6 text-sm font-bold text-primary-foreground shadow-[0_0_20px_rgba(70,236,19,0.3)] hover:shadow-[0_0_30px_rgba(70,236,19,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95"
              aria-label={actionLabel || "Adicionar"}
            >
              <Plus className="w-5 h-5" />
              {/* Usa o texto passado ou um padrão */}
              <span className="whitespace-nowrap hidden lg:inline-block">
                {actionLabel || "Novo Item"}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}