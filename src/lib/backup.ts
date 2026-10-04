import type { AppData } from '@/types';
import {
  deriveVerifierKey,
  encryptString,
  decryptString,
  generateSalt,
  generateIV,
} from '@/lib/crypto';
import { isValidBackupData } from '@/lib/validation';

const BACKUP_MAGIC = 'EF-BACKUP-V1';
const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

export interface BackupEnvelope {
  magic: string;
  version: number;
  createdAt: string;
  salt: string;
  iv: string;
  data: string;
}

function parseJsonSafely(text: string): unknown {
  return JSON.parse(text, (key: string, value: unknown) => {
    if (key === '__proto__' || key === 'prototype' || key === 'constructor') {
      throw new Error('Estrutura de backup inválida.');
    }
    return value;
  });
}

function hasLength(encoded: string, expectedBytes: number): boolean {
  try {
    return atob(encoded).length === expectedBytes;
  } catch {
    return false;
  }
}

function isValidEnvelope(value: unknown): value is BackupEnvelope {
  if (!value || typeof value !== 'object') return false;
  const envelope = value as Partial<BackupEnvelope>;
  return (
    envelope.magic === BACKUP_MAGIC &&
    envelope.version === 1 &&
    typeof envelope.createdAt === 'string' &&
    !Number.isNaN(Date.parse(envelope.createdAt)) &&
    typeof envelope.salt === 'string' &&
    BASE64.test(envelope.salt) &&
    hasLength(envelope.salt, 16) &&
    typeof envelope.iv === 'string' &&
    BASE64.test(envelope.iv) &&
    hasLength(envelope.iv, 12) &&
    typeof envelope.data === 'string' &&
    envelope.data.length > 0 &&
    envelope.data.length <= MAX_BACKUP_BYTES * 2
  );
}

export async function exportBackup(data: AppData, pin: string): Promise<Blob> {
  if (!isValidBackupData(data)) {
    throw new Error('Não foi possível criar um backup dos dados atuais.');
  }

  const salt = generateSalt();
  const iv = generateIV();
  const key = await deriveVerifierKey(pin, salt);
  const json = JSON.stringify(data);
  const cipher = await encryptString(json, key, iv);

  const envelope: BackupEnvelope = {
    magic: BACKUP_MAGIC,
    version: 1,
    createdAt: new Date().toISOString(),
    salt,
    iv,
    data: cipher,
  };

  const encoded = JSON.stringify(envelope, null, 2);
  if (new Blob([encoded]).size > MAX_BACKUP_BYTES) {
    throw new Error('O backup excede o tamanho máximo permitido.');
  }
  return new Blob([encoded], { type: 'application/json' });
}

export async function importBackup(file: File, pin: string): Promise<AppData> {
  if (file.size > MAX_BACKUP_BYTES) {
    throw new Error('O arquivo de backup é maior que o limite de 5 MB.');
  }
  if (file.type && file.type !== 'application/json' && file.type !== 'text/json') {
    throw new Error('Selecione um arquivo JSON de backup.');
  }

  const text = await file.text();
  if (text.length > MAX_BACKUP_BYTES) {
    throw new Error('O arquivo de backup é maior que o limite de 5 MB.');
  }

  let parsedEnvelope: unknown;
  try {
    parsedEnvelope = parseJsonSafely(text);
  } catch {
    throw new Error('Arquivo de backup inválido ou corrompido.');
  }
  if (!isValidEnvelope(parsedEnvelope)) {
    throw new Error('Este arquivo não é um backup válido do TurnoExtra.');
  }

  const key = await deriveVerifierKey(pin, parsedEnvelope.salt);
  let json: string;
  try {
    json = await decryptString(parsedEnvelope.data, key, parsedEnvelope.iv);
  } catch {
    throw new Error('Não foi possível descriptografar o backup. Verifique se o PIN está correto.');
  }

  let parsedData: unknown;
  try {
    parsedData = parseJsonSafely(json);
  } catch {
    throw new Error('Os dados do backup estão corrompidos.');
  }
  if (!isValidBackupData(parsedData)) {
    throw new Error('O backup contém dados inválidos ou incompatíveis.');
  }
  return parsedData;
}

export function downloadBackup(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
