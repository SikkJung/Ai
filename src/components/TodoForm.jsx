import { useState } from 'react'
import { Plus, Flag } from 'lucide-react'

const PRIORITIES = [
  { value: 'high', label: '높음', color: 'text-red-500', bg: 'bg-red-50 border-red-200 text-red-600' },
  { value: 'medium', label: '중간', color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200 text-yellow-600' },
  { value: 'low', label: '낮음', color: 'text-blue-400', bg: 'bg-blue-50 border-blue-200 text-blue-600' },
]

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')

  const handleAdd = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd({ text: trimmed, priority })
    setText('')
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4 animate-scaleIn">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="할 일을 입력하세요..."
            className="w-full pl-4 pr-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700 placeholder-gray-400 bg-blue-50/50 transition-all"
            maxLength={120}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2">
            <Flag className="w-4 h-4 text-gray-400 shrink-0" />
            {PRIORITIES.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  priority === p.value
                    ? `border ${p.bg} shadow-sm`
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!text.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-200 active:scale-95 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">추가</span>
          </button>
        </div>
      </div>
    </div>
  )
}
