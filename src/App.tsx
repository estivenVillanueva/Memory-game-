import { useEffect, useState } from 'react'
import { BarraJuego } from './components/BarraJuego'
import { PantallaGanaste } from './components/PantallaGanaste'
import { PantallaInicio } from './components/PantallaInicio'
import { Tablero } from './components/Tablero'
import { MS_AL_FALLAR, niveles } from './data/niveles'
import { useCronometro } from './hooks/useCronometro'
import type { Carta, MejorMarca, PantallaApp } from './types/juego'
import {
  armarTablero,
  contarParesEncontrados,
  tableroCompleto,
} from './utils/armarTablero'
import {
  guardarMejorSiAplica,
  guardarNivelElegido,
  leerMejorMarca,
  leerNivelGuardado,
} from './utils/puntuacionLocal'
import { sonMismoPar } from './utils/verificarPar'

function App() {
  const [pantalla, setPantalla] = useState<PantallaApp>('inicio')
  const [indiceNivel, setIndiceNivel] = useState(() => leerNivelGuardado())
  const [cartas, setCartas] = useState<Carta[]>([])
  const [abiertas, setAbiertas] = useState<string[]>([])
  const [movimientos, setMovimientos] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [idsConError, setIdsConError] = useState<string[]>([])
  const [mejorAnterior, setMejorAnterior] = useState<MejorMarca | null>(null)
  const [fueNuevoRecord, setFueNuevoRecord] = useState(false)

  const nivelActual = niveles[indiceNivel]
  const cronometroActivo = pantalla === 'juego'
  const { segundos, reiniciar: reiniciarCronometro } = useCronometro(cronometroActivo)
  const paresEncontrados = contarParesEncontrados(cartas)

  useEffect(() => {
    const guardado = leerNivelGuardado()
    if (guardado >= 0 && guardado < niveles.length) {
      setIndiceNivel(guardado)
    }
  }, [])

  function prepararPartida(indice: number) {
    setIndiceNivel(indice)
    setCartas(armarTablero(niveles[indice].parejas))
    setAbiertas([])
    setMovimientos(0)
    setBloqueado(false)
    setIdsConError([])
    setFueNuevoRecord(false)
    reiniciarCronometro()
    guardarNivelElegido(indice)
  }

  function iniciarJuego() {
    prepararPartida(indiceNivel)
    setPantalla('juego')
  }

  function reiniciarPartida() {
    prepararPartida(indiceNivel)
  }

  function irAInicio() {
    setPantalla('inicio')
  }

  function terminarVictoria(movs: number, seg: number) {
    const anterior = leerMejorMarca(nivelActual.id)
    setMejorAnterior(anterior)

    const nuevo = guardarMejorSiAplica(nivelActual.id, movs, seg)
    setFueNuevoRecord(nuevo !== null)
    setPantalla('victoria')
  }

  function alClickCarta(id: string) {
    if (pantalla !== 'juego' || bloqueado) return

    const carta = cartas.find((c) => c.id === id)
    if (!carta || carta.encontrada || carta.volteada) return

    const nuevasCartas = cartas.map((c) => {
      if (c.id === id) return { ...c, volteada: true }
      return c
    })
    setCartas(nuevasCartas)

    const idsAbiertos = [...abiertas, id]

    if (idsAbiertos.length === 1) {
      setAbiertas(idsAbiertos)
      return
    }

    setMovimientos((m) => m + 1)
    setAbiertas([])

    const carta1 = nuevasCartas.find((c) => c.id === idsAbiertos[0])
    const carta2 = nuevasCartas.find((c) => c.id === idsAbiertos[1])
    if (!carta1 || !carta2) return

    if (sonMismoPar(carta1, carta2)) {
      const conPar = nuevasCartas.map((c) => {
        if (c.grupo === carta1.grupo) {
          return { ...c, encontrada: true, volteada: true }
        }
        return c
      })
      setCartas(conPar)

      if (tableroCompleto(conPar)) {
        const movsFinal = movimientos + 1
        terminarVictoria(movsFinal, segundos)
      }
    } else {
      setIdsConError([carta1.id, carta2.id])
      setBloqueado(true)

      setTimeout(() => {
        setCartas((lista) =>
          lista.map((c) => {
            if (c.id === carta1.id || c.id === carta2.id) {
              return { ...c, volteada: false }
            }
            return c
          }),
        )
        setIdsConError([])
        setBloqueado(false)
      }, MS_AL_FALLAR)
    }
  }

  return (
    <main className="contenedor">
      {pantalla === 'inicio' && (
        <PantallaInicio
          indiceSeleccionado={indiceNivel}
          alCambiarNivel={(i) => {
            setIndiceNivel(i)
            guardarNivelElegido(i)
          }}
          alIniciar={iniciarJuego}
        />
      )}

      {pantalla === 'juego' && (
        <>
          <BarraJuego
            nivel={nivelActual}
            movimientos={movimientos}
            segundos={segundos}
            paresEncontrados={paresEncontrados}
            alReiniciar={reiniciarPartida}
            alCambiarNivel={irAInicio}
          />
          <Tablero
            cartas={cartas}
            columnas={nivelActual.columnas}
            bloqueado={bloqueado}
            idsConError={idsConError}
            alClickCarta={alClickCarta}
          />
        </>
      )}

      {pantalla === 'victoria' && (
        <PantallaGanaste
          nivel={nivelActual}
          movimientos={movimientos}
          segundos={segundos}
          paresEncontrados={paresEncontrados}
          mejorAnterior={mejorAnterior}
          fueNuevoRecord={fueNuevoRecord}
          alJugarDeNuevo={() => {
            prepararPartida(indiceNivel)
            setPantalla('juego')
          }}
          alInicio={irAInicio}
        />
      )}
    </main>
  )
}

export default App
