import Header from './components/Header'
import TodoList from './components/TodoList'
import PomodoroTimer from './components/PomodoroTimer'
import { useTodos } from './hooks/useTodos'
import './index.css'

export default function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, clearCompleted, incompletedCount } =
    useTodos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      <Header incompletedCount={incompletedCount} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
          {/* Todo section — wider */}
          <div className="lg:col-span-3">
            <TodoList
              todos={todos}
              onAdd={addTodo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              onClearCompleted={clearCompleted}
            />
          </div>

          {/* Timer section — sticks to top on scroll */}
          <div className="lg:col-span-2 lg:sticky lg:top-20">
            <PomodoroTimer />
          </div>
        </div>
      </main>
    </div>
  )
}
