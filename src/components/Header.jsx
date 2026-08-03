import { BookOpen, CheckSquare } from 'lucide-react'

export default function Header({ incompletedCount }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-900 leading-tight">Study Flow</h1>
            <p className="text-xs text-blue-400 leading-tight">Todo & Pomodoro Timer</p>
          </div>
        </div>

        {incompletedCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 animate-fadeIn">
            <CheckSquare className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-blue-700">
              {incompletedCount}개 남음
            </span>
          </div>
        )}

        {incompletedCount === 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 animate-fadeIn">
            <CheckSquare className="w-4 h-4 text-green-500" />
            <span className="text-sm font-semibold text-green-700">모두 완료!</span>
          </div>
        )}
      </div>
    </header>
  )
}
