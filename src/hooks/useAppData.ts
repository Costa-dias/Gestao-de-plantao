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
  createEmptyData,
} from '@/lib/storage';

export type AppPhase = 'loading' | 'setup' | 'locked' | 'unlocked';

export function useAppData() {
  const [phase, setPhase] = useState<AppPhase>('loading');
  const [data, setData] = useState<AppData | null>(null);
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [saveError, setSaveError] = useState<string>('');
  const [dataUnreadable, setDataUnreadable] = useState(false);
  const [lockedSeconds, setLockedSeconds] = useState<number>(0);
  const lockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Quando true, NADA é gravado (protege dados que não puderam ser lidos)
  const blockSavesRef = useRef(false);

  const markUnreadable = useCallback((value: boolean) => {
    blockSavesRef.current = value;
    setDataUnreadable(value);
  }, []);

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

  // Persist data whenever it changes. Se a gravação falhar (ou estiver bloqueada), avisa.
  const persist = useCallback(
    async (newData: AppData, currentPin: string) => {
      if (!currentPin) return;
      if (blockSavesRef.current) {
        setSaveError(
          'Seus dados salvos não puderam ser lidos, então esta alteração não foi gravada. Importe um backup em Configurações.'
        );
        return;
      }
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

  const handleSetupPin = useCallback(
    async (newPin: string) => {
      try {
        // Lê primeiro: se já existem dados que não abrem com este PIN, não cria nada
        const loaded = await loadData(newPin);
        await setupPin(newPin);
        markUnreadable(false);
        setPin(newPin);
        setData(loaded);
        setPhase('unlocked');
        setError('');
      } catch {
        setError(
          'Já existem dados salvos neste aparelho que não abrem com este PIN. Use o PIN anterior ou limpe os dados do site para recomeçar.'
        );
      }
    },
    [markUnreadable]
  );

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
        try {
          const loaded = await loadData(enteredPin);
          markUnreadable(false);
          setData(loaded);
        } catch {
          // Dados existem mas não abriram: entra em modo de proteção (sem gravar)
          markUnreadable(true);
          setData(createEmptyData());
        }
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
    [markUnreadable]
  );

  const handleLock = useCallback(() => {
    markUnreadable(false);
    setPhase('locked');
    setData(null);
    setPin('');
    setError('');
  }, [markUnreadable]);

  const handlePinChanged = useCallback((newPin: string) => {
    setPin(newPin);
  }, []);

  const handlePinReset = useCallback(() => {
    markUnreadable(false);
    setData(null);
    setPin('');
    setError('');
    setPhase('setup');
  }, [markUnreadable]);

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

  // Adiciona vários serviços de uma vez (um único salvamento)
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

  // Importação de backup: é a ÚNICA ação que libera a gravação de novo
  const replaceData = useCallback(
    (newData: AppData) => {
      markUnreadable(false);
      setData(newData);
      persist(newData, pin);
    },
    [pin, persist, markUnreadable]
  );

  return {
    phase,
    data,
    pin,
    error,
    saveError,
    clearSaveError,
    dataUnreadable,
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
