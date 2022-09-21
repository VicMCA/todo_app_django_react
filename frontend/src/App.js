import React, { useState, useEffect } from "react"
import Container from "react-bootstrap/Container"
import NavBar from "react-bootstrap/Navbar"
import axios from "axios"

import TodoForm from "./components/TodoForm"
import TodoList from "./components/TodoList"


function App() {
  // Initializes an empty array named "todos" and its setter
  const [todos, setTodos] = useState([])

  // USEEFFECT() LESSON INCOMING

  /* Fills the above array with the one's present
   * in the Django's backend DB;
   *
   * useEffect() runs whenever the corresponding
   * component is created/updated, so it doesn't
   * need to be assigned to a var/const */
  useEffect(() => {
    axios.get("/api/todos/")
    // "res" is a json array
    .then((response) => {
      // Here we don't need to deconstruct the data,
      // we can just select it
      setTodos(response.data)
    }).catch(() => {
      alert("Couldn't update todo")
    })
  }, [])
  /**
   * The empty array above receives the dependencies (states)
   * useEffect() will listen to. If it doesn't list to any, it'll
   * only run on load, but if any state (such as "todos") is passed
   * as dependency, it'll listen to changes on it.
   *
   * If we use a return statement after the main body of useEffect,
   * it'll be run as the component is destroyed.
   */

  return (
    <div>
      <NavBar variant="dark" style={styles.navBar}>
        <Container>
          <NavBar.Brand href="#">
            Todo App
          </NavBar.Brand>
        </Container>
      </NavBar>
      <Container>
        <TodoForm todos={todos} setTodos={setTodos}/>
        <TodoList todos={todos} setTodos={setTodos}/>
      </Container>
    </div>
  );
}

const styles = {
  navBar: {
    backgroundColor: "#334",
    color: "#bbb",
    marginBottom: "2rem",
  }
}

export default App;
