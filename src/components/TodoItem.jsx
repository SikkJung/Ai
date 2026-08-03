import { useState, useRef, useEffect } from 'react'
import { Trash2, Pencil, Check, X, Flag } from 'lucide-react'

const PRIORITY_STYLES = {
  high: {
    badge: 'bg-red-100 text-red-600 border border-red-200',
    dot: 'bg-red-500',
    label: '높음',
    border: 'border-l-red-400',
  },
  medium: {
    badge: 'bg-yellow-100 text-yellow-600 border border-yellow-200',
    dot: 'bg-yellow-400',
    label: '중간',
    border: 'border-l-yellow-400',
  },
  low: {
    badge: 'bg-blue-100 text-blue-600 border border-blue-200',
    dot: 'bg-blue-400',
    label: '낮음',
    border: 'border-l-blue-400',
  },
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [removing, setRemoving] = useState(false)
  const inputRef = useRef(null)

  const style = PRIORITY_STYLES[todo.priority] || PRIORITY_STYLES.medium

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const handleDelete = () => {
    setRemoving(true)
    setTimeout(() => onDelete(todo.id), 200)
  }

  const saveEdit = () => {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== todo.text) {
      onUpdate(todo.id, { text: trimmed })
    }
    setEditing(false)
  }

  const cancelEdit = () => {
    setEditText(todo.text)
    setEditing(false)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  return (
    <div
      className={`group bg-white rounded-xl border-l-4 ${style.border} shadow-sm border border-blue-50 p-4
        flex items-start gap-3 transition-all hover:shadow-md hover:border-blue-100
        ${removing ? 'animate-slideOut' : 'animate-slideIn'}
        ${todo.completed ? 'opacity-60' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
          ${todo.completed
            ? 'bg-blue-500 border-blue-500 scale-110'
            : 'border-gray-300 hover:border-blue-400 hover:scale-110'
          }`}
      >
        {todo.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-0.5 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm"
            maxLength={120}
          />
        ) : (
          <p
            className={`text-sm text-gray-700 leading-relaxed break-words
              ${todo.completed ? 'line-through text-gray-400' : ''}`}
          >
            {todo.text}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {style.label}
          </span>
          <span className="text-xs text-gray-300">
            {new Date(todo.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className={`flex items-center gap-1 shrink-0 transition-opacity ${editing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {editing ? (
          <>
            <button
              onClick={saveEdit}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
