'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth-store';
import { Sidebar } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token } = useAuth(); 
  
  // Estado para controlar se podemos mostrar a tela ou não
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verifica se existe token cru no localStorage (criado manualmente no login)
    const storedToken = localStorage.getItem('token'); 
    
    // O token do Zustand vem via hook. Se ele existir ou o token cru existir, autoriza.
    // REMOVIDO: verificação de 'auth-storage', pois essa chave persiste mesmo vazia,
    // retornando uma string que avaliava como 'true'.
    
    if (token || storedToken) {
      setIsAuthorized(true);
    } else {
      // Se não tem token, garante que desautoriza e redireciona
      setIsAuthorized(false);
      router.push('/login');
    }
  }, [token, router]);

  // Se ainda não autorizamos (ou deslogamos), mostra o Loading
  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0f172a]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Se autorizado, renderiza o Layout com Sidebar
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0f172a] text-white font-sans">
       {/* Sidebar Fixa */}
       <Sidebar />
       
       {/* Conteúdo Dinâmico (Dashboard) */}
       <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-900/50">
          {children}
       </main>
    </div>
  );
}