import type { DatiAzienda } from '../types';

interface Props {
  dati: DatiAzienda;
  onChange: (dati: DatiAzienda) => void;
  onChiudi: () => void;
}

export function ImpostazioniAzienda({ dati, onChange, onChiudi }: Props) {
  function set<K extends keyof DatiAzienda>(campo: K, valore: DatiAzienda[K]) {
    onChange({ ...dati, [campo]: valore });
  }

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Dati fiscali azienda</h2>
          <button onClick={onChiudi} className="text-slate-400 hover:text-slate-700" aria-label="Chiudi">
            ✕
          </button>
        </div>
        <p className="mb-4 text-xs text-slate-500">
          Campi facoltativi: se compilati, vengono stampati nel riquadro intestazione e nel piè di pagina dei
          preventivi.
        </p>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium text-slate-500">
            Partita IVA
            <input
              value={dati.piva}
              onChange={(e) => set('piva', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
            />
          </label>
          <label className="text-xs font-medium text-slate-500">
            Codice Fiscale
            <input
              value={dati.codiceFiscale}
              onChange={(e) => set('codiceFiscale', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
            />
          </label>
          <label className="text-xs font-medium text-slate-500">
            REA
            <input
              value={dati.rea}
              onChange={(e) => set('rea', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
            />
          </label>
          <label className="text-xs font-medium text-slate-500">
            IBAN
            <input
              value={dati.iban}
              onChange={(e) => set('iban', e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700"
            />
          </label>
        </div>
        <button
          onClick={onChiudi}
          className="mt-5 w-full rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
        >
          Fatto
        </button>
      </div>
    </div>
  );
}
