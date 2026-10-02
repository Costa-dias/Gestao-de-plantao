import { useState, useEffect, useCallback } from 'react';
import { Trash2, Save, Layers } from 'lucide-react';
import type { Shift, ShiftTemplate } from '@/types';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';
import { Toggle } from '@/components/Toggle';
import { ColorPicker } from '@/components/ColorPicker';
import { validateShift, sanitizeString } from '@/lib/validation';
import { formatDateBR } from '@/lib/dateUtils';

interface ShiftModalProps {
  open: boolean;
  onClose: () => void;
  shift?: Shift | null;
  defaultDate: string;
  templates: ShiftTemplate[];
  onSave: (data: Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, data: Partial<Shift>) => void;
  onDelete: (id: string) => void;
  onSaveTemplate: (tpl: Omit<ShiftTemplate, 'id'>) => void;
}

export function ShiftModal({
  open,
  onClose,
  shift,
  defaultDate,
  templates,
  onSave,
  onUpdate,
  onDelete,
  onSaveTemplate,
}: ShiftModalProps) {
  const isEdit = !!shift;

  const [location, setLocation] = useState('');
  const [color, setColor] = useState('#0d9488');
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('19:00');
  const [value, setValue] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paid, setPaid] = useState(false);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (shift) {
      setLocation(shift.location);
      setColor(shift.color);
      setDate(shift.date);
      setStartTime(shift.startTime);
      setEndTime(shift.endTime);
      setValue(shift.value !== undefined && shift.value !== null ? String(shift.value) : '');
      setPaymentDate(shift.paymentDate ?? '');
      setPaid(shift.paid);
      setNotes(shift.notes ?? '');
    } else {
      setLocation('');
      setColor('#0d9488');
      setDate(defaultDate);
      setStartTime('07:00');
      setEndTime('19:00');
      setValue('');
      setPaymentDate('');
      setPaid(false);
      setNotes('');
    }
    setErrors({});
  }, [shift, open, defaultDate]);

  const handleApplyTemplate = useCallback((tpl: ShiftTemplate) => {
    setLocation(tpl.location);
    setColor(tpl.color);
    setStartTime(tpl.startTime);
    setEndTime(tpl.endTime);
    setValue(tpl.value !== undefined && tpl.value !== null ? String(tpl.value) : '');
    setNotes(tpl.notes ?? '');
  }, []);

  const handleSave = useCallback(() => {
    const data: Partial<Shift> = {
      location: sanitizeString(location, 100),
      color,
      date,
      startTime,
      endTime,
      value: value ? parseFloat(value) : 0,
      paymentDate: paymentDate || undefined,
      paid,
      notes: notes ? sanitizeString(notes, 1000) : undefined,
    };

    const { valid, errors: validationErrors } = validateShift(data);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    if (isEdit && shift) {
      onUpdate(shift.id, data);
    } else {
      onSave(data as Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>);
    }
    onClose();
  }, [
    location, color, date, startTime, endTime, value,
    paymentDate, paid, notes, isEdit, shift, onUpdate, onSave, onClose,
  ]);

  const handleSaveAsTemplate = useCallback(() => {
    if (!location.trim()) return;
    onSaveTemplate({
      name: `${location} ${startTime}-${endTime}`,
      location: sanitizeString(location, 100),
      color,
      startTime,
      endTime,
      value: value ? parseFloat(value) : 0,
      notes: notes ? sanitizeString(notes, 1000) : undefined,
    });
  }, [location, color, startTime, endTime, value, notes, onSaveTemplate]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar Plantão' : 'Novo Plantão'}
      maxWidth="max-w-xl"
      footer={
        <>
          {isEdit && (
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={() => {
                if (shift && confirm('Excluir este plantão?')) {
                  onDelete(shift.id);
                  onClose();
                }
              }}
            >
              <Trash2 size={16} /> Excluir
            </Button>
          )}
          <div className="flex-1" />
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={handleSave}>
            <Save size={16} /> {isEdit ? 'Salvar' : 'Adicionar'}
          </Button>
        </>
      }
    >
      {/* Templates */}
      {templates.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Layers size={15} className="text-teal-600 dark:text-teal-400" />
            Modelos
          </div>
          <div className="flex flex-wrap gap-2">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                aria-label={`Aplicar modelo ${tpl.name}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 transition hover:border-teal-600 dark:hover:border-teal-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: tpl.color }}
                />
                {tpl.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Local do Plantão *"
          placeholder="Ex: Hospital Central, UPA..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          error={errors.location}
          maxLength={100}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Cor da Etiqueta
          </label>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Data"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Início"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              error={errors.startTime}
            />
            <Input
              label="Fim"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              error={errors.endTime}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Valor total do plantão (R$)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={errors.value}
          />
          <Input
            label="Data de Pagamento"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            error={errors.paymentDate}
          />
        </div>

        {/* Summary */}
        {(value !== '' || paymentDate !== '') && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
            {value !== '' && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Valor do plantão</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  R$ {parseFloat(value || '0').toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}
            {paymentDate !== '' && (
              <div className="mt-1.5 flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Pagamento em</span>
                <span className="text-slate-800 dark:text-slate-300">{formatDateBR(paymentDate)}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Marcar como pago
          </span>
          <Toggle checked={paid} onChange={setPaid} />
        </div>

        <Textarea
          label="Observações"
          placeholder="Notas adicionais sobre este plantão..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={1000}
          error={errors.notes}
        />

        {!isEdit && location.trim() && (
          <button
            type="button"
            onClick={handleSaveAsTemplate}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 py-2.5 text-sm text-slate-600 dark:text-slate-400 transition hover:border-teal-600 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400"
          >
            <Layers size={15} />
            Salvar como modelo
          </button>
        )}
      </div>
    </Modal>
  );
}
