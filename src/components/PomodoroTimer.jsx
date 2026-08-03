import { Play, Pause, RotateCcw, Clock, Settings, X, Trophy } from 'lucide-react'
import { useState } from 'react'
import { usePomodoro } from '../hooks/usePomodoro'

const MODE_STYLES = {
  focus: {
    gradient: 'from-blue-600 to-blue-700',
    ring: '#3b82f6',
    ringBg: '#dbeafe',
    badge: 'bg-blue-100 text-blue-700',
    btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
    label: '🎯 집중 시간',
  },
  short: {
    gradient: 'from-emerald-500 to-emerald-600',
    ring: '#10b981',
    ringBg: '#d1fae5',
    badge: 'bg-emerald-100 text-emerald-700',
    btn: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200',
    label: '☕ 짧은 휴식',
  },
  long: {
    gradient: 'from-violet-500 to-violet-600',
    ring: '#8b5cf6',
    ringBg: '#ede9fe',
    badge: 'bg-violet-100 text-violet-700',
    btn: 'bg-violet-500 hover:bg-violet-600 shadow-violet-200',
    label: '🌿 긴 휴식',
  },
}

const SIZE = 200
const STROKE = 10
const R = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * R

export default function PomodoroTimer() {
  const {
    mode, MODES, customMinutes, setCustomMinutes,
    running, progress, display, sessions,
    toggle, reset, switchMode,
  } = usePomodoro()

  const [showSettings, setShowSettings] = useState(false)
  const [draftMinutes, setDraftMinutes] = useState({ ...customMinutes })

  const style = MODE_STYLES[mode]
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  const applySettings = () => {
    setCustomMinutes(draftMinutes)
    setShowSettings(false)
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${style.gradient} px-5 py-4`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <h2 className="font-semibold">포모도로 타이머</h2>
          </div>
          <div className="flex items-center gap-2">
            {sessions > 0 && (
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1">
                <Trophy className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{sessions}</span>
              </div>
            )}
            <button
              onClick={() => setShowSettings(v => !v)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
            >
              {showSettings ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Mode tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {Object.entries(MODES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                mode === key
                  ? `${style.badge} shadow-sm`
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 animate-scaleIn border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">시간 설정 (분)</p>
            {Object.entries(MODES).map(([key, val]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-20">{val.label}</span>
                <input
                  type="range"
                  min={1}
                  max={60}
                  value={draftMinutes[key]}
                  onChange={e =>
                    setDraftMinutes(prev => ({ ...prev, [key]: Number(e.target.value) }))
                  }
                  className="flex-1 h-2 bg-gray-200 rounded-full accent-blue-500"
                />
                <span className="text-sm font-bold text-blue-600 w-8 text-right">
                  {draftMinutes[key]}분
                </span>
              </div>
            ))}
            <button
              onClick={applySettings}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              적용
            </button>
          </div>
        )}

        {/* Circular timer */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            {/* Background ring */}
            <svg width={SIZE} height={SIZE} className="absolute inset-0">
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={style.ringBg}
                strokeWidth={STROKE}
              />
            </svg>
            {/* Progress ring */}
            <svg width={SIZE} height={SIZE} className="absolute inset-0 ring-progress" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={style.ring}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            {/* Center display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800 tabular-nums tracking-tight">
                {display}
              </span>
              <span className={`text-xs font-medium mt-1 px-2.5 py-0.5 rounded-full ${style.badge}`}>
                {style.label}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={reset}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={toggle}
              className={`flex items-center gap-2 ${style.btn} text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:scale-105 active:scale-95`}
            >
              {running ? (
                <>
                  <Pause className="w-5 h-5" />
                  일시정지
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  시작
                </>
              )}
            </button>
          </div>
        </div>

        {/* Session indicator dots */}
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: Math.max(4, sessions % 4 === 0 && sessions > 0 ? 4 : 4) }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < sessions % 4 || (sessions % 4 === 0 && sessions > 0 && i < 4)
                  ? 'bg-blue-500 scale-110'
                  : 'bg-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">= 긴 휴식</span>
        </div>

        {sessions > 0 && (
          <div className="text-center animate-fadeIn">
            <p className="text-xs text-gray-400">
              총 <strong className="text-blue-600">{sessions}</strong>번 집중 완료
              {sessions >= 4 && ` · ${Math.floor(sessions / 4)}회 세트 달성!`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
