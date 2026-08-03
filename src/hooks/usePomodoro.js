import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const MODES = {
  focus: { label: '집중', minutes: 25, color: 'blue' },
  short: { label: '짧은 휴식', minutes: 5, color: 'green' },
  long: { label: '긴 휴식', minutes: 15, color: 'purple' },
}

export function usePomodoro() {
  const [mode, setMode] = useLocalStorage('pomodoro-mode', 'focus')
  const [customMinutes, setCustomMinutes] = useLocalStorage('pomodoro-custom', {
    focus: 25,
    short: 5,
    long: 15,
  })
  const [sessions, setSessions] = useLocalStorage('pomodoro-sessions', 0)

  const totalSeconds = (customMinutes[mode] || MODES[mode].minutes) * 60
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  // Reset timer when mode or custom minutes change
  useEffect(() => {
    setRunning(false)
    setSecondsLeft(totalSeconds)
  }, [mode, customMinutes])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (mode === 'focus') setSessions(n => n + 1)
            playAlert()
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const playAlert = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
      osc.start()
      osc.stop(ctx.currentTime + 0.8)
    } catch {
      // AudioContext not available
    }
  }

  const toggle = useCallback(() => setRunning(r => !r), [])

  const reset = useCallback(() => {
    setRunning(false)
    setSecondsLeft(totalSeconds)
  }, [totalSeconds])

  const switchMode = useCallback(
    newMode => {
      setMode(newMode)
    },
    [setMode]
  )

  const progress = 1 - secondsLeft / totalSeconds
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return {
    mode,
    MODES,
    customMinutes,
    setCustomMinutes,
    running,
    progress,
    display,
    sessions,
    toggle,
    reset,
    switchMode,
  }
}
