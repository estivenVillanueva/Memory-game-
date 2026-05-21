import { useEffect, useRef, useState } from 'react'
import { BarraJuego } from './components/BarraJuego'
import { PantallaGanaste } from './components/PantallaGanaste'
import { PantallaInicio } from './components/PantallaInicio'
import { Tablero } from './components/Tablero'
import { niveles, tiempoFallo, tiempoMemoria } from './data/niveles'
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

function App() {
  const [pantalla, setPantalla] = useState<PantallaApp>('inicio')
  const [indiceNivel, setIndiceNivel] = useState(() => {
    const guardado = leerNivelGuardado()
    if (guardado >= 0 && guardado < niveles.length) return guardado
    return 0
  })
  const [cartas, setCartas] = useState<Carta[]>([])
  const [abiertas, setAbiertas] = useState<string[]>([])
  const [movimientos, setMovimientos] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [memorizando, setMemorizando] = useState(false)
  const [idsConError, setIdsConError] = useState<string[]>([])
  const [mejorAnterior, setMejorAnterior] = useState<MejorMarca | null>(null)
  const [fueNuevoRecord, setFueNuevoRecord] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const nivelActual = niveles[indiceNivel]
  const cronometroActivo = pantalla === 'juego' && !memorizando
  const { segundos, reiniciar: reiniciarCronometro } = useCronometro(cronometroActivo)
  const paresEncontrados = contarParesEncontrados(cartas)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function prepararPartida(indice: number) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setIndiceNivel(indice)
    const tablero = armarTablero(niveles[indice].parejas)

    setCartas(tablero.map((c) => ({ ...c, volteada: true })))
    setAbiertas([])
    setMovimientos(0)
    setIdsConError([])
    setFueNuevoRecord(false)
    setBloqueado(true)
    setMemorizando(true)
    reiniciarCronometro()
    guardarNivelElegido(indice)

    timeoutRef.current = setTimeout(() => {
      setCartas(tablero.map((c) => ({ ...c, volteada: false })))
      setBloqueado(false)
      setMemorizando(false)
      timeoutRef.current = null
    }, tiempoMemoria)
  }

  function iniciarJuego() {
    prepararPartida(indiceNivel)
    setPantalla('juego')
  }

  function reiniciarPartida() {
    prepararPartida(indiceNivel)
  }

  function irAInicio() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setMemorizando(false)
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
    if (pantalla !== 'juego' || bloqueado || memorizando) return

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

    if (carta1.grupo === carta2.grupo) {
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
      }, tiempoFallo)
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
            memorizando={memorizando}
            alReiniciar={reiniciarPartida}
            alCambiarNivel={irAInicio}
          />
          <Tablero
            cartas={cartas}
            columnas={nivelActual.columnas}
            bloqueado={bloqueado || memorizando}
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
