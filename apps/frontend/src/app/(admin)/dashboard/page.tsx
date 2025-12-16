'use client';

import { Header } from '@/components/ui/header';
import { cn } from '@/lib/utils';
import { 
  Wallet, TrendingUp, TrendingDown, 
  PenTool, Car, ShoppingCart, 
  Briefcase, Music, ArrowUp, ArrowDown 
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      {/* Header específico desta página */}
      <Header 
        title="Visão Geral" 
        subtitle="Bem-vindo de volta, aqui está o resumo financeiro de hoje." 
      />

      {/* Conteúdo com Scroll */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
          
          {/* Cards de KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KpiCard 
              title="Saldo Total"
              value="R$ 24.500,00"
              change="+12% vs mês ant."
              icon={Wallet}
              trend="up"
            />
            <KpiCard 
              title="Receitas do Mês"
              value="R$ 8.250,00"
              change="+5% vs mês ant."
              icon={TrendingUp}
              trend="up"
            />
            <KpiCard 
              title="Despesas do Mês"
              value="R$ 3.400,00"
              change="-2% vs mês ant."
              icon={TrendingDown}
              trend="down"
              isDanger
            />
          </div>

          {/* AREA DE GRÁFICOS E TABELAS (Mantive o seu código original resumido aqui) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
             {/* ... Seus gráficos aqui ... */}
             <div className="glass-panel p-6 rounded-2xl xl:col-span-2 h-[400px] flex items-center justify-center text-slate-400">
                Gráfico de Evolução (Código SVG)
             </div>
             <div className="glass-panel p-6 rounded-2xl h-[400px] flex items-center justify-center text-slate-400">
                Gráfico de Categorias
             </div>
          </div>
          
          {/* Tabela de Transações */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Últimas Transações</h3>
            {/* ... Sua tabela ... */}
          </div>

        </div>
      </div>
    </>
  );
}

// Componentes Auxiliares (KpiCard, etc) continuam aqui ou em arquivos separados...
function KpiCard({ title, value, change, icon: Icon, trend, isDanger }: any) {
    return (
      <div className={cn(
        "p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group transition-all bg-slate-800/40 border border-white/5 backdrop-blur-md",
        isDanger ? "hover:border-red-500/30" : "hover:border-primary/30"
      )}>
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Icon className={cn("w-24 h-24", isDanger ? "text-red-500" : "text-primary")} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
          <p className="text-white text-3xl font-bold mt-1 tracking-tight">{value}</p>
        </div>
      </div>
    );
}