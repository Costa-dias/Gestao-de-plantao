import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Plus,
  Settings as SettingsIcon,
  Layers,
  Lock,
  CalendarDays,
  Stethoscope,
  FileText,
  Sun,
  Moon,
  Repeat,
  Download,
} from 'lucide-react';
import { useAppData } from '@/hooks/useAppData';
import { useToast } from '@/hooks/useToast';
import { useTheme } from '@/lib/theme';
import {
  isBackupDue,
  getDaysSinceBackup,
  snoozeBackupReminder,
} from '@/lib/backupReminder';
import { LockScreen } from '@/components/LockScreen';
import { LandingPage } from '@/components/LandingPage';
import { MonthView } from '@/components/MonthView';
import { ShiftModal } from '@/components/ShiftModal';
import { TemplateModal } from '@/components/TemplateModal';
import { SettingsModal } from '@/components/SettingsModal';
import { RepeatModal } from '@/components/RepeatModal';
import { ReportView } from '@/components/ReportView';
import { Button } from '@/components/Button';
import { ToastContainer } from '@/components/ToastContainer';
import { SiteFooter } from '@/components/SiteFooter';
import { formatCurrency, toISODate, fromISODate, formatDateBR } from '@/lib/dateUtils';
import type { Shift, AppData } from '@/types';

