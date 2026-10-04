import { ArrowRight, Sun, Moon } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';

interface LandingPageProps {
  onEnter: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const TOPICS = [
  { label: 'Marcação de plantão', offset: 'ml-0' },
  { label: 'Serviços', offset: 'ml-8' },
  { label: 'Horas extras', offset: 'ml-16' },
  { label: 'Contratos', offset: 'ml-24' },
];

const STEPS = [
  {
    title: 'Crie seu PIN',
    text: 'Na primeira vez, escolha um PIN de 4 a 6 dígitos. Ele protege tudo e não pode ser recuperado: anote em um lugar seguro.',
  },
  {
     {
    title: 'Adicione empresa, serviço ou contrato',
    text: 'Toque em Adicionar, escolha o tipo (plantão, serviço, hora extra ou contrato) e informe a empresa ou o cliente, a data, o horário e o valor.',
  },
  },
  {
    title: 'Coloque os valores',
    text: 'Digite o valor combinado de cada serviço. O app soma o total do mês e mostra quantos já foram pagos.',
  },
  {
    title: 'Marque se foi pago',
    text: 'Abra o serviço e marque como pago, com a data do pagamento. O que não for marcado continua como a receber.',
  },
  {
    title: 'Faça seu backup',
    text: 'Em Configurações, escolha Exportar backup e guarde o arquivo no Drive ou no e-mail. O app avisa quando passar de 30 dias sem backup.',
  },
  {
    title: 'Importe quando precisar',
    text: 'No aparelho novo, crie o mesmo PIN do backup, abra Configurações, escolha Importar backup e selecione o arquivo .json.',
  },
];

const FORMATS = [
  {
    tag: 'Para guardar',
    title: 'Backup (.json)',
    points: [
      'Restaura seus dados dentro do app.',
      'Criptografado: só abre com o seu PIN.',
      'Não é legível no Excel nem no bloco de notas.',
    ],
  },
  {
    tag: 'Para conferir',
    title: 'Planilha (.csv)',
    points: [
      'Mostra serviços, horas e valores em linhas e colunas.',
      'Abre no Excel, no Google Planilhas e no celular.',
      'Sem criptografia e sem importação: guarde com cuidado.',
    ],
  },
];

export function LandingPage({ onEnter, theme, onToggleTheme }: LandingPageProps) {
  const isDark = theme === 'dark';

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-200 selection:bg-teal-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
      {/* Fundo: manchas desfocadas */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[760px] overflow-hidden">
        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-teal-200/50 blur-3xl dark:bg-teal-900/30" />
        <div className="absolute -right-24 top-16 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-900/25" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-teal-300/40 blur-3xl dark:bg-teal-800/20" />
      </div>

      {/* Cabeçalho */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-extrabold tracking-tight">
          EscalaFácil<span className="text-teal-600 dark:text-teal-400">.</span>
        </span>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <a href="#como-funciona" className="transition hover:text-teal-600 dark:hover:text-teal-400">
              Como funciona
            </a>
            <a href="#privacidade" className="transition hover:text-teal-600 dark:hover:text-teal-400">
              Privacidade
            </a>
          </nav>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="rounded-xl border border-slate-300 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <button
            onClick={onEnter}
            className="rounded-md border border-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white dark:border-slate-200 dark:text-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900"
          >
            Entrar
          </button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-10 text-center sm:pt-16">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            Sua plataforma digital para marcações de serviços em geral.
          </h1>
          <p className="mt-5 text-lg font-medium text-slate-600 dark:text-slate-300 sm:text-xl">
            Não se perca mais no seu calendário.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onEnter}
              className="inline-flex min-h-[52px] items-center gap-2 rounded-md bg-teal-600 px-9 text-base font-semibold text-white shadow-[5px_5px_0_0_#10b981] transition hover:bg-teal-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:shadow-[5px_5px_0_0_#0f766e]"
            >
              Começar agora
              <ArrowRight size={18} />
            </button>
            <a
              href="#como-funciona"
              className="inline-flex min-h-[52px] items-center rounded-md border-[1.5px] border-slate-900 bg-white/60 px-8 text-base font-semibold text-slate-900 backdrop-blur transition hover:bg-white dark:border-slate-200 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              Como funciona
            </a>
          </div>

          {/* Tópicos em escada + esferas */}
          <div className="relative mt-12 w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute -left-24 top-10 hidden h-36 w-36 rounded-full bg-gradient-to-br from-teal-300 to-teal-500 dark:from-teal-500 dark:to-teal-700 sm:block"
            />
            <div
              aria-hidden="true"
              className="absolute -right-28 top-24 hidden h-32 w-32 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 dark:from-emerald-500 dark:to-emerald-700 sm:block"
            />
            <ul className="relative flex flex-col items-start gap-3 text-left">
              {TOPICS.map((topic) => (
                <li
                  key={topic.label}
                  className={`${topic.offset} rounded-2xl border border-white/80 bg-white/70 px-5 py-3 text-base font-semibold shadow-lg shadow-teal-900/10 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/60`}
                >
                  {topic.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="mx-auto max-w-5xl scroll-mt-6 px-6 pb-20">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Como funciona
            </span>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              Do primeiro serviço ao backup, em poucos passos.
            </h2>
          </div>

          <div
            id="privacidade"
            className="mb-10 scroll-mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-sm sm:p-8"
          >
            <h3 className="mb-2 text-lg font-bold text-emerald-400">
              Nenhum dado sai do seu navegador.
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              Tudo o que você anota fica salvo apenas neste navegador, neste aparelho,
              criptografado pelo seu PIN. Não existe conta, servidor nem nuvem. Por isso,
              limpar os dados do site ou trocar de aparelho apaga tudo: faça backup.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-slate-800 dark:text-teal-400">
                  {index + 1}
                </div>
                <h4 className="mb-1 font-bold">{step.title}</h4>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <h3 className="mb-6 mt-16 text-xl font-bold">Backup .json ou planilha .csv?</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {FORMATS.map((format) => (
              <div
                key={format.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
              >
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {format.tag}
                </span>
                <h4 className="mb-3 text-lg font-bold">{format.title}</h4>
                <ul className="space-y-2">
                  {format.points.map((point) => (
                    <li key={point} className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="relative z-10 w-full border-t border-slate-200 bg-white/50 py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
        <SiteFooter className="flex flex-col items-center justify-center gap-2" />
      </footer>
    </div>
  );
}
