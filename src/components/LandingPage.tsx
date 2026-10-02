import { 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Sun, 
  Moon, 
  Lock,
  CheckCircle2,
  KeyRound,
  Building2,
  CalendarDays,
  Repeat,
  FileText,
  DatabaseBackup
} from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';

interface LandingPageProps {
  onEnter: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export function LandingPage({ onEnter, theme, onToggleTheme }: LandingPageProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-teal-500 selection:text-white overflow-hidden">
      
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 dark:hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-teal-100/50 blur-3xl" />
        <div className="absolute top-1/3 right-10 h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 hidden dark:block">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-teal-900/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
            <Stethoscope size={22} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
            EscalaFácil
          </span>
          <span className="hidden sm:inline-block rounded-full border border-teal-600/20 bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:text-teal-400">
            Médicos & Enfermagem
          </span>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-300">
            <a href="#recursos" className="hover:text-teal-600 dark:hover:text-white transition">Recursos</a>
            <a href="#como-funciona" className="hover:text-teal-600 dark:hover:text-white transition">Como Funciona</a>
            <a href="#privacidade" className="hover:text-teal-600 dark:hover:text-white transition">Privacidade</a>
          </nav>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <button
            onClick={onEnter}
            className="text-sm font-bold text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white px-3 py-2 transition"
          >
            Entrar
          </button>

          <button
            onClick={onEnter}
            className="hidden sm:flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white px-4 py-2 text-sm font-bold shadow-md shadow-teal-600/20 transition"
          >
            <span>Começar agora</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-12 pb-16 max-w-5xl mx-auto">
        
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-500/10 px-3.5 py-1.5 text-xs font-bold text-teal-800 dark:text-teal-300 mb-6">
          <Lock size={14} className="text-teal-600 dark:text-teal-400" />
          <span>Gestão inteligente de plantões hospitalares</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
          Organize sua rotina médica sem complicações e com{' '}
          <span className="text-teal-600 dark:text-teal-400">privacidade total</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg font-medium text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          O EscalaFácil ajuda profissionais da saúde a controlar plantões, valores a receber e repetições de escala. Sem cadastros expostos, com dados armazenados diretamente no seu dispositivo.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm">
          <button
            onClick={onEnter}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white px-8 py-4 font-bold text-base shadow-lg shadow-teal-600/25 transition"
          >
            <span>Acessar Meu Painel</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div id="recursos" className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 backdrop-blur-sm shadow-sm transition hover:border-slate-300 dark:hover:border-slate-700">
            <div className="mb-4 inline-flex rounded-xl bg-teal-500/10 p-3 text-teal-600 dark:text-teal-400">
              <Calendar size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Visualização Clara</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Calendário mensal com marcadores coloridos por hospital e relatórios de turnos organizados.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 backdrop-blur-sm shadow-sm transition hover:border-slate-300 dark:hover:border-slate-700">
            <div className="mb-4 inline-flex rounded-xl bg-teal-500/10 p-3 text-teal-600 dark:text-teal-400">
              <DollarSign size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Cálculo Automático</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Acompanhe totais previstos e valores já pagos no mês sem precisar de planilhas complexas.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 backdrop-blur-sm shadow-sm transition hover:border-slate-300 dark:hover:border-slate-700">
            <div className="mb-4 inline-flex rounded-xl bg-teal-500/10 p-3 text-teal-600 dark:text-teal-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Segurança por PIN</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Bloqueio rápido e criptografia local com padrão AES-256 para total proteção dos seus dados.
            </p>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div id="privacidade" className="mt-12 flex flex-wrap items-center justify-center gap-8 py-4 border-y border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300 w-full">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400" />
            <span>100% Offline e Privado</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400" />
            <span>Modelos Customizados</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400" />
            <span>Relatórios e Extratos em PDF</span>
          </div>
        </div>

        {/* "Como funciona na prática" Section */}
        <div id="como-funciona" className="mt-20 w-full text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Como funciona na prática
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
            Projetado para se ajustar ao fluxo intenso da rotina médica.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6">
              <span className="text-2xl font-black text-teal-600 dark:text-teal-500">01</span>
              <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Crie seu PIN de Acesso</h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No primeiro acesso, defina uma senha numérica simples para proteger as informações dos seus plantões.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6">
              <span className="text-2xl font-black text-teal-600 dark:text-teal-500">02</span>
              <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Cadastre seus Locais e Modelos</h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Salve hospitais e horários recorrentes em modelos rápidos para adicionar plantões em poucos toques.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6">
              <span className="text-2xl font-black text-teal-600 dark:text-teal-500">03</span>
              <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Acompanhe no Calendário</h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Visualize seus plantões organizados por dia, status de pagamento (pago/pendente) e totais financeiros.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6">
              <span className="text-2xl font-black text-teal-600 dark:text-teal-500">04</span>
              <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Repita Plantões Facilmente</h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Multiplique plantões em dias específicos da semana com o recurso de repetição inteligente.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6">
              <span className="text-2xl font-black text-teal-600 dark:text-teal-500">05</span>
              <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Gere Extratos em PDF</h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Exporte relatórios detalhados para conferência de pagamentos ao final do mês.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6">
              <span className="text-2xl font-black text-teal-600 dark:text-teal-500">06</span>
              <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Faça Backups Seguros</h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Exporte e importe backups facilmente para garantir que você nunca perca o histórico da sua escala.
              </p>
            </div>
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="mt-20 w-full flex flex-col items-center text-center border-t border-slate-200/60 dark:border-slate-800/60 pt-16">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pronto para simplificar seus plantões?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            Acesse agora sem necessidade de criar conta com senha ou dados pessoais.
          </p>
          <button
            onClick={onEnter}
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white px-8 py-3.5 font-bold text-sm shadow-lg shadow-teal-600/25 transition"
          >
            <span>Acessar o App Agora</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <SiteFooter className="flex flex-col items-center justify-center gap-2" />
      </footer>

    </div>
  );
}
