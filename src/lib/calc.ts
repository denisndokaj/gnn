import type { Preventivo, Riga } from '../types';

export function rigaHaContenuto(riga: Riga): boolean {
  return riga.descrizione.trim() !== '' || riga.prezzoUnitario > 0 || riga.totaleManuale !== null;
}

export function totaleRiga(riga: Riga): number | null {
  if (riga.quantita !== null) return riga.quantita * riga.prezzoUnitario;
  return riga.totaleManuale;
}

export interface Totali {
  imponibileLordo: number;
  valoreSconto: number;
  imponibileNetto: number;
  valoreIva: number;
  totale: number;
  inSospeso: boolean;
  righeSospese: number;
}

export function calcolaTotali(preventivo: Preventivo): Totali {
  const righeSospese = preventivo.righe.filter((r) => rigaHaContenuto(r) && totaleRiga(r) === null).length;
  const imponibileLordo = preventivo.righe.reduce((somma, riga) => somma + (totaleRiga(riga) ?? 0), 0);
  const valoreSconto = imponibileLordo * (preventivo.scontoPercentuale / 100);
  const imponibileNetto = imponibileLordo - valoreSconto;
  const valoreIva = imponibileNetto * (preventivo.ivaPercentuale / 100);
  const totale = preventivo.applicaIva ? imponibileNetto + valoreIva : imponibileNetto;
  return {
    imponibileLordo,
    valoreSconto,
    imponibileNetto,
    valoreIva,
    totale,
    inSospeso: righeSospese > 0,
    righeSospese,
  };
}

export interface TotaleFinale {
  valore: number;
  inSospeso: boolean;
  manuale: boolean;
}

export function totaleFinaleEffettivo(preventivo: Preventivo, totali: Totali): TotaleFinale {
  if (preventivo.totaleManuale !== null) {
    return { valore: preventivo.totaleManuale, inSospeso: false, manuale: true };
  }
  return { valore: totali.totale, inSospeso: totali.inSospeso, manuale: false };
}

export function formattaValuta(valore: number): string {
  return valore.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
}

export function formattaData(isoData: string): string {
  if (!isoData) return '';
  const [anno, mese, giorno] = isoData.split('-');
  return `${giorno}/${mese}/${anno}`;
}
