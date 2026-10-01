import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppData, Shift, ShiftTemplate, Settings } from '@/types';
import {
  isPinSet,
  setupPin,
  verifyPin,
  loadData,
  saveData,
  getAttempts,
  recordFailedAttempt,
  resetAttempts,
  createShift,
  createTemplate,
} from '@/lib/storage';

export type AppPhase = 'loading' | 'setup' | 'locked' | 'unlocked';

export function useAppData() {
  const [phase, setPhase] = useState<AppPhase>('loading');
  const [data, setData] = useState<AppData | null>(null);
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  const [lockedSeconds, setLockedSeconds] = useState<number>(0);
  const lockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initial check: is PIN set?
  useEffect(() => {
    (async () => {
      const hasPin = await isPinSet();
      setPhase(hasPin ? 'locked' : 'setup');
    })();
  }, []);

  // Lock when returning from background (visibilitychange)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden' && phase === 'unlocked') {
        setPhase('locked');
        setData(null);
        setPin('');
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [phase]);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockedSeconds <= 0) {
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current);
        lockTimerRef.current = null;
      }
      return;
    }
    lockTimerRef.current = setInterval(() => {
      setLockedSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    };
  }, [lockedSeconds]);

  // Persist data whenever it changes. Se a gravação falhar, avisa o usuário.
  const persist = useCallback(
    async (newData: AppData, currentPin: string) => {
      if (!currentPin) return;
      try {
        await saveData(newData, currentPin);
      } catch {
        setSaveError(
          'Não foi possível salvar suas alterações. Exporte um backup para não perder dados.'
        );
      }
    },
    []
  );

  const clearSaveError = useCallback(() => setSaveError(''), []);

  const handleSetupPin = useCallback(async (newPin: string) => {
    await setupPin(newPin);
    setPin(newPin);
    const loaded = await loadData(newPin);
    setData(loaded);
    setPhase('unlocked');
    setError('');
  }, []);

  const handleUnlock = useCallback(
    async (enteredPin: string) => {
      setError('');

      // Check lockout
      const attempts = await getAttempts();
      if (attempts.lockedUntil > Date.now()) {
        const secs = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
        setLockedSeconds(secs);
        setError(`Muitas tentativas. Aguarde ${secs}s.`);
        return;
      }

      const ok = await verifyPin(enteredPin);
      if (ok) {
        await resetAttempts();
        setPin(enteredPin);
        const loaded = await loadData(enteredPin);
        setData(loaded);
        setPhase('unlocked');
        setError('');
      } else {
        const result = await recordFailedAttempt();
        if (result.lockedUntil > Date.now()) {
          const secs = Math.ceil((result.lockedUntil - Date.now()) / 1000);
          setLockedSeconds(secs);
          setError(`PIN incorreto. Bloqueado por ${secs}s.`);
        } else {
          setError(
            `PIN incorreto. Tentativa ${result.count} de 5.`
          );
        }
      }
    },
    []
  );

  const handleLock = useCallback(() => {
    setPhase('locked');
    setData(null);
    setPin('');
    setError('');
  }, []);

  const handlePinChanged = useCallback((newPin: string) => {
    setPin(newPin);
  }, []);

  const handlePinReset = useCallback(() => {
    setData(null);
    setPin('');
    setError('');
    setPhase('setup');
  }, []);

  // ─── Data mutations ──────────────────────────────────────────

  const updateData = useCallback(
    (updater: (prev: AppData) => AppData) => {
      setData((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        persist(next, pin);
        return next;
      });
    },
    [pin, persist]
  );

  const addShift = useCallback(
    (shiftData: Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>) => {
      updateData((prev) => ({
        ...prev,
        shifts: [...prev.shifts, createShift(shiftData)],
      }));
    },
    [updateData]
  );

  // Adiciona vários plantões de uma vez (um único salvamento)
  const addShifts = useCallback(
    (list: Array<Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>>) => {
      if (list.length === 0) return;
      updateData((prev) => ({
        ...prev,
        shifts: [...prev.shifts, ...list.map((item) => createShift(item))],
      }));
    },
    [updateData]
  );

  const updateShift = useCallback(
    (id: string, shiftData: Partial<Shift>) => {
      updateData((prev) => ({
        ...prev,
        shifts: prev.shifts.map((s) =>
          s.id === id ? { ...s, ...shiftData, updatedAt: Date.now() } : s
        ),
      }));
    },
    [updateData]
  );

  const deleteShift = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        shifts: prev.shifts.filter((s) => s.id !== id),
      }));
    },
    [updateData]
  );

  const addTemplate = useCallback(
    (tplData: Omit<ShiftTemplate, 'id'>) => {
      updateData((prev) => ({
        ...prev,
        templates: [...prev.templates, createTemplate(tplData)],
      }));
    },
    [updateData]
  );

  const deleteTemplate = useCallback(
    (id: string) => {
      updateData((prev) => ({
        ...prev,
        templates: prev.templates.filter((t) => t.id !== id),
      }));
    },
    [updateData]
  );

  const updateSettings = useCallback(
    (settings: Partial<Settings>) => {
      updateData((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...settings },
      }));
    },
    [updateData]
  );

  const replaceData = useCallback(
    (newData: AppData) => {
      setData(newData);
      persist(newData, pin);
    },
    [pin, persist]
  );

  return {
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
    updateSettings,
    replaceData,
    setPhase,
    setError,
  };
}
