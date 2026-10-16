import type { Preventivo, Riga } from '../types';

export function totaleRiga(riga: Riga): number {
  return riga.quantita * riga.prezzoUnitario;
}

export interface Totali {
  imponibileLordo: number;
  valoreSconto: number;
  imponibileNetto: number;
  valoreIva: number;
  totale: number;
}

export function calcolaTotali(preventivo: Preventivo): Totali {
  const imponibileLordo = preventivo.righe.reduce((somma, riga) => somma + totaleRiga(riga), 0);
  const valoreSconto = imponibileLordo * (preventivo.scontoPercentuale / 100);
  const imponibileNetto = imponibileLordo - valoreSconto;
  const valoreIva = imponibileNetto * (preventivo.ivaPercentuale / 100);
  const totale = preventivo.applicaIva ? imponibileNetto + valoreIva : imponibileNetto;
  return { imponibileLordo, valoreSconto, imponibileNetto, valoreIva, totale };
}

export function formattaValuta(valore: number): string {
  return valore.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
}

export function formattaData(isoData: string): string {
  if (!isoData) return '';
  const [anno, mese, giorno] = isoData.split('-');
  return `${giorno}/${mese}/${anno}`;
}
