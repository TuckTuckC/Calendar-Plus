import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import './TodoList.css';

// TodoList contains a list of tasks which are set by react state
const TodoList = ({ todoList, setTodoList }) => {
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  // handleAddTodo is called when the "Add" button is clicked. It adds a new task to the todoList. Verifies that there is a due date and a description
  const handleAddTodo = () => {
    if (inputValue.trim() && dueDate) {
      let dueDateTime = new Date(`${dueDate}T${dueTime || '00:00:00'}`);
      
      // Creating the new task object with the inputs
      const newTask = { task: inputValue, dueDate: dueDateTime, time: dueTime || null };
      
      // Adding the new task to the todoList and resetting the input fields
      setTodoList([...todoList, newTask]);
      // Cleasring Fields
      setInputValue('');
      setDueDate('');
      setDueTime('');
    }
  };

  // This block groups tasks by their due date.
  const groupedTasks = {};
  // Loop through all tasks in the todoList
  todoList.forEach((task) => {
    // Convert each task's due date to a string formatted as 'YYYY-MM-DD' (the ISO format)
    const dateKey = task.dueDate.toISOString().split('T')[0]; // Get the date part only
    
    // If there are no tasks for this date yet, create an empty array for that date
    if (!groupedTasks[dateKey]) groupedTasks[dateKey] = [];
    
    // Add the task to the corresponding date array
    groupedTasks[dateKey].push(task);
  });

  // renderTaskGroups dynamically renders tasks for each upcoming day (up to 30 days ahead).
  const renderTaskGroups = () => {
    const daysAhead = 30;
    const today = new Date();

    let days = []; // Array to store the rendered tasks for each day

    // Loop through the number of days (today + 30 days ahead)
    for (let i = 0; i <= daysAhead; i++) {
      const currentDay = new Date(today); // Create a new Date object for each day in the loop
      currentDay.setDate(today.getDate() + i); // Increment the date by the loop index to go from today up to 30 days ahead

      // Convert the currentDay to an ISO date string (YYYY-MM-DD)
      const dateKey = currentDay.toISOString().split('T')[0];

      // For each day, sort tasks based on their time (all-day tasks come last)
      const sortedTasks = groupedTasks[dateKey]
        ? groupedTasks[dateKey].sort((a, b) => (a.time && b.time ? a.time.localeCompare(b.time) : a.time ? -1 : 1))
        : []; // If no tasks for that day, return an empty array

      // Logging the droppable ID to ensure proper rendering
      console.log('Rendering Droppable with ID:', `todo-day-${dateKey}`);

      // Create a Droppable area for each day where tasks can be dragged and dropped
      days.push(
        <Droppable droppableId={`todo-day-${dateKey}`} key={`todo-day-${dateKey}`}>
          {(provided) => (
            <div className="todo-category" ref={provided.innerRef} {...provided.droppableProps}>
              <h4>{currentDay.toDateString()}</h4> {/* Render the date for the task group */}
              
              {/* If there are tasks for the current day, render them */}
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task, index) => (
                  // Create a Draggable area for each individual task
                  <Draggable key={task.task} draggableId={task.task} index={index}>
                    {(provided) => (
                      <div
                        className={`todo-item ${task.time ? '' : 'all-day-task'}`} // Add a special class if it's an all-day task (no time)
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {/* Render the task description and time if available */}
                        {task.task} {task.time ? `@ ${task.time}` : '(All-day)'}
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <p>No tasks for this day</p> // If there are no tasks, show a placeholder message
              )}
              {provided.placeholder} {/* Placeholder for the droppable area */}
            </div>
          )}
        </Droppable>
      );
    }
    return days; // Return the list of task groups for rendering
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
