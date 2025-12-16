import Link from 'next/link';
import { ArrowRight, PiggyBank, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* --- HEADER --- */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <PiggyBank className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">FinSaaS</span>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Acessar Sistema</Button>
          </Link>
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 relative overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10" />

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-6">
          O controle financeiro que o seu negócio <span className="text-primary">merece</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Gerencie fluxo de caixa, investimentos e despesas com o poder da Inteligência Artificial. Simples, rápido e seguro.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-12 rounded-full gap-2">
              Começar Agora <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* --- FEATURES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl text-left">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Rápido e Fluido"
            description="Interface pensada para produtividade. Lance contas em segundos."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-green-400" />}
            title="Segurança Total"
            description="Seus dados criptografados e protegidos com os melhores padrões."
          />
          <FeatureCard 
            icon={<PiggyBank className="w-6 h-6 text-primary" />}
            title="IA Financeira"
            description="Insights automáticos sobre onde você pode economizar mais."
          />
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-6 border-t border-border/40 text-center text-sm text-muted-foreground">
        © 2025 FinSaaS Inc. Todos os direitos reservados.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="mb-4 p-3 bg-secondary/50 rounded-xl w-fit">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}