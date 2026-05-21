import type { MejorMarca, Nivel } from '../types/juego'
import { formatearTiempo } from '../hooks/useCronometro'

type Props = {
  nivel: Nivel
  movimientos: number
  segundos: number
  paresEncontrados: number
  mejorAnterior: MejorMarca | null
  fueNuevoRecord: boolean
  alJugarDeNuevo: () => void
  alInicio: () => void
}

export function PantallaGanaste({
  nivel,
  movimientos,
  segundos,
  paresEncontrados,
  mejorAnterior,
  fueNuevoRecord,
  alJugarDeNuevo,
  alInicio,
}: Props) {
  return (
    <div className="pantalla-ganaste">
      <div className="caja-mensaje">
        <h2>¡Ganaste!</h2>
        <p className="nivel-ganado">Nivel {nivel.nombre}</p>

        <ul className="resumen-final">
          <li>Movimientos: {movimientos}</li>
          <li>Tiempo: {formatearTiempo(segundos)}</li>
          <li>Pares encontrados: {paresEncontrados}</li>
        </ul>

        {fueNuevoRecord && <p className="record-nuevo">¡Nuevo récord en este nivel!</p>}

        {mejorAnterior && !fueNuevoRecord && (
          <p className="record-viejo">
            Tu mejor marca aquí: {mejorAnterior.movimientos} movs en{' '}
            {formatearTiempo(mejorAnterior.segundos)}
          </p>
        )}

        {!mejorAnterior && !fueNuevoRecord && (
          <p className="record-viejo">Primera vez que completas este nivel.</p>
        )}

        <button type="button" className="boton-principal" onClick={alJugarDeNuevo}>
          Jugar de nuevo
        </button>
        <button type="button" className="boton-secundario" onClick={alInicio}>
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
