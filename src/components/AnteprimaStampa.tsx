import type { DatiAzienda, Preventivo } from '../types';
import { calcolaTotali, formattaData, formattaValuta, totaleFinaleEffettivo, totaleRiga } from '../lib/calc';
import { AZIENDA } from '../lib/azienda';
import logo from '../assets/logo.jpg';

interface Props {
  preventivo: Preventivo;
  datiAzienda: DatiAzienda;
}

export function AnteprimaStampa({ preventivo, datiAzienda }: Props) {
  const totali = calcolaTotali(preventivo);
  const totaleFinale = totaleFinaleEffettivo(preventivo, totali);
  const righeValide = preventivo.righe.filter(
    (r) => r.descrizione.trim() || r.quantita !== null || r.prezzoUnitario || r.totaleManuale !== null,
  );

  return (
    <div
      id="area-stampa"
      className="@container mx-auto flex w-full max-w-[210mm] flex-col overflow-hidden rounded-lg bg-white text-[13px] text-slate-800 shadow-sm"
    >
      <div className="h-2 w-full bg-blue-900 print:h-1.5" />
      <div className="flex flex-col gap-6 p-8 md:p-10 print:p-0">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 @sm:flex-row @sm:flex-wrap @sm:items-start @sm:justify-between">
          <div className="flex flex-col items-start gap-2 @sm:flex-row @sm:items-center @sm:gap-4">
            <img src={logo} alt="G.N.N. s.n.c." className="h-16 w-auto @sm:h-24 print:h-36" />
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">{AZIENDA.ragioneSociale}</p>
              <p className="mt-0.5 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium tracking-wide text-blue-900">
                {AZIENDA.settore}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {AZIENDA.indirizzo}
                <br />
                {AZIENDA.email}
                {(datiAzienda.piva || datiAzienda.codiceFiscale) && (
                  <>
                    <br />
                    {datiAzienda.piva && `P.IVA ${datiAzienda.piva}`}
                    {datiAzienda.piva && datiAzienda.codiceFiscale && ' — '}
                    {datiAzienda.codiceFiscale && `C.F. ${datiAzienda.codiceFiscale}`}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="text-left @sm:text-right">
            <h1 className="text-2xl font-extrabold tracking-tight text-blue-900">
              {preventivo.titolo || 'PREVENTIVO'}
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-700">N° {preventivo.numero}</p>
            <p className="text-xs text-slate-500">Data: {formattaData(preventivo.data)}</p>
            {preventivo.mostraValidita && (
              <p className="text-xs text-slate-500">Valido {preventivo.validitaGiorni} giorni</p>
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
          <div className="rounded-lg border-l-4 border-blue-900 bg-slate-50 px-4 py-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-blue-900/70">Spett.le</p>
            <div className="space-y-0.5 text-slate-700">
              <p className="text-[15px] font-semibold text-slate-900">{preventivo.cliente.nome || '—'}</p>
              {preventivo.cliente.indirizzo && <p>{preventivo.cliente.indirizzo}</p>}
              {preventivo.cliente.telefono && <p>Tel. {preventivo.cliente.telefono}</p>}
              {preventivo.cliente.email && <p>{preventivo.cliente.email}</p>}
              {preventivo.cliente.codiceFiscalePiva && <p>C.F./P.IVA: {preventivo.cliente.codiceFiscalePiva}</p>}
            </div>
          </div>
          <div className="rounded-lg border-l-4 border-blue-900 bg-slate-50 px-4 py-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-blue-900/70">Oggetto</p>
            <div className="space-y-0.5 text-slate-700">
              <p className="text-[15px] font-semibold text-slate-900">{preventivo.oggetto || '—'}</p>
              {preventivo.luogoLavori && (
                <>
                  <p className="pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-900/70">
                    Luogo lavori
                  </p>
                  <p>{preventivo.luogoLavori}</p>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[420px] border-collapse text-[12.5px]">
            <thead>
              <tr className="bg-blue-900 text-left text-[11px] font-semibold uppercase tracking-wide text-white">
                <th className="py-2.5 pl-3 pr-2">Descrizione</th>
                <th className="w-14 py-2.5 pr-2">U.M.</th>
                <th className="w-16 py-2.5 pr-2 text-right">Q.tà</th>
                {preventivo.mostraPrezzi && (
                  <>
                    <th className="w-24 py-2.5 pr-2 text-right">Prezzo unit.</th>
                    <th className="w-24 py-2.5 pr-3 text-right">Totale</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {righeValide.length === 0 && (
                <tr>
                  <td colSpan={preventivo.mostraPrezzi ? 5 : 3} className="py-5 text-center text-slate-400">
                    Nessuna voce inserita
                  </td>
                </tr>
              )}
              {righeValide.map((riga, indice) => (
                <tr
                  key={riga.id}
                  className={`align-top ${indice % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}
                >
                  <td className="whitespace-pre-wrap py-2.5 pl-3 pr-2">{riga.descrizione}</td>
                  <td className="py-2.5 pr-2">{riga.unitaMisura}</td>
                  <td className="py-2.5 pr-2 text-right">
                    {riga.quantita !== null
                      ? riga.quantita
                      : totaleRiga(riga) !== null
                        ? '—'
                        : <span className="italic text-amber-600">da rilevare</span>}
                  </td>
                  {preventivo.mostraPrezzi && (
                    <>
                      <td className="py-2.5 pr-2 text-right">
                        {riga.quantita === null && totaleRiga(riga) !== null
                          ? '—'
                          : formattaValuta(riga.prezzoUnitario)}
                      </td>
                      <td className="py-2.5 pr-3 text-right font-medium">
                        {totaleRiga(riga) === null ? (
                          <span className="italic text-amber-600">da definire</span>
                        ) : (
                          formattaValuta(totaleRiga(riga)!)
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="flex flex-col items-end gap-2">
          <div className="w-full rounded-lg bg-slate-50 p-4 text-sm @sm:w-80">
            {preventivo.mostraPrezzi && (
              <>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Imponibile lordo{totali.inSospeso && ' (voci quantificate)'}</span>
                  <span>{formattaValuta(totali.imponibileLordo)}</span>
                </div>
                {preventivo.scontoPercentuale > 0 && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>Sconto ({preventivo.scontoPercentuale}%)</span>
                    <span>− {formattaValuta(totali.valoreSconto)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Imponibile netto</span>
                  <span>{formattaValuta(totali.imponibileNetto)}</span>
                </div>
                {preventivo.applicaIva && (
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>IVA ({preventivo.ivaPercentuale}%)</span>
                    <span>{formattaValuta(totali.valoreIva)}</span>
                  </div>
                )}
                <hr className="my-2 border-slate-200" />
              </>
            )}
            <div className="flex items-center justify-between rounded-md bg-blue-900 px-3 py-2.5 text-base font-bold text-white">
              <span className="text-sm font-semibold">
                TOTALE {preventivo.applicaIva ? '(IVA inclusa)' : '(IVA esclusa)'}
              </span>
              {totaleFinale.inSospeso ? (
                <span className="text-amber-300">Da definire</span>
              ) : (
                <span>{formattaValuta(totaleFinale.valore)}</span>
              )}
            </div>
          </div>
          {preventivo.mostraPrezzi && totaleFinale.inSospeso && (
            <p className="w-full text-right text-[11px] italic leading-snug text-amber-700 @sm:w-80">
              Prezzo indicato a unità di misura: il totale sarà definito a seguito del rilievo delle quantità
              effettive.
            </p>
          )}
        </section>

        {(preventivo.condizioniPagamento || preventivo.note) && (
          <section className="flex flex-col gap-3 border-t border-slate-200 pt-5">
            {preventivo.condizioniPagamento && (
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-blue-900/70">
                  Condizioni di pagamento
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">{preventivo.condizioniPagamento}</p>
              </div>
            )}
            {preventivo.note && (
              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-blue-900/70">Note</p>
                <p className="whitespace-pre-wrap leading-relaxed">{preventivo.note}</p>
              </div>
            )}
          </section>
        )}

        <section className="mt-2 flex flex-col items-start gap-6 border-t border-slate-200 pt-6 @sm:flex-row @sm:items-end @sm:justify-between">
          <div className="text-xs leading-relaxed text-slate-500">
            <p className="mb-1 font-semibold uppercase tracking-wider text-blue-900/70">Contatti</p>
            <p className="flex flex-wrap gap-y-0.5">
              {AZIENDA.referenti.map((r) => (
                <span key={r.nome} className="whitespace-nowrap">
                  <span className="mr-1.5 text-blue-900/40">•</span>
                  {r.nome} {r.telefono}
                </span>
              ))}
            </p>
            {datiAzienda.iban && <p>IBAN: {datiAzienda.iban}</p>}
            {datiAzienda.rea && <p>REA: {datiAzienda.rea}</p>}
          </div>
          <div className="w-full text-center text-xs text-slate-500 @sm:w-60">
            <div className="rounded-lg border border-dashed border-slate-300 px-4 pb-3 pt-10">
              <div className="border-t border-slate-400" />
              <p className="mt-2 font-medium">Per accettazione (firma)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
