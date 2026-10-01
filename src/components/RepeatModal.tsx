import { useEffect, useMemo, useState } from 'react';
import { Repeat } from 'lucide-react';
import type { Shift } from '@/types';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { formatDateBR } from '@/lib/dateUtils';

type NewShift = Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>;

interface RepeatModalProps {
  open: boolean;
  onClose: () => void;
  shift: Shift | null;
  existing: Shift[];
  onConfirm: (shifts: NewShift[]) => void;
}

const INTERVALS = [
  { days: 1, label: 'Todo dia' },
  { days: 2, label: 'A cada 2 dias (12x36)' },
  { days: 7, label: 'Toda semana' },
  { days: 14, label: 'A cada 2 semanas' },
];

const MAX_REPEATS = 30;

// Soma dias a uma data AAAA-MM-DD sem depender do fuso horário
function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export function RepeatModal({ open, onClose, shift, existing, onConfirm }: RepeatModalProps) {
  const [interval, setIntervalDays] = useState(7);
  const [countText, setCountText] = useState('4');

  useEffect(() => {
    if (open) {
      setIntervalDays(7);
      setCountText('4');
    }
  }, [open]);

  const count = Math.min(MAX_REPEATS, Math.max(0, parseInt(countText, 10) || 0));

  const plan = useMemo(() => {
    const toCreate: NewShift[] = [];
    let skipped = 0;
    if (!shift || count === 0) return { toCreate, skipped };

    // Copia o plantão, mas não o id, as datas de controle nem o pagamento
    const {
      id: _id,
      createdAt: _created,
      updatedAt: _updated,
      paymentDate: _payment,
      ...base
    } = shift;

    for (let i = 1; i <= count; i++) {
      const date = addDays(shift.date, interval * i);
      const duplicate = existing.some(
        (s) => s.date === date && s.location === shift.location && s.startTime === shift.startTime
      );
      if (duplicate) {
        skipped++;
        continue;
      }
      toCreate.push({ ...base, date, paid: false });
    }
    return { toCreate, skipped };
  }, [shift, existing, interval, count]);

  if (!shift) return null;

  const lastDate = plan.toCreate.length > 0 ? plan.toCreate[plan.toCreate.length - 1].date : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Repetir plantão"
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={plan.toCreate.length === 0}
            onClick={() => {
              onConfirm(plan.toCreate);
              onClose();
            }}
          >
            <Repeat size={16} /> Criar {plan.toCreate.length}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
          <p className="truncate font-medium text-slate-200">{shift.location}</p>
          <p className="text-xs text-slate-400">
            {formatDateBR(shift.date)} · {shift.startTime} às {shift.endTime}
          </p>
        </div>

        <div>
          <label
            htmlFor="repeat-interval"
            className="mb-1.5 block text-sm font-medium text-slate-300"
          >
            Repetir
          </label>
          <select
            id="repeat-interval"
            value={interval}
            onChange={(e) => setIntervalDays(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 focus:border-teal-500 focus:outline-none"
          >
            {INTERVALS.map((item) => (
              <option key={item.days} value={item.days}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={`Quantas vezes repetir (1 a ${MAX_REPEATS})`}
          type="text"
          inputMode="numeric"
          placeholder="4"
          value={countText}
          onChange={(e) => setCountText(e.target.value.replace(/\D/g, '').slice(0, 2))}
        />

        <p className="text-sm text-slate-400">
          {lastDate
            ? `Serão criados ${plan.toCreate.length} plantões, até ${formatDateBR(lastDate)}.`
            : 'Nenhum plantão novo para criar.'}
          {plan.skipped > 0 && ` ${plan.skipped} já existem e serão ignorados.`}
        </p>
        <p className="text-xs text-slate-500">
          Os plantões copiados começam como "não pagos".
        </p>
      </div>
    </Modal>
  );
}
