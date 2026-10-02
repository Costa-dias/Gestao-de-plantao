import { useState } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export function LandingPage({ onEnter, theme, onToggleTheme }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white transition-colors">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 dark:bg-teal-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-600/10 dark:bg-cyan-600/15 rounded-full blur-3xl" />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/20 border border-teal-600/30 text-teal-600 dark:text-teal-400">
              <Stethoscope size={22} />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">EscalaFácil</span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                Médicos & Enfermagem
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#recursos" className="hover:text-teal-600 dark:hover:text-white transition">Recursos</a>
            <a href="#como-funciona" className="hover:text-teal-600 dark:hover:text-white transition">Como Funciona</a>
            <a href="#privacidade" className="hover:text-teal-600 dark:hover:text-white transition">Privacidade</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="rounded-lg p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={onEnter}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white transition"
            >
              Entrar
            </button>
            <button
              onClick={onEnter}
              className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition shadow-lg shadow-teal-600/30 flex items-center gap-1.5"
            >
              Começar agora <ArrowRight size={16} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3">
            <a
              href="#recursos"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white py-1"
            >
              Recursos
            </a>
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white py-1"
            >
              Como Funciona
            </a>
            <a
              href="#privacidade"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-white py-1"
            >
              Privacidade
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onEnter}
                className="w-full py-2.5 text-center font-medium text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                Entrar
              </button>
              <button
                onClick={onEnter}
                className="w-full py-2.5 text-center font-semibold text-white bg-teal-600 rounded-xl"
              >
                Começar agora
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-28 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 text-teal-700 dark:text-teal-300 text-xs font-medium mb-6">
          <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
          <span>Gestão inteligente de plantões hospitalares</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
          Organize sua rotina médica sem complicações e com <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-300">privacidade total</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          O EscalaFácil ajuda profissionais da saúde a controlar plantões, valores a receber e repetições de escala. Sem cadastros expostos, com dados armazenados diretamente no seu dispositivo.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnter}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-base transition shadow-xl shadow-teal-600/30 flex items-center justify-center gap-2 group"
          >
            Acessar Meu Painel
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Cards Showcase */}
        <div className="mt-14 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
            <Calendar className="text-teal-600 dark:text-teal-400 mb-2" size={22} />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Visualização Clara</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Calendário mensal com marcadores coloridos por hospital.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
            <DollarSign className="text-amber-600 dark:text-amber-400 mb-2" size={22} />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Cálculo Automático</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Acompanhe totais previstos e valores já pagos no mês.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
            <Lock className="text-teal-600 dark:text-teal-400 mb-2" size={22} />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Segurança por PIN</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Bloqueio rápido e criptografia local para seus dados.</p>
          </div>
        </div>
      </section>

      {/* Explanatory Strip */}
      <section className="bg-slate-100 dark:bg-slate-900/80 border-y border-slate-200 dark:border-slate-800 py-10 relative z-10 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-around gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 shrink-0" size={20} />
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">100% Offline e Privado</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 shrink-0" size={20} />
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Modelos Customizados</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 shrink-0" size={20} />
            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Relatórios e Extratos em PDF</span>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Como funciona na prática</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">Projetado para se ajustar ao fluxo intenso da rotina médica.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition relative overflow-hidden group shadow-sm"
            >
              <div className="text-3xl font-extrabold text-teal-600/30 dark:text-teal-400/30 group-hover:text-teal-600/50 dark:group-hover:text-teal-400/50 transition mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="py-16 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 relative z-10 text-center transition-colors">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Pronto para simplificar seus plantões?</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">Acesse agora sem necessidade de criar conta com senha ou dados pessoais.</p>
          <button
            onClick={onEnter}
            className="mt-6 px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition shadow-lg shadow-teal-600/30 inline-flex items-center gap-2"
          >
            Acessar o App Agora <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}

const steps = [
  {
    number: "01",
    title: "Crie seu PIN de Acesso",
    description: "No primeiro acesso, defina uma senha numérica simples para proteger as informações dos seus plantões."
  },
  {
    number: "02",
    title: "Cadastre seus Locais e Modelos",
    description: "Salve hospitais e horários recorrentes em modelos rápidos para adicionar plantões em poucos toques."
  },
  {
    number: "03",
    title: "Acompanhe no Calendário",
    description: "Visualize seus plantões organizados por dia, status de pagamento (pago/pendente) e totais financeiros."
  },
  {
    number: "04",
    title: "Repita Plantões Facilmente",
    description: "Multiplique plantões em dias específicos da semana com o recurso de repetição inteligente."
  },
  {
    number: "05",
    title: "Gere Extratos em PDF",
    description: "Exporte relatórios detalhados para conferência de pagamentos ao final do mês."
  },
  {
    number: "06",
    title: "Faça Backups Seguros",
    description: "Exporte e importe backups facilmente para garantir que você nunca perca o histórico da sua escala."
  }
];
