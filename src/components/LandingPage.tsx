import { useState } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Lock, 
  Sparkles, 
  Smartphone, 
  ArrowRight,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Background Orbs & Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/70 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <Stethoscope size={22} />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">EscalaFácil</span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Médicos & Enfermagem
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#recursos" className="hover:text-white transition">Recursos</a>
            <a href="#como-funciona" className="hover:text-white transition">Como Funciona</a>
            <a href="#privacidade" className="hover:text-white transition">Privacidade</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onEnter}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Entrar
            </button>
            <button
              onClick={onEnter}
              className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
            >
              Começar agora <ArrowRight size={16} />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
            <a
              href="#recursos"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-1"
            >
              Recursos
            </a>
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-1"
            >
              Como Funciona
            </a>
            <a
              href="#privacidade"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-white py-1"
            >
              Privacidade
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onEnter}
                className="w-full py-2.5 text-center font-medium text-slate-200 border border-slate-700 rounded-xl"
              >
                Entrar
              </button>
              <button
                onClick={onEnter}
                className="w-full py-2.5 text-center font-semibold text-white bg-purple-600 rounded-xl"
              >
                Começar agora
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-28 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-purple-300 text-xs font-medium mb-6">
          <Sparkles size={14} className="text-purple-400" />
          <span>Gestão inteligente de plantões hospitalares</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Organize sua rotina médica sem complicações e com <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-teal-300">privacidade total</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          O EscalaFácil ajuda profissionais da saúde a controlar plantões, valores a receber e repetições de escala. Sem cadastros expostos, com dados armazenados diretamente no seu dispositivo.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnter}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-base transition shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 group"
          >
            Acessar Meu Painel
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Floating Glass Chips Showcase */}
        <div className="mt-14 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
            <Calendar className="text-teal-400 mb-2" size={22} />
            <p className="text-sm font-semibold text-white">Visualização Clara</p>
            <p className="text-xs text-slate-400 mt-1">Calendário mensal com marcadores coloridos por hospital.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
            <DollarSign className="text-amber-400 mb-2" size={22} />
            <p className="text-sm font-semibold text-white">Cálculo Automático</p>
            <p className="text-xs text-slate-400 mt-1">Acompanhe totais previstos e valores já pagos no mês.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
            <Lock className="text-purple-400 mb-2" size={22} />
            <p className="text-sm font-semibold text-white">Segurança por PIN</p>
            <p className="text-xs text-slate-400 mt-1">Bloqueio rápido e criptografia local para seus dados.</p>
          </div>
        </div>
      </section>

      {/* Dark Explanatory Strip */}
      <section className="bg-slate-950/80 border-y border-slate-800/80 py-10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-around gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
            <span className="text-sm text-slate-300 font-medium">100% Offline e Privado</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
            <span className="text-sm text-slate-300 font-medium">Modelos Customizados</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
            <span className="text-sm text-slate-300 font-medium">Relatórios e Extratos em PDF</span>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Como funciona na prática</h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Projetado para se ajustar ao fluxo intenso da rotina médica.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-6 rounded-2xl bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition relative overflow-hidden group"
            >
              <div className="text-3xl font-extrabold text-purple-500/30 group-hover:text-purple-500/50 transition mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="py-16 bg-gradient-to-b from-transparent to-slate-950 border-t border-slate-800/50 relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Pronto para simplificar seus plantões?</h2>
          <p className="text-slate-400 mt-2 text-sm">Acesse agora sem necessidade de criar conta com senha ou dados pessoais.</p>
          <button
            onClick={onEnter}
            className="mt-6 px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition shadow-lg shadow-purple-600/30 inline-flex items-center gap-2"
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
