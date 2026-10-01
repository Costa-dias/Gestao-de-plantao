const LAST_KEY = 'escalafacil-last-backup';
const SNOOZE_KEY = 'escalafacil-backup-snooze';
const DAY_MS = 86_400_000;

export const BACKUP_INTERVAL_DAYS = 30;
const SNOOZE_DAYS = 7;

function readNumber(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function writeNumber(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // sem armazenamento: o lembrete só não será lembrado
  }
}

// Chamar quando o backup for exportado com sucesso
export function markBackupDone(): void {
  writeNumber(LAST_KEY, Date.now());
  try {
    localStorage.removeItem(SNOOZE_KEY);
  } catch {
    // ignora
  }
}

// "Depois": esconde o aviso por 7 dias
export function snoozeBackupReminder(): void {
  writeNumber(SNOOZE_KEY, Date.now() + SNOOZE_DAYS * DAY_MS);
}

// null = nunca fez backup
export function getDaysSinceBackup(): number | null {
  const last = readNumber(LAST_KEY);
  if (last === null) return null;
  return Math.max(0, Math.floor((Date.now() - last) / DAY_MS));
}

export function isBackupDue(hasData: boolean): boolean {
  if (!hasData) return false;
  const snoozeUntil = readNumber(SNOOZE_KEY);
  if (snoozeUntil !== null && Date.now() < snoozeUntil) return false;
  const days = getDaysSinceBackup();
  return days === null || days >= BACKUP_INTERVAL_DAYS;
}
