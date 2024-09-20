import React from 'react';
import Calendar from './Components/Calendar/Calendar.jsx';
import TodoList from './Components/TodoList/TodoList.jsx';
import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import TodoItemModal from './Components/TodoItem/TodoItemModal.jsx';
import './App.css';

const App = () => {
  const [todoList, setTodoList] = useLocalStorage('todoList', []);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalItem, setModalItem] = useState();

  return (
    <div className="app-container">
      <Calendar todoList={todoList} />
      <TodoList 
        todoList={todoList} 
        setTodoList={setTodoList} 
        setModalItem={setModalItem} 
        setModalVisibility={setModalVisibility} 
      />
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
