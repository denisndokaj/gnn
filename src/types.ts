export interface Riga {
  id: string;
  descrizione: string;
  unitaMisura: string;
  quantita: number;
  prezzoUnitario: number;
}

export interface Cliente {
  nome: string;
  indirizzo: string;
  telefono: string;
  email: string;
  codiceFiscalePiva: string;
}

export type StatoPreventivo = 'bozza' | 'inviato' | 'accettato' | 'rifiutato';

export interface Preventivo {
  id: string;
  numero: string;
  data: string;
  validitaGiorni: number;
  cliente: Cliente;
  oggetto: string;
  luogoLavori: string;
  righe: Riga[];
  scontoPercentuale: number;
  ivaPercentuale: number;
  applicaIva: boolean;
  condizioniPagamento: string;
  note: string;
  stato: StatoPreventivo;
  creatoIl: string;
  aggiornatoIl: string;
}

export interface DatiAzienda {
  piva: string;
  codiceFiscale: string;
  rea: string;
  iban: string;
}
