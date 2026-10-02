import { useState, useEffect, useCallback } from 'react';
import { Lock, Shield, Delete, AlertTriangle } from 'lucide-react';
import { checkNewPin } from '@/lib/validation';
import { isPinSet } from '@/lib/storage';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SiteFooter } from '@/components/SiteFooter';

interface LockScreenProps {
  mode: 'setup' | 'unlock';
  error: string;
  lockedSeconds: number;
  onSetup: (pin: string) => void;
  onUnlock: (pin: string) => void;
}

export function LockScreen({
  mode,
  error,
  lockedSeconds,
  onSetup,
  onUnlock,
}: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [localError, setLocalError] = useState('');
  const [hasPin, setHasPin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      setHasPin(await isPinSet());
    })();
  }, []);

  const displayError = error || localError;
  const isLocked = lockedSeconds > 0;

  const handleDigit = useCallback(
    (digit: string) => {
      if (isLocked) return;
      setLocalError('');
      if (mode === 'setup') {
        if (step === 'create') {
          if (pin.length < 6) setPin((prev) => prev + digit);
        } else {
          if (confirmPin.length < 6) setConfirmPin((prev) => prev + digit);
        }
      } else {
        if (pin.length < 6) setPin((prev) => prev + digit);
      }
    },
    [isLocked, mode, step, pin.length, confirmPin.length]
  );

  const handleBackspace = useCallback(() => {
    if (isLocked) return;
    setLocalError('');
    if (mode === 'setup' && step === 'confirm') {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  }, [isLocked, mode, step]);

  // Handle setup completion
  const handleSubmitSetup = useCallback(() => {
    if (step === 'create') {
      const err = checkNewPin(pin);
      if (err) {
        setLocalError(err);
        setPin('');
        return;
      }
      setStep('confirm');
      setLocalError('');
    } else {
      if (pin !== confirmPin) {
        setLocalError('Os PINs não coincidem. Tente novamente.');
        setConfirmPin('');
        return;
      }
      onSetup(pin);
    }
  }, [step, pin, confirmPin, onSetup]);

  // Suporte para entrada via teclado físico (desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;

      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        if (mode === 'setup' && step === 'create' && pin.length >= 4) {
          handleSubmitSetup();
        } else if (mode === 'unlock' && pin.length >= 4) {
          onUnlock(pin);
          setPin('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, handleDigit, handleBackspace, handleSubmitSetup, mode, step, pin, onUnlock]);

  // Envia automaticamente só quando chega ao tamanho máximo (6 dígitos)
  useEffect(() => {
    if (mode === 'unlock' && pin.length === 6) {
      const timer = setTimeout(() => {
        onUnlock(pin);
        setPin('');
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pin, mode, onUnlock]);

  // Auto-advance no passo de confirmação quando coincidir a quantidade
  useEffect(() => {
    if (mode === 'setup' && step === 'confirm' && confirmPin.length === pin.length && pin.length >= 4) {
      handleSubmitSetup();
    }
  }, [confirmPin, pin, step, mode, handleSubmitSetup]);

  const currentPin = mode === 'setup' && step === 'confirm' ? confirmPin : pin;
  const dotsLength = mode === 'setup' && step === 'create' ? pin.length : currentPin.length;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-teal-950 px-6 py-10 text-slate-900 dark:text-slate-100 transition-colors">
      <div
        className="absolute right-4"
        style={{ top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
      >
        <ThemeToggle />
      </div>

      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-600/10 dark:bg-teal-600/20 border border-teal-600/30">
          <Shield size={40} className="text-teal-600 dark:text-teal-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">EscalaFácil</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {mode === 'setup'
            ? step === 'create'
              ? 'Crie um PIN de acesso (4 a 6 dígitos)'
              : 'Confirme seu PIN'
            : 'Digite seu PIN para acessar'}
        </p>
      </div>

      {/* Indicadores do PIN */}
      <div
        className="mb-6 flex gap-3"
        role="status"
        aria-label={`${dotsLength} de 6 dígitos inseridos`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
              i < dotsLength
                ? 'border-teal-600 bg-teal-600 dark:border-teal-400 dark:bg-teal-400 scale-110'
                : 'border-slate-300 dark:border-slate-600 bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Erro */}
      {displayError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-950/50 px-4 py-2.5 text-red-700 dark:text-red-300">
          <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
          <span className="text-sm font-medium">{displayError}</span>
        </div>
      )}

      {isLocked && (
        <div className="mb-4 text-center">
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
            Aguarde {lockedSeconds}s para tentar novamente.
          </p>
        </div>
      )}

      {/* Teclado numérico */}
      <div className="grid w-full max-w-xs grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => handleDigit(d)}
            disabled={isLocked}
            aria-label={`Dígito ${d}`}
            className="flex h-16 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xl font-semibold text-slate-800 dark:text-slate-100 shadow-sm transition-all hover:border-teal-600 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40"
          >
            {d}
          </button>
        ))}
        <div className="flex h-16 items-center justify-center">
          {mode === 'setup' && step === 'create' && pin.length >= 4 && (
            <button
              type="button"
              onClick={handleSubmitSetup}
              className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
            >
              Próximo
            </button>
          )}
          {mode === 'unlock' && pin.length >= 4 && pin.length < 6 && (
            <button
              type="button"
              onClick={() => {
                onUnlock(pin);
                setPin('');
              }}
              disabled={isLocked}
              className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-40"
            >
              Entrar
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => handleDigit('0')}
          disabled={isLocked}
          aria-label="Dígito 0"
          className="flex h-16 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xl font-semibold text-slate-800 dark:text-slate-100 shadow-sm transition-all hover:border-teal-600 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          disabled={isLocked}
          aria-label="Apagar último dígito"
          className="flex h-16 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 shadow-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 active:scale-95 disabled:opacity-40"
        >
          <Delete size={22} />
        </button>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Lock size={12} />
        <span>Seus dados são criptografados localmente com AES-256</span>
      </div>

      {mode === 'setup' && hasPin === false && (
        <p className="mt-4 max-w-xs text-center text-xs text-slate-500 dark:text-slate-400">
          Este PIN protege o acesso aos seus plantões e dados financeiros. Não há como recuperá-lo se esquecer.
        </p>
      )}

      <SiteFooter className="mt-8 text-center" />
    </div>
  );
}
