import type { DatiAzienda, Preventivo } from '../types';
import { calcolaTotali, formattaData, formattaValuta, totaleRiga } from '../lib/calc';
import { AZIENDA } from '../lib/azienda';
import logo from '../assets/logo.jpg';

interface Props {
  preventivo: Preventivo;
  datiAzienda: DatiAzienda;
}

export function AnteprimaStampa({ preventivo, datiAzienda }: Props) {
  const totali = calcolaTotali(preventivo);
  const righeValide = preventivo.righe.filter((r) => r.descrizione.trim() || r.quantita || r.prezzoUnitario);

  return (
    <div
      id="area-stampa"
      className="mx-auto flex w-full max-w-[210mm] flex-col gap-6 bg-white p-8 text-[13px] text-slate-800 shadow-sm md:p-10"
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-blue-900 pb-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="G.N.N. s.n.c." className="h-16 w-auto" />
          <div>
            <p className="text-base font-bold text-slate-900">{AZIENDA.ragioneSociale}</p>
            <p className="text-xs text-slate-500">{AZIENDA.settore}</p>
            <p className="text-xs text-slate-500">{AZIENDA.indirizzo}</p>
            <p className="text-xs text-slate-500">{AZIENDA.email}</p>
            {(datiAzienda.piva || datiAzienda.codiceFiscale) && (
              <p className="text-xs text-slate-500">
                {datiAzienda.piva && `P.IVA ${datiAzienda.piva}`}
                {datiAzienda.piva && datiAzienda.codiceFiscale && ' — '}
                {datiAzienda.codiceFiscale && `C.F. ${datiAzienda.codiceFiscale}`}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold tracking-wide text-blue-900">PREVENTIVO</h1>
          <p className="text-sm text-slate-600">N° {preventivo.numero}</p>
          <p className="text-sm text-slate-600">Data: {formattaData(preventivo.data)}</p>
          <p className="text-sm text-slate-600">Valido {preventivo.validitaGiorni} giorni</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-6">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Spett.le</p>
          <p className="font-semibold text-slate-900">{preventivo.cliente.nome || '—'}</p>
          {preventivo.cliente.indirizzo && <p>{preventivo.cliente.indirizzo}</p>}
          {preventivo.cliente.telefono && <p>Tel. {preventivo.cliente.telefono}</p>}
          {preventivo.cliente.email && <p>{preventivo.cliente.email}</p>}
          {preventivo.cliente.codiceFiscalePiva && <p>C.F./P.IVA: {preventivo.cliente.codiceFiscalePiva}</p>}
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Oggetto</p>
          <p className="font-semibold text-slate-900">{preventivo.oggetto || '—'}</p>
          {preventivo.luogoLavori && (
            <>
              <p className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Luogo lavori
              </p>
              <p>{preventivo.luogoLavori}</p>
            </>
          )}
        </div>
      </section>

      <table className="w-full border-collapse text-[12.5px]">
        <thead>
          <tr className="border-b-2 border-slate-300 text-left text-slate-500">
            <th className="py-2 pr-2">Descrizione</th>
            <th className="w-14 py-2 pr-2">U.M.</th>
            <th className="w-16 py-2 pr-2 text-right">Q.tà</th>
            <th className="w-24 py-2 pr-2 text-right">Prezzo unit.</th>
            <th className="w-24 py-2 text-right">Totale</th>
          </tr>
        </thead>
        <tbody>
          {righeValide.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-slate-400">
                Nessuna voce inserita
              </td>
            </tr>
          )}
          {righeValide.map((riga) => (
            <tr key={riga.id} className="border-b border-slate-100 align-top">
              <td className="whitespace-pre-wrap py-2 pr-2">{riga.descrizione}</td>
              <td className="py-2 pr-2">{riga.unitaMisura}</td>
              <td className="py-2 pr-2 text-right">{riga.quantita}</td>
              <td className="py-2 pr-2 text-right">{formattaValuta(riga.prezzoUnitario)}</td>
              <td className="py-2 text-right font-medium">{formattaValuta(totaleRiga(riga))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="flex justify-end">
        <div className="w-64 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Imponibile lordo</span>
            <span>{formattaValuta(totali.imponibileLordo)}</span>
          </div>
          {preventivo.scontoPercentuale > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Sconto ({preventivo.scontoPercentuale}%)</span>
              <span>− {formattaValuta(totali.valoreSconto)}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Imponibile netto</span>
            <span>{formattaValuta(totali.imponibileNetto)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">
              IVA ({preventivo.ivaPercentuale}%){!preventivo.applicaIva && ' — esclusa'}
            </span>
            <span>{formattaValuta(totali.valoreIva)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t-2 border-blue-900 py-2 text-base font-bold text-blue-900">
            <span>TOTALE ({preventivo.applicaIva ? 'IVA inclusa' : 'IVA esclusa'})</span>
            <span>{formattaValuta(totali.totale)}</span>
          </div>
        </div>
      </section>

      {(preventivo.condizioniPagamento || preventivo.note) && (
        <section className="flex flex-col gap-3 border-t border-slate-200 pt-4">
          {preventivo.condizioniPagamento && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Condizioni di pagamento
              </p>
              <p className="whitespace-pre-wrap">{preventivo.condizioniPagamento}</p>
            </div>
          )}
          {preventivo.note && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Note</p>
              <p className="whitespace-pre-wrap">{preventivo.note}</p>
            </div>
          )}
        </section>
      )}

      <section className="mt-4 flex items-end justify-between gap-6 border-t border-slate-200 pt-6">
        <div className="text-xs text-slate-500">
          <p>Contatti: {AZIENDA.referenti.map((r) => `${r.nome} ${r.telefono}`).join(' • ')}</p>
          {datiAzienda.iban && <p>IBAN: {datiAzienda.iban}</p>}
          {datiAzienda.rea && <p>REA: {datiAzienda.rea}</p>}
        </div>
        <div className="w-56 text-center text-xs text-slate-500">
          <p className="mb-8">Per accettazione (firma)</p>
          <div className="border-t border-slate-400" />
        </div>
      </section>
    </div>
  );
}
