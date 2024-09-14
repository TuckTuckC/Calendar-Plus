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
  
    const taskDate = source.droppableId.split('todo-day-')[1]; // Extract the source date from the source droppableId
    const taskIndex = source.index;
  
    // Find the task in the todoList
    const task = todoList.find((item, idx) => {
      const taskDateISO = item.dueDate instanceof Date ? item.dueDate.toISOString() : new Date(item.dueDate).toISOString();
      return taskDateISO.split('T')[0] === taskDate && idx === taskIndex;
    });
    
    if (!task) {
      console.error('Task not found!');
      return;
    }
  
    // Update calendarTasks immutably
    const updatedCalendar = [...calendarTasks];
  
    // Remove the task from the source
    const sourceDayIndex = new Date(task.dueDate.getFullYear(), task.dueDate.getMonth(), task.dueDate.getDate()).getDate() - 1;
  
    // Ensure source day array is initialized
    updatedCalendar[sourceDayIndex] = Array.isArray(updatedCalendar[sourceDayIndex])
      ? [...updatedCalendar[sourceDayIndex]]
      : [];
  
    // Remove the task from the source day
    updatedCalendar[sourceDayIndex] = updatedCalendar[sourceDayIndex].filter((_, i) => i !== taskIndex);
  
    // Add the task to the destination
    const dayParts = destination.droppableId.split('-');
    const year = parseInt(dayParts[1], 10);
    const month = parseInt(dayParts[2], 10);
    const day = parseInt(dayParts[3], 10);
    
    // Set the new dueDate for the task
    const newDueDate = new Date(year, month - 1, day);
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
    updatedTodoList[taskIndex] = task;
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
