"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "./supabaseClient"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

function TodoApp() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTodo, setNewTodo] = useState("")
  const [filter, setFilter] = useState("all")
  const [darkMode, setDarkMode] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    const fetchTodos = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        navigate("/login")
        return
      }

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("inserted_at", { ascending: false })

      if (!error) setTodos(data || [])
      setLoading(false)
    }

    fetchTodos()
  }, [navigate])

  const handleAddTodo = async (e) => {
    if (e) e.preventDefault()
    if (!newTodo.trim()) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: newTodo, completed: false, user_id: user.id }])
      .select()

    if (!error && data && data[0]) {
      setTodos((prev) => [data[0], ...prev])
      setNewTodo("")
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleToggleComplete = async (id, completed) => {
    const { error } = await supabase.from("todos").update({ completed: !completed }).eq("id", id)

    if (!error) {
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo)))
    }
  }

  const handleDeleteTodo = async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id)
    if (!error) {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode.toString())
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  })

  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.filter((todo) => !todo.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              {activeCount} active • {completedCount} completed
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
              title="Toggle dark mode"
            >
              {darkMode ? <span className="text-2xl">☀️</span> : <span className="text-2xl">🌙</span>}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Add Todo Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <form onSubmit={handleAddTodo} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!newTodo.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Add Task
            </motion.button>
          </form>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-6"
        >
          <span className="text-gray-500 dark:text-gray-400 font-medium mr-2">Filter:</span>
          {["all", "active", "completed"].map((type) => (
            <motion.button
              key={type}
              onClick={() => setFilter(type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 capitalize ${
                filter === type
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {type}
            </motion.button>
          ))}
        </motion.div>

        {/* Todo List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Loading your tasks...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">{filter === "completed" ? "🎉" : filter === "active" ? "📝" : "✨"}</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {filter === "completed"
                  ? "No completed tasks yet"
                  : filter === "active"
                    ? "No active tasks"
                    : "No tasks yet. Add one above!"}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              <AnimatePresence>
                {filteredTodos.map((todo, index) => (
                  <motion.li
                    key={todo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4 p-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleComplete(todo.id, todo.completed)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 text-lg font-bold ${
                          todo.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                        }`}
                      >
                        {todo.completed && "✓"}
                      </motion.button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-lg font-medium transition-all duration-200 ${
                            todo.completed
                              ? "line-through text-gray-500 dark:text-gray-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {todo.title}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>

        {/* Floating Add Button */}
        <motion.button
          onClick={() => inputRef.current?.focus()}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all duration-300 z-50 text-2xl font-bold"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          title="Focus on input"
        >
          +
        </motion.button>
      </div>
    </div>
  )
}

export default TodoApp
