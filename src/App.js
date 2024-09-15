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
  
    // Get the task directly by index instead of searching with the date
    const task = todoList[source.index];
  
    if (!task) {
      console.error('Task not found!');
      return;
    }
  
    console.log('Dragged Task:', task);
  
    // Update calendarTasks immutably
    const updatedCalendar = [...calendarTasks];
  
    // Remove the task from the source
    const sourceDayIndex = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate()).getDate() - 1;
    console.log('sourceDayIndex:', sourceDayIndex);
  
    // Ensure source day array is initialized
    updatedCalendar[sourceDayIndex] = Array.isArray(updatedCalendar[sourceDayIndex])
      ? [...updatedCalendar[sourceDayIndex]]
      : [];
  
    // Remove the task from the source day
    updatedCalendar[sourceDayIndex] = updatedCalendar[sourceDayIndex].filter((_, i) => i !== source.index);
  
    // Add the task to the destination
    const [, year, month, day] = destination.droppableId.split('-');
    console.log('Year, Month, Day:', year, month, day);
    
  
    // Extract time from the existing task.dueDate
    const hours = task.dueDate.getHours();
    const minutes = task.dueDate.getMinutes();
    const seconds = task.dueDate.getSeconds();
  
    // Create a new Date object using the extracted date and the existing time
    const newDueDate = new Date(year, month - 1, day, hours, minutes, seconds);
  
    console.log('Old Due Date:', task.dueDate);
    console.log('New Due Date:', newDueDate);
  
    // Update the task with the new dueDate
    task.dueDate = newDueDate;
  
    const destDayIndex = newDueDate.getDate() - 1;
  
    // Ensure destination day array is initialized
    updatedCalendar[destDayIndex] = Array.isArray(updatedCalendar[destDayIndex])
      ? [...updatedCalendar[destDayIndex]]
      : [];
  
    // Add the task to the destination day
    updatedCalendar[destDayIndex].push(task);
  
    // Update the state with the new calendarTasks
    setCalendarTasks(updatedCalendar);
  
    // Update the todoList with the updated task's dueDate
    const updatedTodoList = [...todoList];
    updatedTodoList[source.index] = task; // Update the task in the list
    setTodoList(updatedTodoList); // Save the updated todoList to localStorage
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
