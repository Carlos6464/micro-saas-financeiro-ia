import './global.css';
import { Manrope } from 'next/font/google'; // Importando a fonte
import { Toaster } from '@/components/ui/sonner';

// Configurando a Manrope
const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  title: 'FinSaaS - Gestão Inteligente',
  description: 'Controle suas finanças com inteligência.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark"> {/* Forçando Dark Mode como padrão */}
      <body className={`${manrope.variable} font-sans bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}