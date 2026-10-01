import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Lock,
  Download,
  Upload,
  Shield,
  Info,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';
import type { AppData } from '@/types';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SiteFooter } from '@/components/SiteFooter';
import { checkNewPin, sanitizeString } from '@/lib/validation';
import { changePin, clearAllData } from '@/lib/storage';
import { exportBackup, importBackup, downloadBackup } from '@/lib/backup';
import { useTheme } from '@/lib/theme';

const MAX_BACKUP_BYTES = 5 * 1024 * 1024; // 5 MB

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  data: AppData;
  pin: string;
  onImported: (data: AppData) => void;
  onPinChanged: (newPin: string) => void;
  onPinReset: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function SettingsModal({
  open,
  onClose,
  data,
  pin,
  onImported,
  onPinChanged,
  onPinReset,
  showToast,
}: SettingsModalProps) {
  const [section, setSection] = useState<'main' | 'changePin' | 'resetPin'>('main');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [resetConfirmPin, setResetConfirmPin] = useState('');
  const [resetError, setResetError] = useState('');
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();

  // Ao fechar, limpa PINs digitados e volta para a tela principal
  useEffect(() => {
    if (!open) {
      setSection('main');
      setOldPin('');
      setNewPin('');
      setConfirmNewPin('');
      setPinError('');
      setResetConfirmPin('');
      setResetError('');
    }
  }, [open]);

  const handleChangePin = useCallback(async () => {
    if (busy) return;
    setPinError('');
    if (!oldPin) {
      setPinError('Digite seu PIN atual.');
      return;
    }
    const pinErr = checkNewPin(newPin);
    if (pinErr) {
      setPinError(pinErr);
      return;
    }
    if (newPin === oldPin) {
      setPinError('O novo PIN deve ser diferente do atual.');
      return;
    }
    if (newPin !== confirmNewPin) {
      setPinError('Os PINs não coincidem.');
      return;
    }
    setBusy(true);
    try {
      const ok = await changePin(oldPin, newPin);
      if (ok) {
        onPinChanged(newPin);
        showToast('PIN alterado com sucesso.', 'success');
        setSection('main');
        setOldPin('');
        setNewPin('');
        setConfirmNewPin('');
      } else {
        setPinError('PIN atual incorreto.');
      }
    } catch {
      setPinError('Não foi possível alterar o PIN. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }, [busy, oldPin, newPin, confirmNewPin, showToast, onPinChanged]);

  const handleResetPin = useCallback(async () => {
    if (busy || resetConfirmPin !== 'APAGAR') return;
    setResetError('');
    setBusy(true);
    try {
      await clearAllData();
      showToast('PIN e dados redefinidos.', 'info');
      onPinReset();
      onClose();
    } catch {
      setResetError('Não foi possível apagar os dados. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }, [busy, resetConfirmPin, showToast, onPinReset, onClose]);

  const handleExport = useCallback(async () => {
    try {
      const blob = await exportBackup(data, pin);
      const date = new Date().toISOString().slice(0, 10);
      downloadBackup(blob, `escalafacil-backup-${date}.json`);
      showToast('Backup exportado com sucesso.', 'success');
    } catch {
      showToast('Erro ao exportar backup.', 'error');
    }
  }, [data, pin, showToast]);

  const handleImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const clearInput = () => {
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      if (file.size === 0 || file.size > MAX_BACKUP_BYTES) {
        showToast('Arquivo inválido ou maior que 5 MB.', 'error');
        clearInput();
        return;
      }
      try {
        const imported = await importBackup(file, pin);
        onImported(imported);
        showToast('Backup importado com sucesso.', 'success');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao importar.';
        showToast(msg, 'error');
      }
      clearInput();
    },
    [pin, onImported, showToast]
  );

  const totalShifts = data.shifts.length;
  const paidShifts = data.shifts.filter((s) => s.paid).length;

  // Compara "AAAA-MM" direto no texto da data (evita erro de fuso horário)
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthRevenue = data.shifts
    .filter((s) => s.date.startsWith(currentMonth))
    .reduce((sum, s) => sum + s.value, 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Configurações"
      maxWidth="max-w-lg"
      footer={
        section !== 'main' ? (
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setSection('main');
                setPinError('');
                setResetError('');
                setResetConfirmPin('');
              }}
            >
              Voltar
            </Button>
            {section === 'changePin' && (
              <Button variant="primary" onClick={handleChangePin} disabled={busy}>
                {busy ? 'Alterando...' : 'Confirmar alteração'}
              </Button>
            )}
            {section === 'resetPin' && (
              <Button
                variant="danger"
                onClick={handleResetPin}
                disabled={busy || resetConfirmPin !== 'APAGAR'}
              >
                Redefinir tudo
              </Button>
            )}
          </>
        ) : (
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
        )
      }
    >
      {section === 'main' && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-center">
              <p className="text-2xl font-bold text-teal-400">{totalShifts}</p>
              <p className="text-xs text-slate-400">Plantões</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{paidShifts}</p>
              <p className="text-xs text-slate-400">Pagos</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3 text-center">
              <p className="text-lg font-bold text-amber-400">
                {new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(monthRevenue)}
              </p>
              <p className="text-xs text-slate-400">Mês atual</p>
            </div>
          </div>

          {/* Aparência */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Sun size={15} className="text-teal-400" />
              Aparência
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                aria-pressed={theme === 'light'}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
                  theme === 'light'
                    ? 'border-teal-500 bg-teal-600/20 text-teal-400'
                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Sun size={16} /> Claro
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                aria-pressed={theme === 'dark'}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
                  theme === 'dark'
                    ? 'border-teal-500 bg-teal-600/20 text-teal-400'
                    : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Moon size={16} /> Escuro
              </button>
            </div>
          </div>

          {/* PIN */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Lock size={15} className="text-teal-400" />
              Segurança
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setSection('changePin')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-left transition hover:border-slate-600 hover:bg-slate-800"
              >
                <span className="text-sm text-slate-200">Alterar PIN</span>
                <span className="text-slate-500">→</span>
              </button>
              <button
                onClick={() => setSection('resetPin')}
                className="flex w-full items-center justify-between rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-left transition hover:border-red-800 hover:bg-red-950/40"
              >
                <span className="flex items-center gap-2 text-sm text-red-300">
                  <AlertTriangle size={14} />
                  Redefinir PIN e apagar dados
                </span>
                <span className="text-red-500">→</span>
              </button>
            </div>
          </div>

          {/* Backup */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Shield size={15} className="text-teal-400" />
              Backup & Transferência
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={handleExport}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-left transition hover:border-slate-600 hover:bg-slate-800"
              >
                <Download size={18} className="text-teal-400" />
                <div>
                  <p className="text-sm text-slate-200">Exportar backup</p>
                  <p className="text-xs text-slate-500">Arquivo .json criptografado</p>
                </div>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-left transition hover:border-slate-600 hover:bg-slate-800"
              >
                <Upload size={18} className="text-teal-400" />
                <div>
                  <p className="text-sm text-slate-200">Importar backup</p>
                  <p className="text-xs text-slate-500">Restaurar de arquivo .json (até 5 MB)</p>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>

          {/* About */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 shrink-0 text-slate-500" />
              <div className="text-xs text-slate-500">
                <p className="font-medium text-slate-400">EscalaFácil</p>
                <p className="mt-1">
                  Seus dados são armazenados localmente e criptografados com AES-256
                  usando seu PIN como chave. Nenhum dado é enviado para servidores
                  externos.
                </p>
                <SiteFooter className="mt-2" />
              </div>
            </div>
          </div>
        </div>
      )}

      {section === 'changePin' && (
        <div className="space-y-4">
          <Input
            label="PIN atual"
            type="password"
            inputMode="numeric"
            placeholder="••••"
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          <Input
            label="Novo PIN (4 a 6 dígitos)"
            type="password"
            inputMode="numeric"
            placeholder="••••"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          <Input
            label="Confirmar novo PIN"
            type="password"
            inputMode="numeric"
            placeholder="••••"
            value={confirmNewPin}
            onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          {pinError && (
            <p className="text-sm text-red-400">{pinError}</p>
          )}
        </div>
      )}

      {section === 'resetPin' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-red-900/50 bg-red-950/30 p-4">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-400" />
            <div className="text-sm text-red-300">
              <p className="font-semibold">Atenção — ação irreversível</p>
              <p className="mt-1">
                Redefinir o PIN apagará permanentemente todos os seus plantões,
                modelos e configurações. Certifique-se de exportar um backup antes
                de continuar.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Confirme digitando <strong className="text-slate-300">APAGAR</strong> abaixo:
          </p>
          <Input
            placeholder="APAGAR"
            value={resetConfirmPin}
            onChange={(e) => setResetConfirmPin(sanitizeString(e.target.value, 10))}
          />
          <Button
            variant="danger"
            onClick={handleResetPin}
            disabled={busy || resetConfirmPin !== 'APAGAR'}
            className="w-full"
          >
            <AlertTriangle size={16} /> Redefinir PIN e apagar todos os dados
          </Button>
          {resetError && <p className="text-sm text-red-400">{resetError}</p>}
        </div>
      )}
    </Modal>
  );
}
