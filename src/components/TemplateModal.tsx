import { Trash2, Layers, Plus } from 'lucide-react';
import type { ShiftTemplate } from '@/types';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { formatTimeRange, formatCurrency } from '@/lib/dateUtils';

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
  templates: ShiftTemplate[];
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function TemplateModal({
  open,
  onClose,
  templates,
  onDelete,
  onAddNew,
}: TemplateModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modelos de Plantão"
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
          <Button variant="primary" onClick={onAddNew}>
            <Plus size={16} /> Novo Modelo
          </Button>
        </>
      }
    >
      {templates.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700">
            <Layers size={28} className="text-slate-500" />
          </div>
          <div>
            <p className="font-medium text-slate-300">Nenhum modelo salvo</p>
            <p className="mt-1 text-sm text-slate-500">
              Crie modelos para preencher plantões com 1 clique.
            </p>
          </div>
          <Button variant="secondary" onClick={onAddNew}>
            <Plus size={16} /> Criar primeiro modelo
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((tpl) => {
            return (
              <div
                key={tpl.id}
                className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-3 transition hover:border-slate-600"
              >
                <div
                  className="h-10 w-1.5 rounded-full"
                  style={{ backgroundColor: tpl.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-slate-200">{tpl.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {tpl.location} · {formatTimeRange(tpl.startTime, tpl.endTime)}
                    {tpl.value > 0 && ` · ${formatCurrency(tpl.value)}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Excluir este modelo?')) onDelete(tpl.id);
                  }}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-red-950/50 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
