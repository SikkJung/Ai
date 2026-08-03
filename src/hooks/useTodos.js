import { useLocalStorage } from './useLocalStorage'

export function useTodos() {
  const [todos, setTodos] = useLocalStorage('todos', [])

  const genId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }

  const addTodo = ({ text, priority }) => {
    const newTodo = {
      id: genId(),
      text,
      priority,
      completed: false,
      createdAt: Date.now(),
    }
    setTodos(prev => [newTodo, ...prev])
  }

  const updateTodo = (id, changes) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...changes } : t)))
  }

  const deleteTodo = id => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const toggleTodo = id => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  const incompletedCount = todos.filter(t => !t.completed).length

  return { todos, addTodo, updateTodo, deleteTodo, toggleTodo, clearCompleted, incompletedCount }
}
