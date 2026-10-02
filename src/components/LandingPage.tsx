import { 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Sun, 
  Moon, 
  Lock,
  CheckCircle2
} from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';

interface LandingPageProps {
  onEnter: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export function LandingPage({ onEnter, theme, onToggleTheme }: LandingPageProps) {
  const isDark = theme === 'dark';

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 selection:bg-teal-500 selection:text-white overflow-hidden">
      
      {/* Background Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 dark:hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-teal-200/40 blur-3xl" />
        <div className="absolute top-1/3 right-10 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
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
          <span className="hidden sm:inline-block rounded-full border border-teal-600/20 bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
            Médicos & Enfermagem
          </span>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#recursos" className="hover:text-teal-600 dark:hover:text-teal-400 transition">Recursos</a>
            <a href="#como-funciona" className="hover:text-teal-600 dark:hover:text-teal-400 transition">Como Funciona</a>
            <a href="#privacidade" className="hover:text-teal-600 dark:hover:text-teal-400 transition">Privacidade</a>
          </nav>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Alternar tema"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <button
            onClick={onEnter}
            className="text-sm font-bold text-slate-700 dark:text-slate-200 px-3 py-2 transition hover:opacity-80"
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
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-10 pb-16 max-w-5xl mx-auto">
        
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-500/10 px-3.5 py-1.5 text-xs font-bold text-teal-800 dark:text-teal-300 mb-6">
          <Lock size={14} className="text-teal-600 dark:text-teal-400" />
          <span>Gestão inteligente de plantões hospitalares</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-slate-900 dark:text-white">
          Organize sua rotina médica sem complicações e com{' '}
          <span className="text-teal-600 dark:text-teal-400">
            privacidade total
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg font-medium max-w-2xl mx-auto leading-relaxed text-slate-600 dark:text-slate-300">
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
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 backdrop-blur-sm shadow-sm transition">
            <div className="mb-4 inline-flex rounded-xl bg-teal-500/10 p-3 text-teal-600 dark:text-teal-400">
              <Calendar size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Visualização Clara
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
              Calendário mensal com marcadores coloridos por hospital e relatórios de turnos organizados.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 backdrop-blur-sm shadow-sm transition">
            <div className="mb-4 inline-flex rounded-xl bg-teal-500/10 p-3 text-teal-600 dark:text-teal-400">
              <DollarSign size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Cálculo Automático
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
              Acompanhe totais previstos e valores já pagos no mês sem precisar de planilhas complexas.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 backdrop-blur-sm shadow-sm transition">
            <div className="mb-4 inline-flex rounded-xl bg-teal-500/10 p-3 text-teal-600 dark:text-teal-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Segurança por PIN
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
              Bloqueio rápido e criptografia local com padrão AES-256 para total proteção dos seus dados.
            </p>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div id="privacidade" className="mt-12 flex flex-wrap items-center justify-center gap-8 py-4 border-y border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 w-full">
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

        {/* SEÇÃO: COMO FUNCIONA (Passo a passo + Alerta de Privacidade) */}
        <div id="como-funciona" className="mt-20 w-full text-left pt-10 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-center mb-10">
            <span className="text-teal-600 dark:text-teal-400 font-semibold text-xs uppercase tracking-wider">
              Como Funciona
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Do primeiro serviço ao backup, em poucos passos.
            </h2>
          </div>

          {/* Caixas de Aviso de Privacidade */}
          <div className="bg-slate-900 text-slate-100 p-6 sm:p-8 rounded-2xl mb-10 shadow-sm border border-slate-800">
            <h3 className="font-bold text-lg text-emerald-400 mb-2">
              Nenhum dado sai do seu navegador.
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Tudo o que você anota fica salvo apenas neste navegador, neste aparelho, criptografado pelo seu PIN[cite: 14]. Não existe conta, servidor nem nuvem[cite: 14]. Por isso, limpar os dados do site ou trocar de aparelho apaga tudo: faça backup[cite: 14].
            </p>
          </div>

          {/* Passo a Passo de 1 a 6 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-slate-900 text-white dark:bg-slate-800 dark:text-teal-400 font-bold rounded-full flex items-center justify-center mb-4 text-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Crie seu PIN</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Na primeira vez, escolha um PIN de 4 a 6 dígitos[cite: 14]. Ele protege tudo e não pode ser recuperado: anote em um lugar seguro[cite: 14].
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-slate-900 text-white dark:bg-slate-800 dark:text-teal-400 font-bold rounded-full flex items-center justify-center mb-4 text-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Adicione empresa, serviço ou contrato</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Toque em Adicionar, escolha o tipo (plantão, serviço, hora extra ou contrato) e informe a empresa ou o cliente, a data e o horário[cite: 14].
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-slate-900 text-white dark:bg-slate-800 dark:text-teal-400 font-bold rounded-full flex items-center justify-center mb-4 text-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Coloque os valores</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Digite o valor combinado de cada serviço[cite: 14]. O app soma o total do mês e mostra quanto você já recebeu[cite: 14].
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-slate-900 text-white dark:bg-slate-800 dark:text-teal-400 font-bold rounded-full flex items-center justify-center mb-4 text-sm">
                4
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Marque se foi pago</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Abra o serviço e marque como pago, com a data do pagamento[cite: 14]. O que não for marcado continua como a receber[cite: 14].
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-slate-900 text-white dark:bg-slate-800 dark:text-teal-400 font-bold rounded-full flex items-center justify-center mb-4 text-sm">
                5
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Faça seu backup</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Em Configurações, escolha Exportar backup e guarde o arquivo no Drive ou no e-mail[cite: 14]. O app avisa quando passar de 30 dias sem backup[cite: 14].
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 bg-slate-900 text-white dark:bg-slate-800 dark:text-teal-400 font-bold rounded-full flex items-center justify-center mb-4 text-sm">
                6
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Importe quando precisar</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                No aparelho novo, crie o mesmo PIN do backup, abra Configurações, escolha Importar backup e selecione o arquivo .json[cite: 14].
              </p>
            </div>
          </div>
        </div>

        {/* SEÇÃO: BACKUP .JSON OU PLANILHA .CSV */}
        <div className="mt-16 w-full text-left">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Backup .json ou planilha .csv?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-1">
                Para Guardar
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                Backup (.json)
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Restaura seus dados dentro do app[cite: 14].
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-1">
                Para Conferir
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">
                Planilha (.csv)
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Mostra serviços, horas e valores em linhas e colunas[cite: 14].
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <SiteFooter className="flex flex-col items-center justify-center gap-2" />
      </footer>

    </div>
  );
}
