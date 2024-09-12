import React, { useState, useEffect } from 'react';
import Calendar from './Components/Calendar/Calendar.jsx';
import TodoList from './Components/TodoList/TodoList.jsx';
import { DragDropContext } from 'react-beautiful-dnd';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

const App = () => {
  // Store tasks and calendar events in local storage
  const [todoList, setTodoList] = useLocalStorage('todoList', []);
  const [calendarTasks, setCalendarTasks] = useLocalStorage('calendarTasks', Array(31).fill([]));

  // Handle drag end event
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // If no valid destination, return
    if (!destination) return;

    // Moving within or between lists
    if (source.droppableId === destination.droppableId) {
      // Logic for rearranging items within the list or the calendar
      if (source.droppableId === 'todoList') {
        const updatedList = [...todoList];
        const [movedItem] = updatedList.splice(source.index, 1);
        updatedList.splice(destination.index, 0, movedItem);
        setTodoList(updatedList);
      } else {
        const dayIndex = parseInt(destination.droppableId.replace('day-', ''));
        const updatedCalendar = [...calendarTasks];
        const [movedItem] = updatedCalendar[dayIndex].splice(source.index, 1); // Fixed index
        updatedCalendar[dayIndex].splice(destination.index, 0, movedItem);
        setCalendarTasks(updatedCalendar);
      }
    }

    // Moving between list and calendar
    if (source.droppableId === 'todoList' && destination.droppableId.startsWith('day-')) {
      const updatedList = [...todoList];
      const dayIndex = parseInt(destination.droppableId.replace('day-', ''));
      const [movedItem] = updatedList.splice(source.index, 1);
      const updatedCalendar = [...calendarTasks];
      updatedCalendar[dayIndex].push(movedItem);
      setTodoList(updatedList);
      setCalendarTasks(updatedCalendar);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="app-container">
        <Calendar calendarTasks={calendarTasks} />
        {/* Pass both todoList and setTodoList to TodoList */}
        <TodoList todoList={todoList} setTodoList={setTodoList} />
      </div>
    </DragDropContext>
  );
};

export default App;
