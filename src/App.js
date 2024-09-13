// App.js
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
    console.log('Drag End Result:', result);
    
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId.startsWith('todo-day') && destination.droppableId.startsWith('day-')) {
      const dayParts = destination.droppableId.split('-'); // Handle date as parts
      const year = parseInt(dayParts[1], 10);
      const month = parseInt(dayParts[2], 10);
      const day = parseInt(dayParts[3], 10);
      const taskDate = source.droppableId.split('todo-day-')[1];
      const taskIndex = source.index;

      const task = todoList.filter(item => item.dueDate.toISOString().split('T')[0] === taskDate)[taskIndex];

      const updatedCalendar = [...calendarTasks];
      const dayIndex = new Date(year, month - 1, day).getDate() - 1; // Ensure correct dayIndex
      updatedCalendar[dayIndex].push(task);
      setCalendarTasks(updatedCalendar);
    }
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
