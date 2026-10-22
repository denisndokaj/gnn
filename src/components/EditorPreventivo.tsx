import type { Preventivo, StatoPreventivo } from '../types';
import { RigheTable } from './RigheTable';
import { calcolaTotali, formattaValuta } from '../lib/calc';

interface Props {
  preventivo: Preventivo;
  onChange: (preventivo: Preventivo) => void;
  onElimina: () => void;
  onDuplica: () => void;
  onStampa: () => void;
}

const OPZIONI_STATO: { valore: StatoPreventivo; etichetta: string }[] = [
  { valore: 'bozza', etichetta: 'Bozza' },
  { valore: 'inviato', etichetta: 'Inviato' },
  { valore: 'accettato', etichetta: 'Accettato' },
  { valore: 'rifiutato', etichetta: 'Rifiutato' },
];

function campoClasse() {
  return 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700';
}

export function EditorPreventivo({ preventivo, onChange, onElimina, onDuplica, onStampa }: Props) {
  const totali = calcolaTotali(preventivo);

  function set<K extends keyof Preventivo>(campo: K, valore: Preventivo[K]) {
    onChange({ ...preventivo, [campo]: valore });
  }

  function setCliente<K extends keyof Preventivo['cliente']>(campo: K, valore: Preventivo['cliente'][K]) {
    onChange({ ...preventivo, cliente: { ...preventivo.cliente, [campo]: valore } });
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-slate-500">
            Intestazione
            <input
              value={preventivo.titolo}
              onChange={(e) => set('titolo', e.target.value)}
              placeholder="PREVENTIVO"
              title="Scrivi la dicitura che vuoi far comparire sul documento, es. PREVENTIVO, SALDO, FATTURA…"
              className="ml-2 w-32 rounded-lg border border-slate-300 px-2 py-1 text-sm font-semibold outline-none focus:border-blue-700"
            />
          </label>
          <label className="text-sm text-slate-500">
            N°
            <input
              value={preventivo.numero}
              onChange={(e) => set('numero', e.target.value)}
              className="ml-2 w-28 rounded-lg border border-slate-300 px-2 py-1 text-sm font-semibold outline-none focus:border-blue-700"
            />
          </label>
          <select
            value={preventivo.stato}
            onChange={(e) => set('stato', e.target.value as StatoPreventivo)}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-700"
          >
            {OPZIONI_STATO.map((o) => (
              <option key={o.valore} value={o.valore}>
                {o.etichetta}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onDuplica}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Duplica
          </button>
          <button
            onClick={onElimina}
            className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
          >
            Elimina
          </button>
          <button
            onClick={onStampa}
            className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-900"
          >
            Stampa / Esporta PDF
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-900">Dati cliente</h3>
          <input
            value={preventivo.cliente.nome}
            onChange={(e) => setCliente('nome', e.target.value)}
            placeholder="Nome e cognome / Ragione sociale"
            className={campoClasse()}
          />
          <input
            value={preventivo.cliente.indirizzo}
            onChange={(e) => setCliente('indirizzo', e.target.value)}
            placeholder="Indirizzo"
            className={campoClasse()}
          />
          <div className="flex gap-3">
            <input
              value={preventivo.cliente.telefono}
              onChange={(e) => setCliente('telefono', e.target.value)}
              placeholder="Telefono"
              className={campoClasse()}
            />
            <input
              value={preventivo.cliente.email}
              onChange={(e) => setCliente('email', e.target.value)}
              placeholder="Email"
              className={campoClasse()}
            />
          </div>
          <input
            value={preventivo.cliente.codiceFiscalePiva}
            onChange={(e) => setCliente('codiceFiscalePiva', e.target.value)}
            placeholder="Codice fiscale / Partita IVA (facoltativo)"
            className={campoClasse()}
          />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-900">Dati preventivo</h3>
          <div className="flex gap-3">
            <label className="flex-1 text-xs font-medium text-slate-500">
              Data
              <input
                type="date"
                value={preventivo.data}
                onChange={(e) => set('data', e.target.value)}
                className={`${campoClasse()} mt-1`}
              />
            </label>
            <label className={`w-32 text-xs font-medium text-slate-500 ${!preventivo.mostraValidita && 'opacity-40'}`}>
              Validità (gg)
              <input
                type="number"
                value={preventivo.validitaGiorni}
                onChange={(e) => set('validitaGiorni', Number(e.target.value))}
                disabled={!preventivo.mostraValidita}
                className={`${campoClasse()} mt-1 disabled:cursor-not-allowed`}
              />
            </label>
          </div>
          <label className="flex items-center gap-1.5 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={preventivo.mostraValidita}
              onChange={(e) => set('mostraValidita', e.target.checked)}
              className="rounded border-slate-300 text-blue-800 focus:ring-blue-700"
            />
            Mostra la validità dell'offerta nel preventivo
          </label>
          <input
            value={preventivo.oggetto}
            onChange={(e) => set('oggetto', e.target.value)}
            placeholder="Oggetto dei lavori (es. Ristrutturazione bagno)"
            className={campoClasse()}
          />
          <input
            value={preventivo.luogoLavori}
            onChange={(e) => set('luogoLavori', e.target.value)}
            placeholder="Luogo / cantiere (se diverso dall'indirizzo cliente)"
            className={campoClasse()}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Voci di preventivo</h3>
        <RigheTable righe={preventivo.righe} onChange={(righe) => set('righe', righe)} />
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-900">Condizioni e note</h3>
          <textarea
            value={preventivo.condizioniPagamento}
            onChange={(e) => set('condizioniPagamento', e.target.value)}
            placeholder="Condizioni di pagamento (es. 30% all'ordine, saldo a fine lavori)"
            rows={2}
            className={campoClasse()}
          />
          <textarea
            value={preventivo.note}
            onChange={(e) => set('note', e.target.value)}
            placeholder="Note aggiuntive"
            rows={3}
            className={campoClasse()}
          />
        </div>

        <div className="flex flex-col gap-2 justify-self-end self-start rounded-lg bg-slate-50 p-4 md:w-72">
          <label className="flex items-center justify-between text-sm text-slate-600">
            Sconto %
            <input
              type="number"
              step="any"
              value={preventivo.scontoPercentuale}
              onChange={(e) => set('scontoPercentuale', Number(e.target.value))}
              className="w-20 rounded border border-slate-300 px-2 py-1 text-right text-sm outline-none focus:border-blue-700"
            />
          </label>
          <label className="flex items-center justify-between text-sm text-slate-600">
            IVA %
            <input
              type="number"
              step="any"
              value={preventivo.ivaPercentuale}
              onChange={(e) => set('ivaPercentuale', Number(e.target.value))}
              className="w-20 rounded border border-slate-300 px-2 py-1 text-right text-sm outline-none focus:border-blue-700"
            />
          </label>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Applicazione IVA</span>
            <div className="flex overflow-hidden rounded-lg border border-slate-300 text-xs font-medium">
              <button
                type="button"
                onClick={() => set('applicaIva', true)}
                className={`px-2.5 py-1 transition ${
                  preventivo.applicaIva ? 'bg-blue-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                IVA inclusa
              </button>
              <button
                type="button"
                onClick={() => set('applicaIva', false)}
                className={`border-l border-slate-300 px-2.5 py-1 transition ${
                  !preventivo.applicaIva ? 'bg-blue-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                IVA esclusa
              </button>
            </div>
          </div>
          <hr className="my-1 border-slate-200" />
          {totali.inSospeso && (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs leading-snug text-amber-800">
              {totali.righeSospese === 1 ? '1 voce è' : `${totali.righeSospese} voci sono`} senza quantità: il
              totale resta in sospeso finché non viene rilevata la misura.
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Imponibile lordo{totali.inSospeso && ' (voci quantificate)'}</span>
            <span>{formattaValuta(totali.imponibileLordo)}</span>
          </div>
          {preventivo.scontoPercentuale > 0 && (
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Sconto</span>
              <span>− {formattaValuta(totali.valoreSconto)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Imponibile netto</span>
            <span>{formattaValuta(totali.imponibileNetto)}</span>
          </div>
          {preventivo.applicaIva && (
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>IVA ({preventivo.ivaPercentuale}%)</span>
              <span>{formattaValuta(totali.valoreIva)}</span>
            </div>
          )}
          <hr className="my-1 border-slate-200" />
          <div className="flex items-center justify-between text-base font-semibold text-slate-900">
            <span>Totale ({preventivo.applicaIva ? 'IVA inclusa' : 'IVA esclusa'})</span>
            {totali.inSospeso ? (
              <span className="text-amber-700">Da definire</span>
            ) : (
              <span>{formattaValuta(totali.totale)}</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
