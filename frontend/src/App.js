import React from "react";
import "./styles/tokens.css";
import TodoScreen from "./components/todo/TodoScreen";

/**
 * PUBLIC_INTERFACE
 * App
 * The root component that mounts the Figma-inspired Todo screen.
 * This component wires global design tokens and renders the TodoScreen.
 *
 * Returns:
 *  - JSX.Element: The application root
 */
function App() {
  return <TodoScreen />;
}

export default App;
