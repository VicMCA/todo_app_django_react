import React, { useState } from 'react'
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import axios from "axios"


export default function TodoForm({ todos, setTodos }) {
  const [name, setName] = useState("")

  function handleChange(event) {
  // const handleChange = event => {
    setName(event.target.value)
  }

  function handleSubmit(event) {
  // const handleSubmit = event => {
    // preventDefault() prevents the page from reloading.
    // if it reloads, the form isn't submitted
    event.preventDefault()
    if (!name) {
      alert("Cannot submit an empty todo")
      return
    }

    axios.post("/api/todos/", {
      name: name
    }).then((response) => {
      setName("")
      /* "response" is a json object containing the server response
       * it has loads of attributes, but what we want is inside the
       * "data" key, so we deconstruct that below. */
      const { data } = response
      setTodos([
        /* The "rest syntax" (...var) below returns an array
         * So here we're making an array of the previous items
         * plus the one we just sent */
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
