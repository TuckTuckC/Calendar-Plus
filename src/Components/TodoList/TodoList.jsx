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
      console.log("DueDate:", dueDate)
      console.log("DueTime:", dueTime)
      const [dueYear, dueMonth, dueDay] = dueDate.split('-').map(Number);
      const [dueHour, dueMinute] = dueTime ? dueTime.split(':').map(Number) : 0;


      if (dueTime) {
        // If there is a time, include it in the dueDateTime
        // new Date(2024, 8, 22, 8, 25,)
        dueDateTime = new Date(dueYear, dueMonth - 1, dueDay, dueHour, dueMinute);
        console.log('dueDateTime', dueDateTime);

      } else {
        // If there's no dueTime (i.e. it's an all-day event), set the time to '00:00:00'
        dueDateTime = new Date(dueYear, dueMonth - 1, dueDay);
      }

      // Ensure the dueDate is valid before adding it
      if (isNaN(dueDateTime.getTime())) {
        console.error('Invalid date:', dueDateTime);
        return; // Don't add the task if the date is invalid
      }

      // Creating the new task object with the inputs
      const newTask = {
        task: inputValue,
        index: todoList.length,
        dueDate: dueDateTime, // Store valid Date object
      };

      // Adding the new task to the todoList and resetting the input fields
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

    console.log(dateKey, year, month, day); // Log the dateKey

    // If there are no tasks for this date yet, create an empty array for that date
    if (!groupedTasks[dateKey]) groupedTasks[dateKey] = [];

    // Add the task to the corresponding date array
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
        <Droppable droppableId={`todo-day-${dateKey}`} key={`todo-day-${dateKey}`}>
          {(provided) => (
            <div className="todo-category" ref={provided.innerRef} {...provided.droppableProps}>
              <h4>{currentDay.toDateString()}</h4>
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task, index) => (
                  <Draggable key={index} draggableId={String(index)} index={index}>
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

  // The JSX that renders the input form and the list of tasks
  return (
    <div className="todo-container">
      {/* Input form to add a new task */}
      <div className="todo-input">
        {/* Input for the task description */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task"
        />
        {/* Input for the due date */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        {/* Input for the optional due time */}
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
        />
        {/* Button to trigger the handleAddTodo function */}
        <button onClick={handleAddTodo}>Add</button>
      </div>

      {/* Render the list of tasks, grouped by date */}
      <div className="todo-list">{renderTaskGroups()}</div>
    </div>
  );
};

export default TodoList;
