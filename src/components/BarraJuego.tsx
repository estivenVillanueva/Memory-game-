import type { Nivel } from '../types/juego'
import { formatearTiempo } from '../hooks/useCronometro'

type Props = {
  nivel: Nivel
  movimientos: number
  segundos: number
  paresEncontrados: number
  alReiniciar: () => void
  alCambiarNivel: () => void
}

export function BarraJuego({
  nivel,
  movimientos,
  segundos,
  paresEncontrados,
  alReiniciar,
  alCambiarNivel,
}: Props) {
  return (
    <header className="barra">
      <div>
        <h1>{nivel.nombre}</h1>
        <p>
          {nivel.columnas}×{nivel.filas}
        </p>
      </div>

      <ul className="stats">
        <li>
          <span>Movimientos</span>
          <strong>{movimientos}</strong>
        </li>
        <li>
          <span>Tiempo</span>
          <strong>{formatearTiempo(segundos)}</strong>
        </li>
        <li>
          <span>Pares</span>
          <strong>
            {paresEncontrados}/{nivel.parejas}
          </strong>
        </li>
      </ul>

      <div className="barra-botones">
        <button type="button" onClick={alReiniciar}>
          Reiniciar
        </button>
        <button type="button" onClick={alCambiarNivel}>
          Cambiar nivel
        </button>
      </div>
    </header>
  )
}
