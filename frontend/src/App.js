import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// Accessible unique ID generator for tasks
const generateId = (() => {
  let count = Date.now();
  return () => `todo-${++count}`;
})();

// PUBLIC_INTERFACE
function App() {


  // Task state hooks
  const [tasks, setTasks] = useState(() => {
    try {
      const tasksJSON = localStorage.getItem("todo-tasks");
      return tasksJSON ? JSON.parse(tasksJSON) : [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Keyboard focus management for accessibility
  useEffect(() => {
    if (editId && inputRef.current) inputRef.current.focus();
  }, [editId]);

  // Filter helpers
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    return task.completed;
  });

  // Accessible live region for task updates (status messages)
  const [status, setStatus] = useState("");
  const announce = useCallback((msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 1000);
  }, []);

  // CRUD operations
  // PUBLIC_INTERFACE
  function handleAddTask(e) {
    e.preventDefault();
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [
      ...prev,
      { id: generateId(), text, completed: false },
    ]);
    setNewTask("");
    announce("Task added.");
  }

  // PUBLIC_INTERFACE
  function handleDelete(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    announce("Task deleted.");
  }

  // PUBLIC_INTERFACE
  function handleToggleCompleted(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    announce("Task status changed.");
  }

  // PUBLIC_INTERFACE
  function startEdit(id, text) {
    setEditId(id);
    setEditText(text);
  }

  // PUBLIC_INTERFACE
  function handleEditSave(e) {
    e.preventDefault();
    setTasks((prev) =>
      prev.map((task) =>
        task.id === editId ? { ...task, text: editText.trim() } : task
      )
    );
    setEditId(null);
    setEditText("");
    announce("Task updated.");
  }

  // PUBLIC_INTERFACE
  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed));
    announce("Completed tasks cleared.");
  }

  // Accessibility: Keyboard navigation handlers
  const handleKeyDownItem = (e, idx) => {
    if (!listRef.current) return;
    if (e.key === "ArrowUp" && idx > 0) {
      listRef.current
        .querySelectorAll('li[tabindex="0"]')
        [idx - 1].focus();
      e.preventDefault();
    }
    if (
      (e.key === "ArrowDown" || e.key === "Tab") &&
      idx < filteredTasks.length - 1
    ) {
      listRef.current
        .querySelectorAll('li[tabindex="0"]')
        [idx + 1].focus();
      e.preventDefault();
    }
  };

  // Responsive headline size
  const isMobile = window.innerWidth < 640;

  return (
    <div className="App">
      <header className="App-header" role="banner">

        <h1 tabIndex="-1" className="title" aria-label="Todo App">
          {isMobile ? "Todo" : "React Todo App"}
        </h1>
        <div className="container" style={{ maxWidth: 440, margin: "0 auto" }}>
          <form
            onSubmit={handleAddTask}
            aria-label="Add new todo"
            style={{ display: "flex", marginBottom: 20, gap: 8 }}
          >
            <label htmlFor="new-todo" className="sr-only">
              New task
            </label>
            <input
              id="new-todo"
              autoComplete="off"
              ref={inputRef}
              type="text"
              className="todo-input"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              aria-label="Add a new todo"
              maxLength={80}
              required
              onKeyDown={(e) => {
                if (e.key === "Escape") setNewTask("");
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              aria-label="Add task"
              disabled={!newTask.trim()}
            >
              Add
            </button>
          </form>
          <nav
            aria-label="Todo filters"
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              margin: "0 0 14px",
            }}
          >
            <button
              className={`btn-filter${filter === "all" ? " active" : ""}`}
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
            >
              All
            </button>
            <button
              className={`btn-filter${filter === "active" ? " active" : ""}`}
              onClick={() => setFilter("active")}
              aria-pressed={filter === "active"}
            >
              Active
            </button>
            <button
              className={`btn-filter${filter === "completed" ? " active" : ""}`}
              onClick={() => setFilter("completed")}
              aria-pressed={filter === "completed"}
            >
              Completed
            </button>
          </nav>
          <ul
            ref={listRef}
            className="todo-list"
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              minHeight: 90,
            }}
            aria-live="polite"
          >
            {filteredTasks.length === 0 && (
              <li className="todo-empty" tabIndex="-1">
                <span>
                  {tasks.length === 0
                    ? "No todos yet! Add your first one."
                    : "No todos matching the selected filter."}
                </span>
              </li>
            )}
            {filteredTasks.map((task, idx) =>
              editId === task.id ? (
                <li key={task.id} className="todo-item editing" tabIndex="0">
                  <form
                    onSubmit={handleEditSave}
                    style={{ display: "flex", gap: 8 }}
                    aria-label="Edit todo"
                  >
                    <label htmlFor={`edit-todo-${task.id}`} className="sr-only">
                      Edit task
                    </label>
                    <input
                      id={`edit-todo-${task.id}`}
                      ref={inputRef}
                      type="text"
                      className="todo-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      maxLength={80}
                      required
                      aria-label="Edit todo"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setEditId(null);
                          setEditText("");
                        }
                      }}
                    />
                    <button
                      className="btn-small btn-primary"
                      type="submit"
                      aria-label="Save edit"
                    >
                      Save
                    </button>
                    <button
                      className="btn-small btn-secondary"
                      type="button"
                      onClick={() => {
                        setEditId(null);
                        setEditText("");
                      }}
                      aria-label="Cancel edit"
                    >
                      Cancel
                    </button>
                  </form>
                </li>
              ) : (
                <li
                  id={task.id}
                  role="listitem"
                  key={task.id}
                  className={
                    "todo-item" +
                    (task.completed ? " completed" : "") +
                    (editId === task.id ? " editing" : "")
                  }
                  tabIndex="0"
                  aria-checked={task.completed}
                  aria-label={task.text}
                  onKeyDown={(e) => handleKeyDownItem(e, idx)}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task.id)}
                    tabIndex={-1}
                    aria-label="Mark as completed"
                    className="todo-checkbox"
                  />
                  <span
                    className="todo-text"
                    style={{
                      textDecoration: task.completed ? "line-through" : "",
                    }}
                  >
                    {task.text}
                  </span>
                  <span className="todo-actions">
                    <button
                      className="btn-icon"
                      aria-label="Edit todo"
                      onClick={() => startEdit(task.id, task.text)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      aria-label="Delete todo"
                      onClick={() => handleDelete(task.id)}
                    >
                      🗑️
                    </button>
                  </span>
                </li>
              )
            )}
          </ul>
          <footer
            className="todo-footer"
            style={{
              marginTop: 20,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              color: "var(--text-primary)",
              fontSize: 14,
            }}
          >
            <span>
              {tasks.filter((t) => !t.completed).length} item
              {tasks.filter((t) => !t.completed).length !== 1 && "s"} left
            </span>
            <button
              onClick={clearCompleted}
              className="btn-footer"
              disabled={tasks.every((t) => !t.completed)}
              aria-label="Clear completed tasks"
            >
              Clear Completed
            </button>
          </footer>
        </div>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          style={{ position: "absolute", left: "-10000px", top: "auto" }}
        >
          {status}
        </div>
      </header>
    </div>
  );
}

export default App;
