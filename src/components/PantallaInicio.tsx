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
  return (
    <section className="pantalla-inicio">
      <h1>Memoria</h1>
      <p className="subtitulo">Voltea las cartas y encuentra los pares</p>

      <p className="elegir-texto">Elige la dificultad</p>
      <div className="lista-niveles">
        {niveles.map((nivel, i) => (
          <button
            key={nivel.id}
            type="button"
            className={
              i === indiceSeleccionado
                ? 'opcion-nivel opcion-nivel--activa'
                : 'opcion-nivel'
            }
            onClick={() => alCambiarNivel(i)}
          >
            <span className="opcion-nombre">{nivel.nombre}</span>
            <span className="opcion-tablero">
              {nivel.columnas}×{nivel.filas}
            </span>
            <span className="opcion-parejas">{nivel.parejas} parejas</span>
          </button>
        ))}
      </div>

      <button type="button" className="boton-principal" onClick={alIniciar}>
        Empezar
      </button>
    </section>
  )
}
