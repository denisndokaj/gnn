import type { FocusEvent } from 'react';
import type { Riga } from '../types';
import { formattaValuta, totaleRiga } from '../lib/calc';
import { nuovoId } from '../lib/id';

function autoRidimensiona(elemento: HTMLTextAreaElement | null) {
  if (!elemento) return;
  elemento.style.height = 'auto';
  elemento.style.height = `${elemento.scrollHeight}px`;
}

function selezionaTutto(e: FocusEvent<HTMLInputElement>) {
  e.target.select();
}

interface Props {
  righe: Riga[];
  onChange: (righe: Riga[]) => void;
}

export function RigheTable({ righe, onChange }: Props) {
  function aggiorna(id: string, campo: keyof Riga, valore: string | number | null) {
    onChange(righe.map((r) => (r.id === id ? { ...r, [campo]: valore } : r)));
  }

  function aggiungi() {
    onChange([...righe, { id: nuovoId(), descrizione: '', unitaMisura: '', quantita: 1, prezzoUnitario: 0 }]);
  }

  function rimuovi(id: string) {
    onChange(righe.filter((r) => r.id !== id));
  }

  function sposta(indice: number, direzione: -1 | 1) {
    const nuovoIndice = indice + direzione;
    if (nuovoIndice < 0 || nuovoIndice >= righe.length) return;
    const copia = [...righe];
    const [elemento] = copia.splice(indice, 1);
    copia.splice(nuovoIndice, 0, elemento);
    onChange(copia);
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="w-10 px-2 py-2"></th>
            <th className="px-3 py-2">Descrizione lavorazione</th>
            <th className="w-20 px-3 py-2">U.M.</th>
            <th className="w-28 px-3 py-2">Quantità</th>
            <th className="w-32 px-3 py-2">Prezzo unit.</th>
            <th className="w-32 px-3 py-2 text-right">Totale</th>
            <th className="w-10 px-2 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {righe.map((riga, indice) => (
            <tr key={riga.id} className="border-t border-slate-100">
              <td className="px-2 py-1 text-center text-slate-300">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => sposta(indice, -1)}
                    disabled={indice === 0}
                    className="leading-none hover:text-slate-600 disabled:opacity-20"
                    aria-label="Sposta su"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => sposta(indice, 1)}
                    disabled={indice === righe.length - 1}
                    className="leading-none hover:text-slate-600 disabled:opacity-20"
                    aria-label="Sposta giù"
                  >
                    ▼
                  </button>
                </div>
              </td>
              <td className="px-3 py-1.5">
                <textarea
                  ref={autoRidimensiona}
                  value={riga.descrizione}
                  onChange={(e) => {
                    aggiorna(riga.id, 'descrizione', e.target.value);
                    autoRidimensiona(e.target);
                  }}
                  placeholder="Es. Rifacimento intonaco interno"
                  rows={2}
                  className="w-full resize-none overflow-hidden rounded border border-transparent bg-transparent px-1 py-1 outline-none focus:border-blue-400 focus:bg-white"
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  value={riga.unitaMisura}
                  onChange={(e) => aggiorna(riga.id, 'unitaMisura', e.target.value)}
                  placeholder="mq, ml, h…"
                  className="w-full rounded border border-transparent bg-transparent px-1 py-1 outline-none focus:border-blue-400 focus:bg-white"
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  type="number"
                  step="any"
                  value={riga.quantita ?? ''}
                  onChange={(e) =>
                    aggiorna(riga.id, 'quantita', e.target.value === '' ? null : Number(e.target.value))
                  }
                  onFocus={selezionaTutto}
                  placeholder="da definire"
                  className="w-full rounded border border-transparent bg-transparent px-1 py-1 text-right text-[13px] outline-none placeholder:text-[11px] placeholder:text-slate-300 placeholder:italic focus:border-blue-400 focus:bg-white"
                />
              </td>
              <td className="px-3 py-1.5">
                <input
                  type="number"
                  step="any"
                  value={riga.prezzoUnitario}
                  onChange={(e) => aggiorna(riga.id, 'prezzoUnitario', Number(e.target.value))}
                  onFocus={selezionaTutto}
                  className="w-full rounded border border-transparent bg-transparent px-1 py-1 text-right outline-none focus:border-blue-400 focus:bg-white"
                />
              </td>
              <td className="px-3 py-1.5 text-right font-medium text-slate-700">
                {totaleRiga(riga) === null ? (
                  <span className="text-sm italic text-amber-600">da definire</span>
                ) : (
                  formattaValuta(totaleRiga(riga)!)
                )}
              </td>
              <td className="px-2 py-1.5 text-center">
                <button
                  type="button"
                  onClick={() => rimuovi(riga.id)}
                  className="text-slate-300 hover:text-rose-600"
                  aria-label="Rimuovi riga"
                  title="Rimuovi riga"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={aggiungi}
        className="w-full border-t border-slate-200 px-3 py-2 text-left text-sm font-medium text-blue-800 hover:bg-blue-50"
      >
        + Aggiungi voce
      </button>
    </div>
  );
}