function App() {
  const {
    phase,
    data,
    pin,
    error,
    saveError,
    clearSaveError,
    lockedSeconds,
    handleSetupPin,
    handleUnlock,
    handleLock,
    handlePinChanged,
    handlePinReset,
    addShift,
    addShifts,
    updateShift,
    deleteShift,
    addTemplate,
    deleteTemplate,
    replaceData,
  } = useAppData();

  const { toasts, showToast, dismissToast } = useToast();
  const { theme, toggle: toggleTheme } = useTheme();

  const [showLanding, setShowLanding] = useState(true);
  const [now, setNow] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [repeatShift, setRepeatShift] = useState<Shift | null>(null);
  const [backupDue, setBackupDue] = useState(false);

  const year = now.getFullYear();
  const month = now.getMonth();
  const shiftCount = data?.shifts.length ?? 0;

  // Default selected date = today
  useEffect(() => {
    if (phase === 'unlocked' && !selectedDate) {
      setSelectedDate(toISODate(new Date()));
    }
  }, [phase, selectedDate]);

  // Avisa quando uma gravação falha
  useEffect(() => {
    if (saveError) {
      showToast(saveError, 'error');
      clearSaveError();
    }
  }, [saveError, showToast, clearSaveError]);

  // Confere se está na hora de lembrar do backup
  useEffect(() => {
    if (phase === 'unlocked') {
      setBackupDue(isBackupDue(shiftCount > 0));
    }
  }, [phase, settingsOpen, shiftCount]);

  const visibleShifts = useMemo(() => {
    if (!data) return [];
    return data.shifts.filter((s) => {
      const d = fromISODate(s.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [data, year, month]);

  // Summary stats
  const stats = useMemo(() => {
    const total = visibleShifts.length;
    const paid = visibleShifts.filter((s) => s.paid).length;
    const totalValue = visibleShifts.reduce((sum, s) => sum + s.value, 0);
    const paidValue = visibleShifts
      .filter((s) => s.paid)
      .reduce((sum, s) => sum + s.value, 0);
    return { total, paid, totalValue, paidValue };
  }, [visibleShifts]);

  const handlePrevMonth = useCallback(() => {
    setNow(new Date(year, month - 1, 1));
  }, [year, month]);

  const handleNextMonth = useCallback(() => {
    setNow(new Date(year, month + 1, 1));
  }, [year, month]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setNow(today);
    setSelectedDate(toISODate(today));
  }, []);

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleSelectShift = useCallback((shift: Shift) => {
    setEditingShift(shift);
    setShiftModalOpen(true);
  }, []);

  const handleAddShift = useCallback(() => {
    setEditingShift(null);
    if (selectedDate) {
      const d = fromISODate(selectedDate);
      if (d.getMonth() !== month || d.getFullYear() !== year) {
        setNow(new Date(d.getFullYear(), d.getMonth(), 1));
      }
    }
    setShiftModalOpen(true);
  }, [selectedDate, month, year]);

  const handleSaveShift = useCallback(
    (shiftData: Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>) => {
      addShift(shiftData);
      showToast('Plantão adicionado.', 'success');
    },
    [addShift, showToast]
  );

  const handleUpdateShift = useCallback(
    (id: string, shiftData: Partial<Shift>) => {
      updateShift(id, shiftData);
      showToast('Plantão atualizado.', 'success');
    },
    [updateShift, showToast]
  );

  const handleDeleteShift = useCallback(
    (id: string) => {
      deleteShift(id);
      showToast('Plantão excluído.', 'info');
    },
    [deleteShift, showToast]
  );

  const handleConfirmRepeat = useCallback(
    (list: Array<Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>>) => {
      addShifts(list);
      showToast(`${list.length} plantões criados.`, 'success');
    },
    [addShifts, showToast]
  );

  const handleSaveTemplate = useCallback(
    (tplData: Parameters<typeof addTemplate>[0]) => {
      addTemplate(tplData);
      showToast('Modelo salvo.', 'success');
    },
    [addTemplate, showToast]
  );

  const handleImported = useCallback(
    (imported: AppData) => {
      replaceData(imported);
      showToast('Dados restaurados do backup.', 'success');
    },
    [replaceData, showToast]
  );

  const handleSettingsPinReset = useCallback(() => {
    handlePinReset();
    setSettingsOpen(false);
  }, [handlePinReset]);

  const handleSnoozeBackup = useCallback(() => {
    snoozeBackupReminder();
    setBackupDue(false);
  }, []);

  const handleAppLock = useCallback(() => {
    handleLock();
    setShowLanding(true);
  }, [handleLock]);

  // Render phases
  if (phase === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600/20 border border-teal-600/30 animate-pulse">
            <Stethoscope size={32} className="text-teal-600 dark:text-teal-400" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se estiver na Landing Page
  if (showLanding) {
    return (
      <LandingPage
        onEnter={() => setShowLanding(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (phase === 'setup' || phase === 'locked') {
    return (
      <>
        <LockScreen
          mode={phase === 'setup' ? 'setup' : 'unlock'}
          error={error}
          lockedSeconds={lockedSeconds}
          onSetup={handleSetupPin}
          onUnlock={handleUnlock}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  if (!data) return null;

  const daysSinceBackup = getDaysSinceBackup();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg transition-colors">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600/20 border border-teal-600/30">
              <Stethoscope size={20} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">EscalaFácil</h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Gestão de Plantões</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setReportOpen(true)}
              className="rounded-lg p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              title="Extrato / Relatório"
              aria-label="Abrir extrato e relatório"
            >
              <FileText size={20} />
            </button>
            <button
              onClick={() => setTemplateModalOpen(true)}
              className="rounded-lg p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              title="Modelos"
              aria-label="Gerenciar modelos de plantão"
            >
              <Layers size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-lg p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              title="Configurações"
              aria-label="Abrir configurações"
            >
              <SettingsIcon size={20} />
            </button>
            <button
              onClick={handleAppLock}
              className="rounded-lg p-2 text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              title="Bloquear"
              aria-label="Bloquear aplicativo"
            >
              <Lock size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-4 py-4">
        {/* Lembrete de backup */}
        {backupDue && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/30 dark:border-amber-600/30 bg-amber-50 dark:bg-amber-950/30 p-3 transition-colors">
            <Download size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-300">
                Faça um backup dos seus plantões
              </p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                {daysSinceBackup === null
                  ? 'Você ainda não fez nenhum backup.'
                  : `Seu último backup foi há ${daysSinceBackup} dias.`}{' '}
                Seus dados ficam só neste aparelho.
              </p>
              <div className="mt-2 flex gap-2">
                <Button variant="primary" onClick={() => setSettingsOpen(true)}>
                  Fazer backup
                </Button>
                <Button variant="ghost" onClick={handleSnoozeBackup}>
                  Depois
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stats bar */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard
            label="Plantões"
            value={String(stats.total)}
            icon={<CalendarDays size={16} className="text-teal-600 dark:text-teal-400" />}
          />
          <StatCard
            label="Receita"
            value={formatCurrency(stats.totalValue)}
            icon={<CalendarDays size={16} className="text-amber-600 dark:text-amber-400" />}
          />
          <StatCard
            label="Pago"
            value={`${stats.paid}/${stats.total}`}
            icon={<CalendarDays size={16} className="text-emerald-600 dark:text-emerald-400" />}
          />
        </div>

        {/* Calendar */}
        <MonthView
          year={year}
          month={month}
          shifts={visibleShifts}
          selectedDate={selectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onSelectDate={handleSelectDate}
          onSelectShift={handleSelectShift}
        />

        {/* Selected date shifts list */}
        {selectedDate && (
          <div className="mt-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <CalendarDays size={15} className="text-teal-600 dark:text-teal-400" />
              {formatDateBR(selectedDate)}
            </h3>
            <div className="space-y-2">
              {data.shifts
                .filter((s) => s.date === selectedDate)
                .map((shift) => {
                  return (
                    <div key={shift.id} className="flex items-stretch gap-2">
                      <button
                        onClick={() => handleSelectShift(shift)}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3 text-left transition hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <div
                          className="h-10 w-1.5 rounded-full"
                          style={{ backgroundColor: shift.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                            {shift.location}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {shift.startTime} às {shift.endTime}
                            {shift.value > 0 &&
                              ` · ${formatCurrency(shift.value)}`}
                          </p>
                        </div>
                        {shift.paid && (
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-600/20 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            Pago
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setRepeatShift(shift)}
                        className="flex w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 transition hover:border-teal-600 hover:text-teal-600 dark:hover:text-teal-400"
                        title="Repetir plantão"
                        aria-label="Repetir plantão"
                      >
                        <Repeat size={18} />
                      </button>
                    </div>
                  );
                })}
              {data.shifts.filter((s) => s.date === selectedDate).length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  Nenhum plantão neste dia. Toque em "Adicionar" abaixo.
                </p>
              )}
            </div>
          </div>
        )}

        <SiteFooter className="mt-8 text-center" />
      </main>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg transition-colors">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex-1">
            {selectedDate && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatDateBR(selectedDate)}
              </p>
            )}
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddShift}
            className="shadow-lg shadow-teal-600/30"
          >
            <Plus size={20} /> Adicionar Plantão
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ShiftModal
        open={shiftModalOpen}
        onClose={() => setShiftModalOpen(false)}
        shift={editingShift}
        defaultDate={selectedDate ?? toISODate(new Date())}
        templates={data.templates}
        onSave={handleSaveShift}
        onUpdate={handleUpdateShift}
        onDelete={handleDeleteShift}
        onSaveTemplate={handleSaveTemplate}
      />

      <RepeatModal
        open={repeatShift !== null}
        onClose={() => setRepeatShift(null)}
        shift={repeatShift}
        existing={data.shifts}
        onConfirm={handleConfirmRepeat}
      />

      <TemplateModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        templates={data.templates}
        onDelete={deleteTemplate}
        onAddNew={() => {
          setTemplateModalOpen(false);
          handleAddShift();
        }}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        data={data}
        pin={pin}
        onImported={handleImported}
        onPinChanged={handlePinChanged}
        onPinReset={handleSettingsPinReset}
        showToast={showToast}
      />

      <ReportView
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        shifts={data.shifts}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-3 transition-colors">
      <div className="mb-1 flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <p className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

export default App;
