import type { Shift } from '@/types';

const WEEKDAYS = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

// AAAA-MM-DD -> DD/MM/AAAA (sem usar Date, evita erro de fuso horário)
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function weekday(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

// Horas do plantão; se terminar "antes" de começar, passa da meia-noite
function hoursBetween(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let minutes = eh * 60 + em - (sh * 60 + sm);
  if (minutes <= 0) minutes += 24 * 60;
  return minutes / 60;
}

// Número no padrão brasileiro: 1234,50
function num(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

// Texto seguro para CSV: aspas quando preciso e proteção contra fórmulas
function text(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[;"\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function buildShiftsCsv(shifts: Shift[]): Blob {
  const sorted = [...shifts].sort((a, b) =>
    a.date === b.date
      ? a.startTime.localeCompare(b.startTime)
      : a.date.localeCompare(b.date)
  );

  const lines: string[] = [];
  lines.push(
    [
      'Data',
      'Dia da semana',
      'Local',
      'Início',
      'Término',
      'Horas',
      'Valor (R$)',
      'Pago',
      'Data do pagamento',
      'Observações',
    ].join(';')
  );

  let totalHours = 0;
  let totalValue = 0;
  let paidHours = 0;
  let paidValue = 0;

  for (const s of sorted) {
    const hours = hoursBetween(s.startTime, s.endTime);
    totalHours += hours;
    totalValue += s.value;
    if (s.paid) {
      paidHours += hours;
      paidValue += s.value;
    }
    lines.push(
      [
        formatDate(s.date),
        weekday(s.date),
        text(s.location),
        s.startTime,
        s.endTime,
        num(hours),
        num(s.value),
        s.paid ? 'Sim' : 'Não',
        s.paymentDate ? formatDate(s.paymentDate) : '',
        text(s.notes ?? ''),
      ].join(';')
    );
  }

  const summary = (label: string, hours: number, value: number) =>
    [label, '', '', '', '', num(hours), num(value), '', '', ''].join(';');

  lines.push('');
  lines.push(summary('TOTAL', totalHours, totalValue));
  lines.push(summary('PAGO', paidHours, paidValue));
  lines.push(summary('A RECEBER', totalHours - paidHours, totalValue - paidValue));

  // \uFEFF faz o Excel reconhecer acentos corretamente
  return new Blob(['\uFEFF' + lines.join('\r\n') + '\r\n'], {
    type: 'text/csv;charset=utf-8',
  });
}
