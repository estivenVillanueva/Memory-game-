import type { Carta } from '../types/juego'

export function sonMismoPar(carta1: Carta, carta2: Carta) {
  return carta1.grupo === carta2.grupo
}
