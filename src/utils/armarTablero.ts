import type { Carta } from '../types/juego'
import { mezclar } from './mezclar'

export function armarTablero(cantidadParejas: number): Carta[] {
  const lista: Carta[] = []

  for (let i = 0; i < cantidadParejas; i++) {
    const valor = String.fromCharCode(65 + i)
    lista.push({
      id: `${i}-1`,
      grupo: i,
      valor,
      volteada: false,
      encontrada: false,
    })
    lista.push({
      id: `${i}-2`,
      grupo: i,
      valor,
      volteada: false,
      encontrada: false,
    })
  }

  return mezclar(lista)
}

export function tableroCompleto(cartas: Carta[]) {
  return cartas.every((c) => c.encontrada)
}

export function contarParesEncontrados(cartas: Carta[]) {
  return cartas.filter((c) => c.encontrada).length / 2
}
