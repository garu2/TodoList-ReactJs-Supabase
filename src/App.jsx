import { useEffect, useState } from 'react'
import supabase from './SupabaseClient'
import './App.css'

function App() {
  const [newTask, setNewTask] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getTasks()
  }, [])

  /* LIST TASKS */
  const getTasks = async () => {
    const { data, error } = await supabase.from('TodoList').select('*')

    if (error) {
      console.error('Error al obtener las tareas:', error)
    } else {
      setTasks(data)
    }
  }

  /* CREATE TASK */
  const addTask = async () => {
    const task = {
      name: newTask,
      isCompleted: false,
    }

    const { data, error } = await supabase
      .from('TodoList')
      .insert([task])
      .select()
      .single()

    if (error) {
      console.error('Error al crear la tarea:', error)
    } else {
      //getTasks()
      setTasks([...tasks, data])
      setNewTask('')
    }
  }

  /* DELETE TASK */
  const deleteTask = async (id) => {
    const { error } = await supabase.from('TodoList').delete().eq('id', id)

    if (error) {
      console.error('Error al eliminar la tarea:', error)
    } else {
      //getTasks()
      setTasks(tasks.filter((task) => task.id !== id))
    }
  }

  /* UPDATE TASK */
  const completeTask = async (id, isCompleted) => {
    const { error } = await supabase
      .from('TodoList')
      .update({ isCompleted: !isCompleted })
      .eq('id', id)

    if (error) {
      console.error('Error al actualizar la tarea:', error)
    } else {
      //getTasks()
      setTasks(tasks.map((task) => task.id === id ?
        { ...task, isCompleted: !isCompleted } :
        task
      ))
    }
  }
    

  return (
    <>
      <h1>Todo List</h1>
      <div>
        <input 
          type="text" 
          placeholder="Agregar tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={() => addTask()}>Agregar</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span className={task.isCompleted ? 'completed' : ''}>{task.name}</span>
            <button onClick={() => deleteTask(task.id)}>Eliminar</button>
            <button onClick={() => completeTask(task.id, task.isCompleted)}
              >{task.isCompleted ? 'Completada' : 'Incompleta'}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
