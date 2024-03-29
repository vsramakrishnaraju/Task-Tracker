import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState } from 'react'
import AddTask from "./components/AddTask";
import { useEffect } from "react";
import Footer from "./components/Footer";
import About from "./components/About";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App = () =>  {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks() 
      setTasks(tasksFromServer)
    }
    
    getTasks()
  }, [])

//fetch tasks 
const fetchTasks = async () => {
  const res = await fetch('http://localhost:8080/tasks')
  const data = await res.json()

  return data
} 


//fetch task
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:8080/tasks/${id}`)
  const data = await res.json()

  return data
} 

//delete task 
const deleteTask = async (id) => {

  await fetch(`http://localhost:8080/tasks/${id}`, {
    method: 'DELETE',
  })

  setTasks(tasks.filter((task) => task.id !== id))
}

//toggel reminder 
const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id)
  const updatedTask = { ...taskToToggle, remider: !taskToToggle.remider }

  const res = await fetch(`http://localhost:8080/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type':  'application/json',
    },
    body: JSON.stringify(updatedTask),
  })

  const data = await res.json()

  setTasks(tasks.map((task) => task.id === id ? { ...task, remider: !data.remider } : task))
}

//Add Task 

const addTask = async (task) => {
  const res = await fetch('http://localhost:8080/tasks', {
    method: 'POST',
    headers: {
      'Content-type':  'application/json',
    },
    body: JSON.stringify(task),
  })

  const data = await res.json() 

  setTasks([...tasks, data])
  // const id = Math.floor(Math.random()*10000) + 1
  // const newTask = { id, ...task }
  // setTasks([...tasks, newTask])
}

return (
  <Router>
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
      <Routes>
        <Route path='/' element={
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No tasks to show'}
          </>
        } />
        <Route path='/about' element={<About />} />
      </Routes>
      <Footer />
    </div>
  </Router>
)
}

export default App;
