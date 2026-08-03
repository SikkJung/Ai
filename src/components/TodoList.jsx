import { useState } from 'react'
import { ClipboardList, Trash2 } from 'lucide-react'
import TodoForm from './TodoForm'
import TodoItem from './TodoItem'
import SearchBar from './SearchBar'

const FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '미완료' },
  { value: 'completed', label: '완료' },
]

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

export default function TodoList({ todos, onAdd, onToggle, onDelete, onUpdate, onClearCompleted }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortByPriority, setSortByPriority] = useState(false)

  const filtered = todos
    .filter(t => {
      if (filter === 'active') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
    .filter(t => t.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortByPriority) return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      return b.createdAt - a.createdAt
    })

  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
      {/* Card header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <ClipboardList className="w-5 h-5" />
            <h2 className="font-semibold">할 일 목록</h2>
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {todos.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortByPriority(v => !v)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                sortByPriority
                  ? 'bg-white text-blue-600 shadow'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              우선순위 정렬
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Add form */}
        <TodoForm onAdd={onAdd} />

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filter === opt.value
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-2 min-h-[120px]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 animate-fadeIn">
              <ClipboardList className="w-10 h-10 mb-2 text-blue-200" />
              <p className="text-sm">
                {search ? '검색 결과가 없습니다.' : '할 일이 없습니다. 추가해보세요!'}
              </p>
            </div>
          ) : (
            filtered.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {completedCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 animate-fadeIn">
            <span className="text-xs text-gray-400">{completedCount}개 완료됨</span>
            <button
              onClick={onClearCompleted}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              완료 항목 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
