import type { Carta as CartaType } from '../types/juego'
import { Carta } from './Carta'

type Props = {
  cartas: CartaType[]
  columnas: number
  bloqueado: boolean
  idsConError: string[]
  alClickCarta: (id: string) => void
}

export function Tablero({
  cartas,
  columnas,
  bloqueado,
  idsConError,
  alClickCarta,
}: Props) {
  return (
    <div className="mesa">
      <div
        className={`tablero tablero-${columnas}cols`}
        style={{ gridTemplateColumns: `repeat(${columnas}, 1fr)` }}
      >
        {cartas.map((carta) => (
          <Carta
            key={carta.id}
            carta={carta}
            bloqueado={bloqueado}
            tieneError={idsConError.includes(carta.id)}
            alClick={alClickCarta}
          />
        ))}
      </div>
    </div>
  )
}
