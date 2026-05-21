import { niveles } from '../data/niveles'

type Props = {
  indiceSeleccionado: number
  alCambiarNivel: (indice: number) => void
  alIniciar: () => void
}

export function PantallaInicio({
  indiceSeleccionado,
  alCambiarNivel,
  alIniciar,
}: Props) {
  const nivel = niveles[indiceSeleccionado]

  return (
    <section className="pantalla-inicio">
      <h1>Juego de Memoria</h1>
      <p className="subtitulo">Encuentra todos los pares</p>

      <label className="selector-nivel" htmlFor="nivel">
        Dificultad
      </label>
      <select
        id="nivel"
        value={indiceSeleccionado}
        onChange={(e) => alCambiarNivel(Number(e.target.value))}
      >
        {niveles.map((n, i) => (
          <option key={n.id} value={i}>
            {n.nombre} ({n.columnas}x{n.filas} · {n.parejas} parejas)
          </option>
        ))}
      </select>

      <p className="detalle-nivel">
        Tablero {nivel.columnas}×{nivel.filas} — {nivel.parejas * 2} cartas
      </p>

      <button type="button" className="boton-principal" onClick={alIniciar}>
        Iniciar
      </button>
    </section>
  )
}
