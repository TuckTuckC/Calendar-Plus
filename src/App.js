import React, { useState } from 'react';
import Calendar from './Components/Calendar/Calendar.jsx';
import TodoList from './Components/TodoList/TodoList.jsx';
import { useLocalStorage } from './hooks/useLocalStorage';
import TodoItemModal from './Components/TodoItem/TodoItemModal.jsx';
import addTodoModal from './Components/TodoItem/AddTodoModal.jsx';
import './App.css';

const App = () => {
  const [todoList, setTodoList] = useLocalStorage('todoList', []);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalItem, setModalItem] = useState();
  
  const [isMobileView, setIsMobileView] = useState(false); // State to toggle views on mobile
  const [showCalendar, setShowCalendar] = useState(true); // Initially show the calendar in mobile view

  const handleToggleView = () => {
    setShowCalendar(!showCalendar); // Toggle between calendar and todo list
  };

  // Handle screen resize to detect if it's mobile view
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
        setShowCalendar(true); // Ensure both are visible on larger screens
      }
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      {/* Render the toggle button for mobile view */}
      {isMobileView === true ? (
        <button className="toggle-view-btn" onClick={handleToggleView}>
          {showCalendar ? 'Show Todo List' : 'Show Calendar'}
        </button>
      ) : ''}
      
      {/* Conditionally render calendar and todo list based on mobile view */}
      {(showCalendar || !isMobileView) && (
        <Calendar
          todoList={todoList}
          setModalItem={setModalItem}
          setModalVisibility={setModalVisibility}
        />
      )}

      {(!showCalendar || !isMobileView) && (
        <TodoList
        isMobileView={isMobileView}
          todoList={todoList}
          setTodoList={setTodoList}
          setModalItem={setModalItem}
          setModalVisibility={setModalVisibility}
        />
      )}
      
      {todoList.length > 0 && (
        <TodoItemModal
          modalVisibility={modalVisibility}
          todoList={todoList}
          setTodoList={setTodoList}
          setModalVisibility={setModalVisibility}
          task={modalItem}
        />
      )}
    </div>
  );
};

export default App;
