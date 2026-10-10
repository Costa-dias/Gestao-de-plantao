export const INACTIVITY_LOCK_MS = 60_000;

interface LockEnvironment {
  document: Pick<Document, 'visibilityState' | 'addEventListener' | 'removeEventListener'>;
  window: Pick<Window, 'addEventListener' | 'removeEventListener'>;
  now: () => number;
  setTimeout: (callback: () => void, delay: number) => number;
  clearTimeout: (timer: number) => void;
}

/** Usa o horário real para funcionar mesmo quando o celular suspende os timers. */
export function startInactivityLock(
  onLock: () => void,
  env: LockEnvironment = {
    document,
    window,
    now: Date.now,
    setTimeout: (callback, delay) => window.setTimeout(callback, delay),
    clearTimeout: (timer) => window.clearTimeout(timer),
  }
): () => void {
  let deadline = env.now() + INACTIVITY_LOCK_MS;
  let hidden = env.document.visibilityState === 'hidden';
  let timer: number | undefined;
  let stopped = false;

  function lockIfExpired(): boolean {
    if (stopped) return true;
    if (env.now() < deadline) return false;
    cleanup();
    onLock();
    return true;
  }

  function schedule(): void {
    if (timer !== undefined) env.clearTimeout(timer);
    timer = env.setTimeout(() => {
      if (!lockIfExpired()) schedule();
    }, Math.max(0, deadline - env.now()));
  }

  function onActivity(): void {
    if (hidden || lockIfExpired()) return;
    deadline = env.now() + INACTIVITY_LOCK_MS;
    schedule();
  }

  function onVisibility(): void {
    const nextHidden = env.document.visibilityState === 'hidden';
    if (nextHidden === hidden || lockIfExpired()) return;
    hidden = nextHidden;
    // Ao sair, concede um minuto; ao voltar dentro do prazo, reinicia a inatividade.
    deadline = env.now() + INACTIVITY_LOCK_MS;
    schedule();
  }

  const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart', 'focus'];
  function cleanup(): void {
    stopped = true;
    if (timer !== undefined) env.clearTimeout(timer);
    env.document.removeEventListener('visibilitychange', onVisibility);
    for (const event of activityEvents) env.window.removeEventListener(event, onActivity);
  }

  env.document.addEventListener('visibilitychange', onVisibility);
  for (const event of activityEvents) {
    env.window.addEventListener(event, onActivity, { passive: true });
  }
  schedule();
  return cleanup;
}
