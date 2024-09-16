import React from 'react';
import Calendar from './Components/Calendar/Calendar.jsx';
import TodoList from './Components/TodoList/TodoList.jsx';
import { DragDropContext } from 'react-beautiful-dnd';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

const App = () => {
  const [todoList, setTodoList] = useLocalStorage('todoList', []);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // If there's no destination (e.g. dropped outside of a droppable area)
    if (!destination) return;

    // No change in position
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Get the dragged task
    const task = todoList.find((t) => t.id === result.draggableId);
    if (!task) return;

    // Update the task's dueDate if it's moved to a different day
    const [, year, month, day] = destination.droppableId.split('-');
    const newDueDate = new Date(year, month - 1, day, task.dueDate.getHours(), task.dueDate.getMinutes(), task.dueDate.getSeconds());

    // Update the task's dueDate
    const updatedTask = { ...task, dueDate: newDueDate };

    // Remove the task from the list, then add it at the new position
    const updatedTodoList = [...todoList.filter((t) => t.id !== task.id)];
    updatedTodoList.splice(destination.index, 0, updatedTask);

    // Update state
    setTodoList(updatedTodoList);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="app-container">
        <Calendar todoList={todoList} />
        <TodoList todoList={todoList} setTodoList={setTodoList} />
      </div>
    </DragDropContext>
  );
};

export default App;
