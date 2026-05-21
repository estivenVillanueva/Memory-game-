import type { Carta } from '../types/juego'

export function mezclar(cartas: Carta[]): Carta[] {
  const copia = [...cartas]
  return copia.sort(() => Math.random() - 0.5)
}
