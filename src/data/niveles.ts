import type { Nivel } from '../types/juego'

export const niveles: Nivel[] = [
  { id: 1, nombre: 'Fácil', parejas: 8, columnas: 4, filas: 4 },
  { id: 2, nombre: 'Medio', parejas: 12, columnas: 4, filas: 6 },
  { id: 3, nombre: 'Difícil', parejas: 18, columnas: 6, filas: 6 },
]

export const MS_AL_FALLAR = 1000
