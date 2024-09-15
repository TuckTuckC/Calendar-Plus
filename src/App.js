import React from 'react';
import Calendar from './Components/Calendar/Calendar.jsx';
import TodoList from './Components/TodoList/TodoList.jsx';
import { DragDropContext } from 'react-beautiful-dnd';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

const App = () => {
  const [todoList, setTodoList] = useLocalStorage('todoList', []);
  const [calendarTasks, setCalendarTasks] = useLocalStorage('calendarTasks', Array(31).fill([]));

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    console.log('Source, Destination', source, destination);
    console.log('Result', result);

    // If there's no destination (e.g. item dropped outside a droppable), do nothing
    if (!destination) return;

    // If the source and destination are the same, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Get the task directly by its draggableId (which is the task id)
    const task = todoList.find((t) => t.id === result.draggableId);

    if (!task) {
      console.error('Task not found!');
      return;
    }

    console.log('Dragged Task:', task);

    // Remove the task from its old location (source)
    const updatedTodoList = [...todoList.filter((t) => t.id !== task.id)];

    // Handle adding the task to the new location (destination)
    const [, year, month, day] = destination.droppableId.split('-');
    const newDueDate = new Date(year, month - 1, day, task.dueDate.getHours(), task.dueDate.getMinutes(), task.dueDate.getSeconds());

    // Update the task's dueDate
    task.dueDate = newDueDate;

    // Add the task to the updated todoList
    updatedTodoList.splice(destination.index, 0, task);

    // Update state with new todoList
    setTodoList(updatedTodoList);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="app-container">
        <Calendar calendarTasks={calendarTasks} todoList={todoList} />
        <TodoList todoList={todoList} setTodoList={setTodoList} />
      </div>
    </DragDropContext>
  );
};

export default App;
