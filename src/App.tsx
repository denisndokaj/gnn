import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { EditorPreventivo } from './components/EditorPreventivo';
import { AnteprimaStampa } from './components/AnteprimaStampa';
import { ImpostazioniAzienda } from './components/ImpostazioniAzienda';
import { usePreventivi } from './hooks/usePreventivi';
import { caricaDatiAzienda, salvaDatiAzienda } from './lib/storage';
import type { DatiAzienda } from './types';

type VistaMobile = 'modifica' | 'anteprima';

function App() {
  const { preventivi, preventivoCorrente, idCorrente, setIdCorrente, creaNuovo, aggiorna, elimina, duplica } =
    usePreventivi();
  const [datiAzienda, setDatiAzienda] = useState<DatiAzienda>(() => caricaDatiAzienda());
  const [mostraImpostazioni, setMostraImpostazioni] = useState(false);
  const [vistaMobile, setVistaMobile] = useState<VistaMobile>('modifica');

  useEffect(() => {
    salvaDatiAzienda(datiAzienda);
  }, [datiAzienda]);

  function gestisciElimina() {
    if (!preventivoCorrente) return;
    if (confirm(`Eliminare il preventivo N° ${preventivoCorrente.numero}? L'operazione non è reversibile.`)) {
      elimina(preventivoCorrente.id);
    }
  }

  function gestisciStampa() {
    setVistaMobile('anteprima');
    setTimeout(() => window.print(), 50);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
      <Sidebar preventivi={preventivi} idCorrente={idCorrente} onSeleziona={setIdCorrente} onNuovo={creaNuovo} />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 md:hidden">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
            <button
              onClick={() => setVistaMobile('modifica')}
              className={`rounded-md px-3 py-1 ${vistaMobile === 'modifica' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
            >
              Modifica
            </button>
            <button
              onClick={() => setVistaMobile('anteprima')}
              className={`rounded-md px-3 py-1 ${vistaMobile === 'anteprima' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
            >
              Anteprima
            </button>
          </div>
          <button
            onClick={() => setMostraImpostazioni(true)}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            ⚙ Azienda
          </button>
        </div>

        {!preventivoCorrente && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
            <p className="text-lg font-medium text-slate-600">Nessun preventivo selezionato</p>
            <p className="max-w-sm text-sm text-slate-400">
              Crea un nuovo preventivo oppure selezionane uno dall'elenco a sinistra.
            </p>
            <button
              onClick={creaNuovo}
              className="mt-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
            >
              + Nuovo preventivo
            </button>
          </div>
        )}

        {preventivoCorrente && (
          <div className="flex flex-1 flex-col lg:flex-row print:block">
            <div className={`no-print flex-1 lg:block ${vistaMobile === 'modifica' ? 'block' : 'hidden'}`}>
              <div className="no-print hidden items-center justify-end px-6 pt-4 md:flex">
                <button
                  onClick={() => setMostraImpostazioni(true)}
                  className="text-sm text-slate-500 hover:text-slate-800"
                >
                  ⚙ Dati fiscali azienda
                </button>
              </div>
              <EditorPreventivo
                preventivo={preventivoCorrente}
                onChange={aggiorna}
                onElimina={gestisciElimina}
                onDuplica={() => duplica(preventivoCorrente)}
                onStampa={gestisciStampa}
              />
            </div>

            <div
              id="pannello-anteprima"
              className={`flex-1 overflow-y-auto border-t border-slate-200 bg-slate-200/60 p-4 lg:block lg:border-l lg:border-t-0 lg:p-6 print:block print:h-auto print:overflow-visible print:border-0 print:p-0 ${
                vistaMobile === 'anteprima' ? 'block' : 'hidden'
              }`}
            >
              <AnteprimaStampa preventivo={preventivoCorrente} datiAzienda={datiAzienda} />
            </div>
          </div>
        )}
      </main>

      {mostraImpostazioni && (
        <ImpostazioniAzienda
          dati={datiAzienda}
          onChange={setDatiAzienda}
          onChiudi={() => setMostraImpostazioni(false)}
        />
      )}
    </div>
  );
}

export default App;
