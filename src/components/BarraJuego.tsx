import type { Nivel } from '../types/juego'
import { formatearTiempo } from '../hooks/useCronometro'

type Props = {
  nivel: Nivel
  movimientos: number
  segundos: number
  paresEncontrados: number
  memorizando: boolean
  alReiniciar: () => void
  alCambiarNivel: () => void
}

export function BarraJuego({
  nivel,
  movimientos,
  segundos,
  paresEncontrados,
  memorizando,
  alReiniciar,
  alCambiarNivel,
}: Props) {
  return (
    <header className="barra">
      <div className="barra-titulo">
        <h1>{nivel.nombre}</h1>
        <p>
          {memorizando
            ? 'Memoriza las cartas...'
            : `Tablero ${nivel.columnas}×${nivel.filas}`}
        </p>
      </div>

      <div className="hud">
        <div className="hud-item">
          <span className="hud-etiqueta">Tiempo</span>
          <strong className="hud-tiempo">{formatearTiempo(segundos)}</strong>
        </div>
        <div className="hud-item">
          <span className="hud-etiqueta">Movimientos</span>
          <strong>{movimientos}</strong>
        </div>
        <div className="hud-item">
          <span className="hud-etiqueta">Pares</span>
          <strong>
            {paresEncontrados}/{nivel.parejas}
          </strong>
        </div>
      </div>

      <div className="barra-botones">
        <button type="button" className="boton-secundario" onClick={alReiniciar}>
          Reiniciar
        </button>
        <button type="button" className="boton-secundario" onClick={alCambiarNivel}>
          Cambiar nivel
        </button>
      </div>
    </header>
  )
}
