import React, { useState, useEffect, useRef } from 'react';
import './TodoList.css';
import TodoItem from '../TodoItem/TodoItem';
import AddTodoModal from '../TodoItem/AddTodoModal';
import { v4 as uuidv4 } from 'uuid';
import { handleScrollTodoList } from '../../hooks/controllers';
import { shouldRenderTaskOnDate } from '../../hooks/controllers';

const TodoList = ({ todoList, setTodoList, setModalItem, isMobileView, setModalVisibility }) => {
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [repeatOption, setRepeatOption] = useState('none');
  const scrollContainerRef = useRef(null); // Reference to scroll container
  const [activeView, setActiveView] = useState('grouped'); // Track active view
  const [loading, setLoading] = useState(false);
  const [daysOffset, setDaysOffset] = useState({ past: 15, future: 30 });
  const scrollRef = useRef(null)

  const [addModalVisibility, setAddModalVisibility] = useState(false);

  const handleAddTodo = () => {
    
    if (inputValue.trim() && dueDate) {
      console.log('HERE');
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
        dueTime: dueTime,
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
  // Grouped view rendering (Respond to dynamic daysOffset)
  const renderTaskGroups = () => {
    let days = [];
    const startDay = new Date(today);
    startDay.setDate(today.getDate() - daysOffset.past); // Start days 15 before today

    // Render the range based on daysOffset
    for (let i = -daysOffset.past; i <= daysOffset.future; i++) {
      const currentDay = new Date(startDay);
      currentDay.setDate(startDay.getDate() + i);
      currentDay.setHours(0, 0, 0, 0);

      const dateKey = currentDay.toISOString().split('T')[0];
      const sortedTasks = groupedTasks[dateKey] || [];

      const isToday = currentDay.toDateString() === today.toDateString(); // Check if it's today

      days.push(
        <div className={`todo-category ${isToday ? 'today' : ''}`} ref={isToday ? scrollRef : null} key={`tododay-${dateKey}`}>
          <h4>{currentDay.toDateString()}</h4>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TodoItem
                task={task}
                view={'day'}
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

  const initialScroll = (today) => {
    if (today) {
      console.log('Today: ', today);
      scrollContainerRef.current.scrollTop = today.offsetTop;

    }
  }

  // List of all upcoming tasks
  const renderUpcomingTasks = () => {
    const sortedTasks = [...todoList].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return sortedTasks.map((task) => (
      <div key={task.id} className="todo-category">
        <h4>{new Date(task.dueDate).toDateString()}</h4>
        <TodoItem view={'list'} task={task} setModalItem={setModalItem} setModalVisibility={setModalVisibility} />
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

  useEffect(() => {
    if (scrollRef.current) {
      console.log(scrollRef.current);

      scrollRef.current.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }, []);


  return (
    <div className="todo-container">
      {/* Sticky input bar */}
      {isMobileView === false ? <div className="todo-input sticky-input">
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
      </div> : ''}

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
        <div className="view-content grouped-view" onScroll={(e) => handleScrollTodoList(e, loading, setLoading, setDaysOffset, scrollContainerRef, 15)}>
          {renderTaskGroups()}
          {console.log(document.querySelector('.today'))
          }
            <div className="buttons">
    <button 
      className="btn scroll-to-today-btn" 
      onClick={() => scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
      Back to Today
    </button>
    {isMobileView && <button onClick={() => setAddModalVisibility(true)} className="btn add-task-btn">Add Task</button>}
  </div>


        </div>
        <div className="view-content list-view">
          {renderUpcomingTasks()}
        </div>
      </div>
      <AddTodoModal addModalVisibility={addModalVisibility} setAddModalVisibility={setAddModalVisibility} setDueDate={setDueDate} setDueTime={setDueTime} handleAddTodo={handleAddTodo} inputValue={inputValue} setInputValue={setInputValue} repeatOption={repeatOption} setRepeatOption={setRepeatOption} />
    </div>
  );
};

export default TodoList;
