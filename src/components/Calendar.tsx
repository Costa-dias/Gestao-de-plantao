import { useMemo } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import type { Shift } from '@/types';
import {
  WEEKDAYS_PT,
  MONTHS_PT,
  getMonthGrid,
  toISODate,
  isToday,
  formatTimeRange,
} from '@/lib/dateUtils';

interface CalendarProps {
  year: number;
  month: number;
  shifts: Shift[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onSelectShift: (shift: Shift) => void;
}

export function Calendar({
  year,
  month,
  shifts,
  selectedDate,
  onSelectDate,
  onSelectShift,
}: CalendarProps) {
  const weeks = useMemo(() => getMonthGrid(year, month), [year, month]);

  const shiftsByDate = useMemo(() => {
    const map = new Map<string, Shift[]>();
    for (const shift of shifts) {
      const list = map.get(shift.date) ?? [];
      list.push(shift);
      map.set(shift.date, list);
    }
    return map;
  }, [shifts]);

  return (
    <div className="select-none">
      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS_PT.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((date, i) => {
          const iso = toISODate(date);
          const isCurrentMonth = date.getMonth() === month;
          const today = isToday(date);
          const selected = selectedDate === iso;
          const dayShifts = shiftsByDate.get(iso) ?? [];

          return (
            <button
              key={i}
              onClick={() => onSelectDate(iso)}
              className={`group relative flex min-h-[80px] sm:min-h-[110px] flex-col rounded-lg border p-1.5 text-left transition-all duration-200 ${
                selected
                  ? 'border-teal-500 bg-teal-600/10 ring-1 ring-teal-500/50'
                  : today
                  ? 'border-amber-500/60 bg-amber-500/5'
                  : isCurrentMonth
                  ? 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800'
                  : 'border-slate-800/40 bg-slate-900/30 opacity-50'
              }`}
            >
              {/* Day number */}
              <span
                className={`mb-1 text-xs font-medium ${
                  today
                    ? 'flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-900'
                    : isCurrentMonth
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                {date.getDate()}
              </span>

              {/* Shifts */}
              <div className="flex flex-col gap-1 overflow-hidden">
                {dayShifts.slice(0, 3).map((shift) => (
                  <div
                    key={shift.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectShift(shift);
                    }}
                    className="cursor-pointer rounded-md px-1.5 py-1 text-[10px] leading-tight transition-all hover:scale-[1.02] sm:text-xs"
                    style={{
                      backgroundColor: `${shift.color}30`,
                      borderLeft: `3px solid ${shift.color}`,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {shift.paid && (
                        <CheckCircle2
                          size={10}
                          className="shrink-0 text-emerald-400"
                        />
                      )}
                      <span className="truncate font-medium text-slate-200">
                        {shift.location}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-slate-400">
                      <Clock size={9} className="shrink-0" />
                      <span className="truncate">
                        {formatTimeRange(shift.startTime, shift.endTime)}
                      </span>
                    </div>
                  </div>
                ))}
                {dayShifts.length > 3 && (
                  <span className="px-1.5 text-[10px] text-slate-500">
                    +{dayShifts.length - 3} mais
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MonthLabel({ year, month }: { year: number; month: number }) {
  return (
    <h2 className="text-xl font-bold text-slate-100">
      {MONTHS_PT[month]}{' '}
      <span className="text-slate-500 font-normal">{year}</span>
    </h2>
  );
}
