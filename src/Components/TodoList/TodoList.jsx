import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import './TodoList.css';

// TodoList contains a list of tasks which are set by react state
const TodoList = ({ todoList, setTodoList }) => {
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  // handleAddTodo is called when the "Add" button is clicked. It adds a new task to the todoList.
  const handleAddTodo = () => {
    if (inputValue.trim() && dueDate) {
      let dueDateTime;
      const [dueYear, dueMonth, dueDay] = dueDate.split('-').map(Number);
  
      if (dueTime) {
        const [dueHour, dueMinute] = dueTime.split(':').map(Number);
        dueDateTime = new Date(dueYear, dueMonth - 1, dueDay, dueHour, dueMinute);
      } else {
        dueDateTime = new Date(dueYear, dueMonth - 1, dueDay);
      }
  
      // Ensure the dueDate is valid before adding it
      if (isNaN(dueDateTime.getTime())) {
        console.error('Invalid date:', dueDateTime);
        return;
      }
  
      // Creating the new task object with a unique ID
      const newTask = {
        id: Date.now().toString(), // Use the current timestamp as a unique ID
        task: inputValue,
        dueDate: dueDateTime,
      };
  
      setTodoList([...todoList, newTask]);
      setInputValue('');
      setDueDate('');
      setDueTime('');
    }
  };

  // Group tasks by their due date.
  const groupedTasks = {};
  todoList.forEach((task) => {
    const dueDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);

    // Extract year, month, and day using Date methods
    const year = dueDate.getFullYear();
    const month = String(dueDate.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so we add 1
    const day = String(dueDate.getDate()).padStart(2, '0');

    // Construct the dateKey in 'YYYY-MM-DD' format
    const dateKey = `${year}-${month}-${day}`;

    if (!groupedTasks[dateKey]) groupedTasks[dateKey] = [];
    groupedTasks[dateKey].push(task);
  });

  // Dynamically render tasks for each upcoming day (up to 30 days ahead).
  const renderTaskGroups = () => {
    const daysAhead = 30;
    const today = new Date();
    let days = [];

    for (let i = 0; i <= daysAhead; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + i);

      const dateKey = currentDay.toISOString().split('T')[0];
      const sortedTasks = groupedTasks[dateKey]
        ? groupedTasks[dateKey].sort((a, b) => {
          const aTime = a.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const bTime = b.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return aTime.localeCompare(bTime);
        })
        : [];

      days.push(
        <Droppable droppableId={`tododay-${dateKey}`} key={`tododay-${dateKey}`}>
          {(provided) => (
            <div className="todo-category" ref={provided.innerRef} {...provided.droppableProps}>
              <h4>{currentDay.toDateString()}</h4>
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        className={`todo-item ${task.dueDate.getHours() === 0 ? 'all-day-task' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {task.task}{' '}
                        {task.dueDate.getHours() === 0 && task.dueDate.getMinutes() === 0
                          ? '(All-day)'
                          : `: ${task.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <p>No tasks for this day</p>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    }
    return days;
  };

  return (
    <div className="todo-container">
      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <div className="todo-list">{renderTaskGroups()}</div>
    </div>
  );
};

export default TodoList;
