import axios from "axios"
import React, { useState } from "react"
import Button from "react-bootstrap/Button"
import FormControl from 'react-bootstrap/FormControl'
import Modal from "react-bootstrap/Modal"
import ListGroup from "react-bootstrap/ListGroup"
import { MdCheckBox, MdCheckBoxOutlineBlank, MdEdit, MdDelete } from "react-icons/md"


export default function TodoList({ todos = [], setTodos }) {

  const [show, setShow] = useState(false)
  const [record, setRecord] = useState(null)

  function handleClose() {
    setShow(false)
  }

  async function handleUpdate(id, value) {
    return axios.patch(`api/todos/${id}/`, value)
    .then((response) => {
      const { data } = response
      const newTodos = todos.map(todoToUpdate => {
        if (todoToUpdate.id === id) {
          return data
        }
        return todoToUpdate
      })
      setTodos(newTodos)
    }).catch(() => {
      alert("Couldn't update todo")
    })
  }

  const handleChange = (event) => {
    setRecord({
      ...record,
      name: event.target.value
    })
  }

  function handleDelete(id) {
    axios.delete(`/api/todos/${id}/`)
    .then(() => {
      const newTodos = todos.filter(todoToDelete => {
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

  const completedTodos = todos.filter(todo => todo.completed === true)
  const incompleteTodos = todos.filter(todo => todo.completed === false)

  function renderListGroupItem(todo) {
    return <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center">
      <div className="d-flex justify-content-center">
        <span style={{
          marginRight: ".75rem",
          cursor: "pointer",
        }} onClick={() => {
          handleUpdate(todo.id, {completed: !todo.completed})
        }}>
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
