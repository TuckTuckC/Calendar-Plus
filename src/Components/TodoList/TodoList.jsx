import React, { useState, useRef } from 'react';
import './TodoList.css';
import TodoItem from '../TodoItem/TodoItem';
import { v4 as uuidv4 } from 'uuid';
import { shouldRenderTaskOnDate } from '../../hooks/controllers';

const TodoList = ({ todoList, setTodoList, setModalItem, setModalVisibility }) => {
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [repeatOption, setRepeatOption] = useState('none');
  const scrollContainerRef = useRef(null); // Reference to scroll container
  const [activeView, setActiveView] = useState('grouped'); // Track active view

  const handleAddTodo = () => {
    if (inputValue.trim() && dueDate) {
      let dueDateTime;
      const [dueYear, dueMonth, dueDay] = dueDate.split('-').map(Number);

      if (dueTime) {
        const [dueHour, dueMinute] = dueTime.split(':').map(Number);
        dueDateTime = new Date(dueYear, dueMonth - 1, dueDay, dueHour, dueMinute);
      } else {
        dueDateTime = new Date(dueYear, dueMonth - 1, dueDay, 0, 0, 0);
      }

      if (isNaN(dueDateTime.getTime())) {
        console.error('Invalid date:', dueDateTime);
        return;
      }

      const newTask = {
        id: uuidv4(),
        task: inputValue,
        dueDate: dueDateTime,
        repeat: repeatOption,
      };

      setTodoList([...todoList, newTask]);
      setInputValue('');
      setDueDate('');
      setDueTime('');
      setRepeatOption('none');
    }
  };

  const groupedTasks = {};
  const daysAhead = 30; // Render 30 days ahead
  const today = new Date();

  todoList.forEach((task) => {
    const taskDate = new Date(task.dueDate);
    for (let i = 0; i <= daysAhead; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + i);
      currentDay.setHours(0, 0, 0, 0);

      const year = currentDay.getFullYear();
      const month = String(currentDay.getMonth() + 1).padStart(2, '0');
      const day = String(currentDay.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      if (shouldRenderTaskOnDate(task, currentDay)) {
        if (!groupedTasks[dateKey]) groupedTasks[dateKey] = [];
        groupedTasks[dateKey].push(task);
      }
    }
  });

  // Grouped view rendering (Render 30 days ahead properly)
  const renderTaskGroups = () => {
    let days = [];
    for (let i = 0; i <= daysAhead; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + i);
      currentDay.setHours(0, 0, 0, 0);

      const dateKey = currentDay.toISOString().split('T')[0];
      const sortedTasks = groupedTasks[dateKey] || [];

      days.push(
        <div className="todo-category" key={`tododay-${dateKey}`}>
          <h4>{currentDay.toDateString()}</h4>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TodoItem
                task={task}
                key={`todo-${task.id}`}
                setModalItem={setModalItem}
                setModalVisibility={setModalVisibility}
              />
            ))
          ) : (
            <p>No tasks for this day</p>
          )}
        </div>
      );
    }
    return days;
  };

  // List of all upcoming tasks
  const renderUpcomingTasks = () => {
    const sortedTasks = [...todoList].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return sortedTasks.map((task) => (
      <div key={task.id} className="todo-category">
        <h4>{new Date(task.dueDate).toDateString()}</h4>
        <TodoItem task={task} setModalItem={setModalItem} setModalVisibility={setModalVisibility} />
      </div>
    ));
  };

  // Function to scroll left or right and update the active view
  const scrollToView = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });

      // Update active view
      setActiveView(direction === 'left' ? 'grouped' : 'list');
    }
  };

  return (
    <div className="todo-container">
      {/* Sticky input bar */}
      <div className="todo-input sticky-input">
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
        <select value={repeatOption} onChange={(e) => setRepeatOption(e.target.value)}>
          <option value="none">Does not repeat</option>
          <option value="daily">Every day</option>
          <option value="weekly">Every week</option>
          <option value="monthly">Every month</option>
          <option value="yearly">Every year</option>
        </select>
        <button onClick={handleAddTodo}>Add</button>
      </div>

      {/* View toggler with active view tracking */}
      <div className={`view-toggle ${activeView === 'list' ? 'active-list' : ''}`}>
        <button
          className={`view-button ${activeView === 'grouped' ? 'active' : ''}`}
          onClick={() => scrollToView('left')}
        >
          Grouped View
        </button>
        <button
          className={`view-button ${activeView === 'list' ? 'active' : ''}`}
          onClick={() => scrollToView('right')}
        >
          Task List View
        </button>
      </div>

      {/* Scrollable view container */}
      <div className="scroll-container" ref={scrollContainerRef}>
        <div className="view-content grouped-view">
          {renderTaskGroups()}
        </div>
        <div className="view-content list-view">
          {renderUpcomingTasks()}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
