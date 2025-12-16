'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { 
  PiggyBank, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { useAuth } from '@/store/auth-store';
import { cn } from '@/lib/utils';

// --- SCHEMAS DE VALIDAÇÃO (ZOD) ---
const authSchema = z.object({
  name: z.string().optional(), // Apenas para registro
  email: z.string().email('Insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type AuthForm = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const loginFn = useAuth((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
  });

  // Função para trocar de aba e limpar erros
  const toggleMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    reset();
  };

  async function onSubmit(data: AuthForm) {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        // --- LOGIN ---
        const response = await api.post('/auth/login', {
          email: data.email,
          password: data.password,
        });
        
        // CORREÇÃO 1: Acessar response.data.data e usar o nome correto (accessToken)
        // O Axios coloca o corpo em .data. O seu backend coloca o payload em .data.
        const { accessToken, refreshToken } = response.data.data;
        
        // Salva token (usando accessToken)
        loginFn(accessToken, { sub: 0, email: data.email }); 
        
        // Opcional: Salvar refreshToken no localStorage se precisar
        localStorage.setItem('refreshToken', refreshToken);

        toast.success(`Bem-vindo de volta!`);
        router.push('/dashboard');

      } else {
        // --- REGISTRO ---
        // CORREÇÃO 2: Rota correta conforme configuramos no Gateway/Auth Service
        await api.post('/auth/register', { 
           name: data.name || 'Usuário',
           email: data.email,
           password: data.password,
           telefone: '00000000000' // Adicione se for obrigatório no backend, ou remova se opcional
        });

        toast.success('Conta criada! Faça login para continuar.');
        setMode('login'); 
        reset();
      }
    } catch (error: any) {
      console.error(error);
      // Tenta pegar a mensagem de erro formatada pelo seu ExceptionFilter
      const msg = error.response?.data?.message || 'Ocorreu um erro. Tente novamente.';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* --- LADO ESQUERDO: VISUAL --- */}
      <div className="relative hidden lg:flex w-full lg:w-1/2 bg-card flex-col justify-between p-12 overflow-hidden border-r border-slate-800">
        {/* Background Image & Effects */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay" 
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1639322537228-ad7117a3943b?q=80&w=2532&auto=format&fit=crop")' }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black shadow-[0_0_15px_rgba(70,236,19,0.3)]">
              <PiggyBank className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">FinSaaS</span>
          </div>
        </div>

        {/* Texto Hero */}
        <div className="relative z-10 max-w-lg mb-20">
          <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight text-white">
            Domine suas finanças com <span className="text-primary">inteligência</span>.
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            Acompanhe seus investimentos, gerencie gastos e planeje seu futuro em uma única plataforma intuitiva e poderosa.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-medium uppercase tracking-wider">
          © 2025 FinSaaS Inc.
        </div>
      </div>

      {/* --- LADO DIREITO: FORMULÁRIO --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-background relative">
        
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black">
            <PiggyBank className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">FinSaaS</span>
        </div>

        <div className="w-full max-w-md flex flex-col gap-8">
          
          {/* Header Texto */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h2>
            <p className="text-muted-foreground">
              {mode === 'login' 
                ? 'Insira seus dados para acessar sua conta.' 
                : 'Comece a controlar suas finanças hoje mesmo.'}
            </p>
          </div>

          {/* Abas (Tabs) */}
          <div className="flex p-1 bg-secondary rounded-full w-full">
            <button
              onClick={() => toggleMode('login')}
              className={cn(
                "flex-1 py-2.5 px-6 rounded-full text-sm font-semibold transition-all",
                mode === 'login' 
                  ? "bg-background text-primary shadow-sm ring-1 ring-black/5 dark:ring-primary/20" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Login
            </button>
            <button
              onClick={() => toggleMode('register')}
              className={cn(
                "flex-1 py-2.5 px-6 rounded-full text-sm font-semibold transition-all",
                mode === 'register' 
                  ? "bg-background text-primary shadow-sm ring-1 ring-black/5 dark:ring-primary/20" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Cadastro
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            
            {/* Campo Nome (Apenas Registro) */}
            {mode === 'register' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-foreground" htmlFor="name">Nome Completo</label>
                <input
                  {...register('name')}
                  className="w-full px-5 py-3.5 bg-card border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Seu nome"
                  type="text"
                />
              </div>
            )}

            {/* Campo E-mail */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">E-mail</label>
              <div className="relative">
                <input
                  {...register('email')}
                  className={cn(
                    "w-full px-5 py-3.5 bg-card border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
                    errors.email ? "border-red-500 focus:ring-red-500/20" : "border-input"
                  )}
                  placeholder="exemplo@email.com"
                  type="email"
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-4 flex items-center text-red-500 pointer-events-none">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground" htmlFor="password">Senha</label>
                {mode === 'login' && (
                  <a className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">
                    Esqueci a senha?
                  </a>
                )}
              </div>
              <div className="relative group">
                <input
                  {...register('password')}
                  className={cn(
                    "w-full px-5 py-3.5 bg-card border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all",
                    errors.password ? "border-red-500 focus:ring-red-500/20" : "border-input"
                  )}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Botão Submit */}
            <button
              disabled={isLoading}
              type="submit"
              className="mt-2 w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 px-6 rounded-full transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(70,236,19,0.2)] hover:shadow-[0_0_25px_rgba(70,236,19,0.4)] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Entrar' : 'Criar Conta'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === 'login' ? "Não tem uma conta? " : "Já tem uma conta? "}
            <button 
              onClick={() => toggleMode(mode === 'login' ? 'register' : 'login')}
              className="font-bold text-foreground hover:text-primary transition-colors"
            >
              {mode === 'login' ? "Registre-se agora" : "Faça login"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}