import { useMemo, useState } from 'react';
import type { Preventivo, StatoPreventivo } from '../types';
import { calcolaTotali, formattaData, formattaValuta } from '../lib/calc';
import logo from '../assets/logo.jpg';

const ETICHETTE_STATO: Record<StatoPreventivo, string> = {
  bozza: 'Bozza',
  inviato: 'Inviato',
  accettato: 'Accettato',
  rifiutato: 'Rifiutato',
};

const COLORI_STATO: Record<StatoPreventivo, string> = {
  bozza: 'bg-slate-200 text-slate-700',
  inviato: 'bg-amber-100 text-amber-800',
  accettato: 'bg-emerald-100 text-emerald-800',
  rifiutato: 'bg-rose-100 text-rose-800',
};

interface Props {
  preventivi: Preventivo[];
  idCorrente: string | null;
  onSeleziona: (id: string) => void;
  onNuovo: () => void;
}

export function Sidebar({ preventivi, idCorrente, onSeleziona, onNuovo }: Props) {
  const [ricerca, setRicerca] = useState('');

  const elenco = useMemo(() => {
    const termine = ricerca.trim().toLowerCase();
    const filtrati = termine
      ? preventivi.filter(
          (p) =>
            p.numero.toLowerCase().includes(termine) ||
            p.cliente.nome.toLowerCase().includes(termine) ||
            p.oggetto.toLowerCase().includes(termine),
        )
      : preventivi;
    return [...filtrati].sort((a, b) => b.aggiornatoIl.localeCompare(a.aggiornatoIl));
  }, [preventivi, ricerca]);

  return (
    <aside className="no-print flex w-full shrink-0 flex-col border-b border-slate-200 bg-white md:h-screen md:w-80 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 border-b border-slate-200 p-4">
        <img src={logo} alt="G.N.N. s.n.c." className="h-20 w-auto" />
        <div>
          <p className="text-sm font-semibold text-slate-900">G.N.N. s.n.c.</p>
          <p className="text-xs text-slate-500">Gestione Preventivi</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <button
          onClick={onNuovo}
          className="w-full rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-900"
        >
          + Nuovo preventivo
        </button>
        <input
          value={ricerca}
          onChange={(e) => setRicerca(e.target.value)}
          placeholder="Cerca per numero, cliente, oggetto…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {elenco.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-slate-400">Nessun preventivo trovato.</p>
        )}
        <ul className="flex flex-col gap-1">
          {elenco.map((p) => {
            const { totale, inSospeso } = calcolaTotali(p);
            const attivo = p.id === idCorrente;
            return (
              <li key={p.id}>
                <button
                  onClick={() => onSeleziona(p.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition ${
                    attivo ? 'bg-blue-50 ring-1 ring-blue-700' : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">N° {p.numero}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${COLORI_STATO[p.stato]}`}>
                      {ETICHETTE_STATO[p.stato]}
                    </span>
                  </div>
                  <p className="truncate text-sm text-slate-600">{p.cliente.nome || 'Cliente da definire'}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <span>{formattaData(p.data)}</span>
                    <span className={`font-medium ${inSospeso ? 'italic text-amber-600' : 'text-slate-600'}`}>
                      {inSospeso ? 'Da definire' : formattaValuta(totale)}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
