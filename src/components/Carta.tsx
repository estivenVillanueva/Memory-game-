import type { Carta as CartaType } from '../types/juego'

type Props = {
  carta: CartaType
  bloqueado: boolean
  tieneError: boolean
  alClick: (id: string) => void
}

export function Carta({ carta, bloqueado, tieneError, alClick }: Props) {
  const seVe = carta.volteada || carta.encontrada
  const colorGrupo = carta.grupo % 8

  let clases = 'carta'
  if (seVe) clases += ' carta-volteada'
  if (carta.encontrada) clases += ' carta-ok'
  if (tieneError) clases += ' carta-mal'

  return (
    <button
      type="button"
      className={clases}
      data-color={colorGrupo}
      disabled={bloqueado || carta.encontrada || carta.volteada}
      onClick={() => alClick(carta.id)}
    >
      <span className="carta-dorso" aria-hidden="true" />
      <span className="carta-frente">{carta.valor}</span>
    </button>
  )
}
