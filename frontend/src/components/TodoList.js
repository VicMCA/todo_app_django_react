import axios from "axios"
import React, { useState } from "react"
import Button from "react-bootstrap/Button"
import FormControl from 'react-bootstrap/FormControl'
import Modal from "react-bootstrap/Modal"
import ListGroup from "react-bootstrap/ListGroup"
import { MdCheckBox, MdCheckBoxOutlineBlank, MdEdit, MdDelete } from "react-icons/md"


// Receives an empty list named "todos" and its setter
export default function TodoList({ todos = [], setTodos }) {

  // Initializes a var named "show" with value "false" and creates a setter
  const [show, setShow] = useState(false)
  // Initializes a var named "record" with value "null" and creates a setter
  const [record, setRecord] = useState(null)

  function handleClose() {
  // Sometimes writen as:
  // const handleClose = () => {
    setShow(false)
  }

  // Makes a call to the Django backend to update a todo
  // Django's models have implicit ID's
  async function handleUpdate(id, value) {
    // "patch" is the call to update a value
    return axios.patch(`api/todos/${id}/`, value)
    .then((response) => {
    /* "response" is a json object containing the server response
     * it has loads of attributes, but what we want is inside the
     * "data" key, so we deconstruct that below. */
      const { data } = response
      // "map()" works as a "for item in object/array"
      const newTodos = todos.map(todoToUpdate => {
        // Compares each "todo" by ID to know which to update
        if (todoToUpdate.id === id) {
          // Updates the "todo"
          return data
        }
        // Leaves the "todo" alone if it's not the one to be updated
        return todoToUpdate
      })
      setTodos(newTodos)
    }).catch(() => {
      alert("Couldn't update todo")
    })
  }

  /* The way below of writing functions is dumb, and works
   * exactly the same as writing a normal JS function would */
  const handleChange = (event) => {
  // function handleChange(event) {
  // the above works the same
    setRecord({
      // I'll be honest, I didn't understand this part very well
      ...record,
      name: event.target.value
    })
  }

  function handleDelete(id) {
    // "delete" is to delete an item in the db, obviously
    axios.delete(`/api/todos/${id}/`)
    .then(() => {
      // "newTodos" will be every todo - the one deleted
      const newTodos = todos.filter(todoToDelete => {
        // This will check which todo's ID has been deleted
        // and remove it from the displayed items
        return todoToDelete.id !== id
      })
      setTodos(newTodos)
    }).catch(() => {
      alert("Couldn't remove that todo")
    })
  }

  async function handleSaveChanges() {
    await handleUpdate(record.id, {name: record.name})
    handleClose()
  }

  // filter() is basically a "return x if x is in array/object"
  const completedTodos = todos.filter(todo => todo.completed === true)
  const incompleteTodos = todos.filter(todo => todo.completed === false)

  // This could be a separate component which could then be imported here
  function renderListGroupItem(todo) {
    return <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center">
      <div className="d-flex justify-content-center">
        <span style={{
          marginRight: ".75rem",
          cursor: "pointer",
        }} onClick={() => {
          // That completed: !t.completed is just to return whatever's
          // the opposite of what was there before
          handleUpdate(todo.id, {completed: !todo.completed})
        }}>
          {/* Elvis Syntax below. Same as Python's inline if/else */}
          {todo.completed === true ? <MdCheckBox/> : <MdCheckBoxOutlineBlank/> }
        </span>
        <span>
          {todo.name}
        </span>
      </div>
      <div>
        <MdEdit style={{
          marginRight: ".75rem",
          cursor: "pointer",
        }} onClick={() => {
          setRecord(todo)
          setShow(true)
        }}/>
        <MdDelete style={{
          cursor: "pointer",
        }} onClick={() => {
          handleDelete(todo.id)
        }}/>
      </div>
    </ListGroup.Item>
  }

  return <div>
    <div className="mb-2 mt-2">
      <h4>Completed Todos: {completedTodos.length}</h4>
    </div>
    <ListGroup className="mb-4">
      {completedTodos.map(renderListGroupItem)}
    </ListGroup>
    <div className="mb-2 mt-2">
      <h4>Incomplete Todos: {incompleteTodos.length}</h4>
    </div>
    <ListGroup className="mb-4">
      {incompleteTodos.map(renderListGroupItem)}
    </ListGroup>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Edit Todo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* The "Elvis Syntax" below (record ? record.name : "") is the equivalent
        to Python's (record.name if record (implicit "is True") else "")*/}
        <FormControl value={record ? record.name : ""} onChange={handleChange}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
}
