import type { Shift, ServiceType } from '@/types';
import { SERVICE_TYPE_LABELS, BILLING_UNIT_LABELS } from '@/types';
import { calcHours, formatCurrency } from '@/lib/dateUtils';

// Registros antigos não têm "type": são plantões
export function getShiftType(shift: Shift): ServiceType {
  return shift.type ?? 'plantao';
}

export function getTypeLabel(shift: Shift): string {
  return SERVICE_TYPE_LABELS[getShiftType(shift)];
}

export function hasTimeRange(shift: Shift): boolean {
  return shift.hasTime !== false;
}

export function describeTime(shift: Shift): string {
  return hasTimeRange(shift) ? `${shift.startTime} às ${shift.endTime}` : 'Sem horário';
}

// Ex.: "R$ 150,00 por dia × 3"
export function describeRate(shift: Shift): string | null {
  if (!shift.billingUnit || shift.unitValue === undefined || shift.quantity === undefined) {
    return null;
  }
  const unit = BILLING_UNIT_LABELS[shift.billingUnit].toLowerCase();
  return `${formatCurrency(shift.unitValue)} por ${unit} × ${shift.quantity}`;
}

export function shiftHours(shift: Shift): number | null {
  if (hasTimeRange(shift)) return calcHours(shift.startTime, shift.endTime);
  if (shift.billingUnit === 'hora' && shift.quantity !== undefined) return shift.quantity;
  return null;
}
