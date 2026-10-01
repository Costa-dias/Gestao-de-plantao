import { Calendar } from '@/components/Calendar';
import { MonthLabel } from '@/components/Calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Shift } from '@/types';
import { toISODate } from '@/lib/dateUtils';

interface MonthViewProps {
  year: number;
  month: number;
  shifts: Shift[];
  selectedDate: string | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate: (date: string) => void;
  onSelectShift: (shift: Shift) => void;
}

export function MonthView({
  year,
  month,
  shifts,
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectDate,
  onSelectShift,
}: MonthViewProps) {
  return (
    <div>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={onToday}
          className="flex flex-col items-center"
        >
          <MonthLabel year={year} month={month} />
          <span className="text-xs text-teal-400 hover:text-teal-300">
            Ir para hoje
          </span>
        </button>

        <button
          onClick={onNextMonth}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <Calendar
        year={year}
        month={month}
        shifts={shifts}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        onSelectShift={onSelectShift}
      />
    </div>
  );
}

export { toISODate };
