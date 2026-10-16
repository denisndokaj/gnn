import { useCallback, useEffect, useState } from 'react';
import type { Preventivo } from '../types';
import { caricaPreventivi, confermaNumero, nuovoPreventivoVuoto, salvaPreventivi } from '../lib/storage';

export function usePreventivi() {
  const [preventivi, setPreventivi] = useState<Preventivo[]>(() => caricaPreventivi());
  const [idCorrente, setIdCorrente] = useState<string | null>(() => preventivi[0]?.id ?? null);

  useEffect(() => {
    salvaPreventivi(preventivi);
  }, [preventivi]);

  const preventivoCorrente = preventivi.find((p) => p.id === idCorrente) ?? null;

  const creaNuovo = useCallback(() => {
    const bozza = nuovoPreventivoVuoto();
    setPreventivi((prev) => [bozza, ...prev]);
    setIdCorrente(bozza.id);
  }, []);

  const aggiorna = useCallback((aggiornato: Preventivo) => {
    confermaNumero(aggiornato.numero);
    setPreventivi((prev) =>
      prev.map((p) => (p.id === aggiornato.id ? { ...aggiornato, aggiornatoIl: new Date().toISOString() } : p)),
    );
  }, []);

  const elimina = useCallback(
    (id: string) => {
      setPreventivi((prev) => prev.filter((p) => p.id !== id));
      if (idCorrente === id) {
        setIdCorrente(null);
      }
    },
    [idCorrente],
  );

  const duplica = useCallback((preventivo: Preventivo) => {
    const ora = new Date().toISOString();
    const copia: Preventivo = {
      ...preventivo,
      id: crypto.randomUUID(),
      numero: preventivo.numero,
      stato: 'bozza',
      creatoIl: ora,
      aggiornatoIl: ora,
    };
    setPreventivi((prev) => [copia, ...prev]);
    setIdCorrente(copia.id);
  }, []);

  return {
    preventivi,
    preventivoCorrente,
    idCorrente,
    setIdCorrente,
    creaNuovo,
    aggiorna,
    elimina,
    duplica,
  };
}
