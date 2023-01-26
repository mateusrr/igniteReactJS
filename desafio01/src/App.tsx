import { useState, useEffect } from 'react'
import './App.css'
import { Header } from './components/Header'
import { Tasks } from './components/Tasks'

const LOCAL_STORAGE_KEY = "todo:saved";

export interface ITask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export function App() {
  /* estado da aplicação */
  const [tasks, setTasks] = useState<ITask[]>([]);

  /* Salvado tasks no local storage */
  function loadSavedTasks() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }

  useEffect(() => {
    loadSavedTasks();
  }, []);

  function setTasksSave(newTasks: ITask[]) {
    setTasks(newTasks);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
  }

  /* adicionando nova task 
     essa função deve ir para o Header*/
  function newTask(taskTitle: string) {
    setTasksSave([
      ...tasks, /* desetruturar para manter as que já existem. */
      /* adicionando uma nova. */
      {
        id: crypto.randomUUID(), /* irá gerar um id aleatório */
        title: taskTitle,
        isCompleted: false
      }
    ])
  }

  function tasksCompleted(taskId: string) {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          isCompleted: !task.isCompleted,
        };
      }
      return task;
    });
    setTasksSave(newTasks);
  }

  function deleteTask(taskId: string) {
    const newTasks = tasks.filter((task) => task.id != taskId);
    setTasksSave(newTasks);
  }

  return (
    <div className="App">
      <Header onNewTask={newTask}/>
      <Tasks tasks={tasks} onDelete={deleteTask} onComplete={tasksCompleted} />
    </div>
  )
}


