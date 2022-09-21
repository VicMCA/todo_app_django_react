import React, { useState } from 'react'
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import axios from "axios"


export default function TodoForm({ todos, setTodos }) {
  const [name, setName] = useState("")

  function handleChange(event) {
    setName(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!name) {
      alert("Cannot submit an empty todo")
      return
    }

    axios.post("/api/todos/", {
      name: name
    }).then((response) => {
      setName("")
      const { data } = response
      setTodos([
        ...todos,
        data
      ]).catch(() => {
        alert("Couldn't submit todo")
      })
    })
  }

  return <Form onSubmit={handleSubmit}>
    <InputGroup className="mb-4">
      <FormControl
      placeholder="New Todo"
      onChange={handleChange}
      value={name}/>
      <Button type="submit">
        Add
      </Button>
    </InputGroup>
  </Form>
}
