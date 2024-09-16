import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import './TodoList.css';

const TodoList = ({ todoList, setTodoList }) => {
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const handleAddTodo = () => {
    if (inputValue.trim() && dueDate) {
      let dueDateTime;
      const [dueYear, dueMonth, dueDay] = dueDate.split('-').map(Number);

      if (dueTime) {
        const [dueHour, dueMinute] = dueTime.split(':').map(Number);
        dueDateTime = new Date(dueYear, dueMonth - 1, dueDay, dueHour, dueMinute);
      } else {
        // Create date at midnight (local time) to avoid timezone issues
        dueDateTime = new Date(dueYear, dueMonth - 1, dueDay, 0, 0, 0);
      }

      // Ensure the dueDate is valid before adding it
      if (isNaN(dueDateTime.getTime())) {
        console.error('Invalid date:', dueDateTime);
        return;
      }

      // Create a new task object with a unique UUID
      const newTask = {
        id: uuidv4(),
        task: inputValue,
        dueDate: dueDateTime,
      };

      setTodoList([...todoList, newTask]);
      setInputValue('');
      setDueDate('');
      setDueTime('');
    }
  };

  // Group tasks by their due date
  const groupedTasks = {};
  todoList.forEach((task) => {
    const dueDate = new Date(task.dueDate);

    // Ensure dueDate is handled at midnight to avoid timezone issues
    const adjustedDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate(), 0, 0, 0);

    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const day = String(adjustedDate.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    if (!groupedTasks[dateKey]) groupedTasks[dateKey] = [];
    groupedTasks[dateKey].push(task);
  });

  const renderTaskGroups = () => {
    const daysAhead = 30;
    const today = new Date();
    let days = [];

    for (let i = 0; i <= daysAhead; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + i);

      // Ensure currentDay is set to midnight
      currentDay.setHours(0, 0, 0, 0);

      const dateKey = currentDay.toISOString().split('T')[0];
      const sortedTasks = groupedTasks[dateKey] || [];

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
                        {task.task} {task.dueDate.getHours() === 0 ? '(All-day)' : `: ${task.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
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
