import type { MejorMarca } from '../types/juego'

const CLAVE_NIVEL = 'memoria-nivel-elegido'
const CLAVE_RECORDS = 'memoria-mejores'

type Records = Record<string, MejorMarca>

function leerRecords(): Records {
  try {
    const raw = localStorage.getItem(CLAVE_RECORDS)
    if (!raw) return {}
    return JSON.parse(raw) as Records
  } catch {
    return {}
  }
}

export function leerNivelGuardado(): number {
  const valor = localStorage.getItem(CLAVE_NIVEL)
  if (!valor) return 0
  const n = Number(valor)
  return Number.isNaN(n) ? 0 : n
}

export function guardarNivelElegido(indice: number) {
  localStorage.setItem(CLAVE_NIVEL, String(indice))
}

export function leerMejorMarca(nivelId: number): MejorMarca | null {
  const records = leerRecords()
  return records[String(nivelId)] ?? null
}

function esMejorNueva(marcaVieja: MejorMarca, movs: number, seg: number) {
  if (movs < marcaVieja.movimientos) return true
  if (movs === marcaVieja.movimientos && seg < marcaVieja.segundos) return true
  return false
}

export function guardarMejorSiAplica(
  nivelId: number,
  movimientos: number,
  segundos: number,
): MejorMarca | null {
  const records = leerRecords()
  const anterior = records[String(nivelId)]

  if (!anterior) {
    const nueva = { movimientos, segundos }
    records[String(nivelId)] = nueva
    localStorage.setItem(CLAVE_RECORDS, JSON.stringify(records))
    return nueva
  }

  if (esMejorNueva(anterior, movimientos, segundos)) {
    const nueva = { movimientos, segundos }
    records[String(nivelId)] = nueva
    localStorage.setItem(CLAVE_RECORDS, JSON.stringify(records))
    return nueva
  }

  return null
}
