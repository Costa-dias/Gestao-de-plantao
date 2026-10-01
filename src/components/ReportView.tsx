import { useState, useMemo, useRef, useEffect } from 'react';
import {
  X,
  FileText,
  CalendarRange,
  Printer,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ChevronDown,
  Share2,
} from 'lucide-react';
import type { Shift } from '@/types';
import { formatCurrency, formatDateBR, toISODate } from '@/lib/dateUtils';

interface ReportViewProps {
  open: boolean;
  onClose: () => void;
  shifts: Shift[];
}

export function ReportView({ open, onClose, shifts }: ReportViewProps) {
  const todayISO = toISODate(new Date());
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const [startDate, setStartDate] = useState(toISODate(monthAgo));
  const [endDate, setEndDate] = useState(todayISO);
  const [selectedLocation, setSelectedLocation] = useState<string>('__all__');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Collect all unique locations from ALL shifts (not just filtered)
  const allLocations = useMemo(() => {
    const set = new Set<string>();
    for (const s of shifts) {
      if (s.location.trim()) set.add(s.location.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [shifts]);

  // Filter locations by search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return allLocations;
    const q = searchQuery.toLowerCase();
    return allLocations.filter((l) => l.toLowerCase().includes(q));
  }, [allLocations, searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const reportShifts = useMemo(() => {
    return shifts
      .filter((s) => s.date >= startDate && s.date <= endDate)
      .filter((s) => selectedLocation === '__all__' || s.location.trim() === selectedLocation)
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  }, [shifts, startDate, endDate, selectedLocation]);

  const totals = useMemo(() => {
    const total = reportShifts.reduce((sum, s) => sum + s.value, 0);
    const paid = reportShifts.filter((s) => s.paid).reduce((sum, s) => sum + s.value, 0);
    const pending = total - paid;
    const count = reportShifts.length;
    const paidCount = reportShifts.filter((s) => s.paid).length;
    return { total, paid, pending, count, paidCount };
  }, [reportShifts]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const map = new Map<string, Shift[]>();
    for (const s of reportShifts) {
      const list = map.get(s.date) ?? [];
      list.push(s);
      map.set(s.date, list);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [reportShifts]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const locationLabel =
      selectedLocation === '__all__' ? 'Todas as empresas' : selectedLocation;
    let text = `EXTRATO DE PLANTÕES\n`;
    text += `Período: ${formatDateBR(startDate)} a ${formatDateBR(endDate)}\n`;
    text += `Empresa: ${locationLabel}\n`;
    text += `${'─'.repeat(40)}\n\n`;

    for (const [date, dayShifts] of groupedByDate) {
      text += `${formatDateBR(date)}\n`;
      for (const s of dayShifts) {
        text += `  ${s.location} | ${s.startTime}-${s.endTime} | ${s.paid ? 'Pago' : 'Pendente'} | ${formatCurrency(s.value)}\n`;
      }
      const dayTotal = dayShifts.reduce((sum, s) => sum + s.value, 0);
      text += `  Subtotal: ${formatCurrency(dayTotal)}\n\n`;
    }

    text += `${'─'.repeat(40)}\n`;
    text += `Total de plantões: ${totals.count}\n`;
    text += `Valor recebido: ${formatCurrency(totals.paid)}\n`;
    text += `Pendente: ${formatCurrency(totals.pending)}\n`;
    text += `VALOR TOTAL: ${formatCurrency(totals.total)}\n`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Extrato de Plantões',
          text,
        });
      } catch {
        // User cancelled — ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Extrato copiado para a área de transferência!');
      } catch {
        alert('Não foi possível copiar. Use o botão Imprimir para gerar PDF.');
      }
    }
  };

  if (!open) return null;

  const dateRangeValid = startDate <= endDate;
  const selectedLabel =
    selectedLocation === '__all__'
      ? 'Todas as Empresas'
      : selectedLocation;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 print:bg-white print:static print:z-auto">
      {/* Print-only title */}
      <div className="hidden print:block px-8 pt-8">
        <h1 className="text-2xl font-bold text-slate-900">Extrato de Plantões</h1>
        <p className="text-slate-600">
          Período: {formatDateBR(startDate)} a {formatDateBR(endDate)} · Empresa: {selectedLabel}
        </p>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600/20 border border-teal-600/30">
            <FileText size={20} className="text-teal-400" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">Extrato de Plantões</h1>
            <p className="text-[11px] text-slate-500">Relatório por período e empresa</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-slate-100"
            title="Compartilhar / Copiar"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-slate-100"
            title="Imprimir / PDF"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-4 print:max-w-none print:px-8 print:py-4">
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 print:hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                <CalendarRange size={14} className="mr-1 inline text-teal-400" />
                Data inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                <CalendarRange size={14} className="mr-1 inline text-teal-400" />
                Data final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          {/* Location filter dropdown */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              <MapPin size={14} className="mr-1 inline text-teal-400" />
              Empresa / Local
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setSearchQuery('');
                }}
                className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-left transition-colors hover:border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <span className={`truncate ${selectedLocation === '__all__' ? 'text-slate-400' : 'text-slate-100'}`}>
                  {selectedLabel}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-20 mt-1 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                  {/* Search input */}
                  <div className="border-b border-slate-700 p-2">
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Buscar empresa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Options list */}
                  <div className="max-h-48 overflow-y-auto">
                    {/* "All" option */}
                    <button
                      onClick={() => {
                        setSelectedLocation('__all__');
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-slate-800 ${
                        selectedLocation === '__all__'
                          ? 'bg-teal-600/20 text-teal-400'
                          : 'text-slate-300'
                      }`}
                    >
                      <MapPin size={14} className="shrink-0 opacity-60" />
                      Todas as Empresas
                    </button>

                    {filteredLocations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-slate-800 ${
                          selectedLocation === loc
                            ? 'bg-teal-600/20 text-teal-400'
                            : 'text-slate-300'
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              shifts.find((s) => s.location.trim() === loc)?.color ?? '#475569',
                          }}
                        />
                        <span className="truncate">{loc}</span>
                      </button>
                    ))}

                    {filteredLocations.length === 0 && (
                      <p className="px-4 py-3 text-center text-xs text-slate-500">
                        Nenhuma empresa encontrada.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {!dateRangeValid ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <CalendarRange size={40} className="text-slate-600" />
            <p className="text-sm text-slate-400">
              A data inicial deve ser anterior ou igual à data final.
            </p>
          </div>
        ) : reportShifts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText size={40} className="text-slate-600" />
            <p className="text-sm text-slate-400">
              Nenhum plantão encontrado para o filtro selecionado.
            </p>
          </div>
        ) : (
          <>
            {/* Report table */}
            <div className="overflow-hidden rounded-xl border border-slate-800 print:border-slate-300">
              {/* Table header */}
              <div className="hidden grid-cols-[1fr_100px_90px_110px] gap-2 border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 print:border-slate-300 print:bg-slate-100 print:text-slate-700 sm:grid">
                <span>Plantão</span>
                <span className="text-center">Horário</span>
                <span className="text-center">Status</span>
                <span className="text-right">Valor</span>
              </div>

              {/* Rows grouped by date */}
              <div className="divide-y divide-slate-800 print:divide-slate-200">
                {groupedByDate.map(([date, dayShifts]) => {
                  const dayTotal = dayShifts.reduce((sum, s) => sum + s.value, 0);
                  return (
                    <div key={date}>
                      {/* Date header row */}
                      <div className="flex items-center justify-between border-b border-slate-800/50 bg-slate-900/40 px-4 py-2 print:border-slate-200 print:bg-slate-50">
                        <span className="text-xs font-semibold text-slate-300 print:text-slate-700">
                          {formatDateBR(date)}
                        </span>
                        <span className="text-xs text-slate-500 print:text-slate-500">
                          {dayShifts.length} {dayShifts.length === 1 ? 'plantão' : 'plantões'}
                        </span>
                      </div>

                      {/* Individual shifts */}
                      {dayShifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="grid grid-cols-[1fr_90px_110px] items-center gap-2 px-4 py-3 transition hover:bg-slate-800/30 print:grid-cols-[1fr_100px_90px_110px] sm:grid-cols-[1fr_100px_90px_110px]"
                        >
                          {/* Location + color */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="h-8 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: shift.color }}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-100 print:text-slate-900">
                                {shift.location}
                              </p>
                              <p className="flex items-center gap-1 truncate text-xs text-slate-500 print:text-slate-500 sm:hidden">
                                <Clock size={10} />
                                {shift.startTime}–{shift.endTime}
                              </p>
                            </div>
                          </div>

                          {/* Time (desktop) */}
                          <div className="hidden items-center justify-center gap-1 text-xs text-slate-400 print:flex sm:flex">
                            <Clock size={12} />
                            {shift.startTime}–{shift.endTime}
                          </div>

                          {/* Status */}
                          <div className="flex items-center justify-center">
                            {shift.paid ? (
                              <span className="flex items-center gap-1 rounded-full bg-emerald-600/20 px-2 py-0.5 text-[11px] font-medium text-emerald-400 print:bg-emerald-100 print:text-emerald-700">
                                <CheckCircle2 size={10} />
                                Pago
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 rounded-full bg-amber-600/20 px-2 py-0.5 text-[11px] font-medium text-amber-400 print:bg-amber-100 print:text-amber-700">
                                <Clock size={10} />
                                Pendente
                              </span>
                            )}
                          </div>

                          {/* Value */}
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-100 print:text-slate-900">
                              {shift.value > 0 ? formatCurrency(shift.value) : '—'}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Day subtotal */}
                      <div className="flex items-center justify-end gap-2 bg-slate-900/20 px-4 py-1.5 print:bg-slate-50">
                        <span className="text-[11px] text-slate-500">Subtotal do dia:</span>
                        <span className="text-xs font-semibold text-slate-300 print:text-slate-700">
                          {formatCurrency(dayTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary footer */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 print:border-slate-300 print:bg-slate-50">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-300">
                    Total de plantões
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-100 print:text-slate-900">
                  {totals.count}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 print:border-slate-300 print:bg-slate-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm text-slate-300">
                    Valor recebido ({totals.paidCount} pagos)
                  </span>
                </div>
                <span className="text-sm font-semibold text-emerald-400">
                  {formatCurrency(totals.paid)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 print:border-slate-300 print:bg-slate-50">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber-400" />
                  <span className="text-sm text-slate-300">
                    Pendente a receber
                  </span>
                </div>
                <span className="text-sm font-semibold text-amber-400">
                  {formatCurrency(totals.pending)}
                </span>
              </div>

              {/* Grand total */}
              <div className="flex items-center justify-between rounded-xl border-2 border-teal-600 bg-teal-600/10 px-4 py-4 print:border-teal-600 print:bg-teal-50">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-teal-400" />
                  <span className="text-base font-semibold text-slate-100 print:text-slate-900">
                    Valor total {selectedLocation !== '__all__' ? `— ${selectedLocation}` : 'do período'}
                  </span>
                </div>
                <span className="text-xl font-bold text-teal-400 print:text-teal-700">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            {/* Period info */}
            <p className="mt-4 text-center text-xs text-slate-500 print:text-slate-500">
              Período: {formatDateBR(startDate)} a {formatDateBR(endDate)} ·
              {selectedLocation !== '__all__' ? ` Empresa: ${selectedLocation} ·` : ''} Gerado em {formatDateBR(toISODate(new Date()))}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
