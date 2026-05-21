import { useEffect, useState } from 'react'

export function useCronometro(activo: boolean) {
  const [segundos, setSegundos] = useState(0)

  useEffect(() => {
    if (!activo) return

    const intervalo = setInterval(() => {
      setSegundos((s) => s + 1)
    }, 1000)

    return () => clearInterval(intervalo)
  }, [activo])

  function reiniciar() {
    setSegundos(0)
  }

  return { segundos, reiniciar }
}

export function formatearTiempo(totalSegundos: number) {
  const min = Math.floor(totalSegundos / 60)
  const seg = totalSegundos % 60
  const minTxt = min < 10 ? `0${min}` : min
  const segTxt = seg < 10 ? `0${seg}` : seg
  return `${minTxt}:${segTxt}`
}
