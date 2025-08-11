import React, { useState, useEffect, useRef, useCallback } from "react";
import { Edit2, Trash2, Plus } from "react-feather";
import "./App.css";

// Accessible unique ID generator for tasks
const generateId = (() => {
  let count = Date.now();
  return () => `todo-${++count}`;
})();

// PUBLIC_INTERFACE
function App() {
  // Task state management
  const [tasks, setTasks] = useState(() => {
    try {
      const tasksJSON = localStorage.getItem("todo-tasks");
      return tasksJSON ? JSON.parse(tasksJSON) : [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);

  // Persist tasks to localStorage
  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Focus management
  useEffect(() => {
    if (editId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editId]);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    return task.completed;
  });

  // Accessibility announcements
  const [status, setStatus] = useState("");
  const announce = useCallback((msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 1000);
  }, []);

  // PUBLIC_INTERFACE
  function handleAddTask(e) {
    e.preventDefault();
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: generateId(), text, completed: false },
      ...prev,
    ]);
    setNewTask("");
    announce("Task added");
  }

  // PUBLIC_INTERFACE
  function handleToggleCompleted(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    announce("Task status updated");
  }

  // PUBLIC_INTERFACE
  function handleDelete(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    announce("Task deleted");
  }

  // PUBLIC_INTERFACE
  function handleEdit(id, text) {
    setEditId(id);
    setEditText(text);
  }

  // PUBLIC_INTERFACE
  function handleEditSave(e) {
    e.preventDefault();
    const text = editText.trim();
    if (!text) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editId ? { ...task, text } : task
      )
    );
    setEditId(null);
    setEditText("");
    announce("Task updated");
  }

  // PUBLIC_INTERFACE
  function handleClearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed));
    announce("Completed tasks cleared");
  }

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1 className="title">Tasks</h1>
          <p className="subtitle">
            {tasks.filter((t) => t.completed).length} of {tasks.length} Complete
          </p>
        </header>

        <form onSubmit={handleAddTask} className="task-input-container">
          <label htmlFor="new-task" className="sr-only">
            Add new task
          </label>
          <input
            id="new-task"
            type="text"
            className="task-input"
            placeholder="Add new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            maxLength={80}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!newTask.trim()}
          >
            Add
          </button>
        </form>

        <nav className="filters">
          <button
            className={`btn-filter${filter === "all" ? " active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn-filter${filter === "active" ? " active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`btn-filter${filter === "completed" ? " active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </nav>

        <ul className="task-list">
          {filteredTasks.length === 0 ? (
            <li className="empty-state">
              {tasks.length === 0
                ? "No tasks yet. Add your first task!"
                : "No tasks match the current filter."}
            </li>
          ) : (
            filteredTasks.map((task) =>
              editId === task.id ? (
                <li key={task.id} className="task-item editing">
                  <form onSubmit={handleEditSave} style={{ display: "flex", gap: 8, width: "100%" }}>
                    <input
                      type="text"
                      className="task-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setEditId(null);
                          setEditText("");
                        }
                      }}
                      maxLength={80}
                    />
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </form>
                </li>
              ) : (
                <li
                  key={task.id}
                  className={`task-item${task.completed ? " completed" : ""}`}
                >
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task.id)}
                    aria-label={`Mark "${task.text}" as ${
                      task.completed ? "incomplete" : "complete"
                    }`}
                  />
                  <span className="task-text">{task.text}</span>
                  <div className="task-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(task.id, task.text)}
                      aria-label={`Edit "${task.text}"`}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDelete(task.id)}
                      aria-label={`Delete "${task.text}"`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              )
            )
          )}
        </ul>

        {tasks.length > 0 && (
          <footer style={{ marginTop: "var(--spacing-5)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              {tasks.filter((t) => !t.completed).length} remaining
            </span>
            <button
              className="btn btn-primary"
              onClick={handleClearCompleted}
              disabled={!tasks.some((t) => t.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {status}
      </div>
    </div>
  );
}

export default App;
