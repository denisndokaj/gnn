import type { DatiAzienda, Preventivo } from '../types';
import { nuovoId } from './id';

const CHIAVE_PREVENTIVI = 'gnn.preventivi.v1';
const CHIAVE_CONTATORE = 'gnn.contatoreNumerazione.v1';
const CHIAVE_AZIENDA = 'gnn.datiAzienda.v1';

interface Contatore {
  anno: number;
  ultimoProgressivo: number;
}

function leggi<T>(chiave: string, valoreDefault: T): T {
  try {
    const grezzo = localStorage.getItem(chiave);
    if (!grezzo) return valoreDefault;
    return JSON.parse(grezzo) as T;
  } catch {
    return valoreDefault;
  }
}

function scrivi<T>(chiave: string, valore: T): void {
  localStorage.setItem(chiave, JSON.stringify(valore));
}

export function caricaPreventivi(): Preventivo[] {
  const preventivi = leggi<Preventivo[]>(CHIAVE_PREVENTIVI, []);
  return preventivi.map((p) => ({ ...p, applicaIva: p.applicaIva ?? true }));
}

export function salvaPreventivi(preventivi: Preventivo[]): void {
  scrivi(CHIAVE_PREVENTIVI, preventivi);
}

export function prossimoNumero(data: Date = new Date()): string {
  const anno = data.getFullYear();
  const contatore = leggi<Contatore>(CHIAVE_CONTATORE, { anno, ultimoProgressivo: 0 });
  const progressivo = contatore.anno === anno ? contatore.ultimoProgressivo + 1 : 1;
  return `${String(progressivo).padStart(3, '0')}/${anno}`;
}

export function confermaNumero(numero: string): void {
  const [progressivoStr, annoStr] = numero.split('/');
  const anno = Number(annoStr);
  const progressivo = Number(progressivoStr);
  if (Number.isNaN(anno) || Number.isNaN(progressivo)) return;
  const contatore = leggi<Contatore>(CHIAVE_CONTATORE, { anno, ultimoProgressivo: 0 });
  if (contatore.anno !== anno || progressivo > contatore.ultimoProgressivo) {
    scrivi<Contatore>(CHIAVE_CONTATORE, { anno, ultimoProgressivo: progressivo });
  }
}

export function nuovoPreventivoVuoto(): Preventivo {
  const ora = new Date().toISOString();
  return {
    id: nuovoId(),
    numero: prossimoNumero(),
    data: new Date().toISOString().slice(0, 10),
    validitaGiorni: 30,
    cliente: {
      nome: '',
      indirizzo: '',
      telefono: '',
      email: '',
      codiceFiscalePiva: '',
    },
    oggetto: '',
    luogoLavori: '',
    righe: [
      {
        id: nuovoId(),
        descrizione: '',
        unitaMisura: '',
        quantita: 1,
        prezzoUnitario: 0,
      },
    ],
    scontoPercentuale: 0,
    ivaPercentuale: 22,
    applicaIva: true,
    condizioniPagamento: '',
    note: '',
    stato: 'bozza',
    creatoIl: ora,
    aggiornatoIl: ora,
  };
}

export function caricaDatiAzienda(): DatiAzienda {
  return leggi<DatiAzienda>(CHIAVE_AZIENDA, {
    piva: '',
    codiceFiscale: '',
    rea: '',
    iban: '',
  });
}

export function salvaDatiAzienda(dati: DatiAzienda): void {
  scrivi(CHIAVE_AZIENDA, dati);
}
