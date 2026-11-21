import type React from "react";
import { useEffect, useState } from "react";

type Task = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  taskInformation: string;
};

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks());
  const [newTaskInformation, setNewTaskInformation] = useState("");

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTaskInformation(event.currentTarget.value);
  }

  function addTask(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTaskInformation.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      taskInformation: newTaskInformation,
    };

    setTasks((t) => [...t, newTask]);
    setNewTaskInformation("");
  }

  function deleteTask(id: `${string}-${string}-${string}-${string}-${string}`) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function moveTaskUp(index: number) {
    if (index <= 0) return;

    const updatedTasks: Task[] = [...tasks];
    const movedTask = updatedTasks[index];

    if (!movedTask) return;

    updatedTasks.splice(index, 1);
    updatedTasks.splice(index - 1, 0, movedTask);

    setTasks(updatedTasks);
  }

  function moveTaskDown(index: number) {
    if (index >= tasks.length - 1) return;

    const updatedTasks = [...tasks];
    const movedTask = updatedTasks[index];

    if (!movedTask) return;

    updatedTasks.splice(index, 1);
    updatedTasks.splice(index + 1, 0, movedTask);

    setTasks(updatedTasks);
  }

  useEffect(() => {
    localStorage.setItem("TASKS", JSON.stringify(tasks));
  });

  function loadTasks(): Task[] {
    const taskJSON = localStorage.getItem("TASKS");
    if (taskJSON == null) return [];
    return JSON.parse(taskJSON);
  }

  return (
    <div className="to-do-list">
      <h1 className="title">To-Do-List</h1>

      <form className="add-task-form" onSubmit={addTask}>
        <input
          className="add-task-input"
          type="text"
          placeholder="Enter a task..."
          value={newTaskInformation}
          onChange={handleInputChange}
        />
        <button type="submit" className="add-button">
          Add
        </button>
      </form>

      <ol className="tasks">
        {tasks.map((task, index) => (
          <li className="task" key={task.id}>
            <span className="task-information">{task.taskInformation}</span>
            <button
              className="delete-button"
              type="button"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
            <button
              className="move-button"
              type="button"
              onClick={() => moveTaskUp(index)}
            >
              ↑
            </button>
            <button
              className="move-button"
              type="button"
              onClick={() => moveTaskDown(index)}
            >
              ↓
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
