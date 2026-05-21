export type Carta = {
  id: string
  grupo: number
  valor: string
  volteada: boolean
  encontrada: boolean
}

export type Nivel = {
  id: number
  nombre: string
  parejas: number
  columnas: number
  filas: number
}

export type MejorMarca = {
  movimientos: number
  segundos: number
}

export type PantallaApp = 'inicio' | 'juego' | 'victoria'

export type EstadoPartida = 'jugando' | 'ganaste'
