import React, { useEffect, useMemo, useState, useCallback } from "react";
import styles from "./Todo.module.css";

/**
 * Utility: Generate a simple unique id for tasks.
 */
const generateId = (() => {
  let seed = Date.now();
  return () => `task-${++seed}`;
})();

const LS_KEY = "todo-tasks";

/**
 * Convert storage payload to internal model.
 * Ensures expected shape and adds ids if missing.
 */
function normalizeTasks(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((t) => {
      if (!t || typeof t !== "object") return null;
      return {
        id: t.id || generateId(),
        text: typeof t.text === "string" ? t.text : "",
        completed: Boolean(t.completed),
      };
    })
    .filter(Boolean);
}

/**
 * Default tasks matching the Figma template content.
 */
const DEFAULT_TASKS = [
  { id: generateId(), text: "Implement Figma design", completed: false },
  { id: generateId(), text: "Add SVG icons", completed: true },
  { id: generateId(), text: "Test the UI", completed: false },
];

// PUBLIC_INTERFACE
export default function TodoScreen() {
  /** Accessible live region status text */
  const [status, setStatus] = useState("");

  /** Local tasks state with LocalStorage persistence */
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return DEFAULT_TASKS;
      const parsed = JSON.parse(raw);
      const normalized = normalizeTasks(parsed);
      return normalized.length ? normalized : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(tasks));
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  }, [tasks]);

  /** Computed progress text "X of Y completed" */
  const progressText = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return `${completed} of ${total} completed`;
  }, [tasks]);

  /** Announce changes to screen readers */
  const announce = useCallback((message) => {
    setStatus(message);
    // Clear message after a short delay to avoid verbose output
    const timer = setTimeout(() => setStatus(""), 600);
    return () => clearTimeout(timer);
  }, []);

  // PUBLIC_INTERFACE
  /** Toggle completion state of a task by id. */
  const toggleCompleted = useCallback(
    (id) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      announce("Task status updated");
    },
    [announce]
  );

  // PUBLIC_INTERFACE
  /** Add a new task. If no text given, use a default label. */
  const addTask = useCallback(
    (text) => {
      const label =
        typeof text === "string" && text.trim()
          ? text.trim()
          : `New Task ${tasks.length + 1}`;
      setTasks((prev) => [
        ...prev,
        { id: generateId(), text: label, completed: false },
      ]);
      announce("Task added");
    },
    [tasks.length, announce]
  );

  return (
    <div className={styles.screen} role="application" aria-label="Todo screen">
      <header className={styles.header} role="banner" aria-labelledby="tasks-title">
        <div className="container-xl">
          <div className={styles.headerContent}>
            <h1 id="tasks-title" className={styles.titleTasks}>
              Tasks
            </h1>
            <p id="tasks-progress" className={styles.subtitleProgress}>
              {progressText}
            </p>
          </div>
        </div>
      </header>

      <main className={styles.main} role="main">
        <div className="container-xl">
          <ul className={styles.taskList} aria-label="Task list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={styles.taskItem}
                data-completed={task.completed ? "true" : "false"}
              >
                <div className={styles.taskLeft}>
                  <button
                    type="button"
                    aria-pressed={task.completed}
                    aria-label={
                      task.completed
                        ? "Mark task as not completed"
                        : "Mark task as completed"
                    }
                    className={
                      task.completed
                        ? `${styles.taskCheck} ${styles.isChecked}`
                        : styles.taskCheck
                    }
                    onClick={() => toggleCompleted(task.id)}
                  />
                  <span className={styles.taskText}>{task.text}</span>
                </div>
                <div className={styles.taskAction} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className={styles.fabAdd}
          aria-label="Add new task"
          onClick={() => addTask()}
        >
          <span className={styles.iconPlus} aria-hidden="true" />
        </button>
      </main>

      {/* Accessible live region for updates */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status}
      </div>
    </div>
  );
}
