import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './TodoList.css';

const TodoList = ({ todoList, setTodoList }) => {
  // State to track the new todo input
  const [newTodo, setNewTodo] = useState('');

  // Function to handle adding a new todo
  const addTodo = (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    // Do not add an empty item
    if (newTodo.trim() === '') return;

    // Create new todo item with unique ID
    const newItem = {
      id: `${Date.now()}`, // Simple ID based on timestamp
      text: newTodo,
    };

    // Update the todo list by adding the new item at the top
    setTodoList([newItem, ...todoList]);

    // Clear the input field
    setNewTodo('');
  };

  return (
    <div className="todo-list-container">
      <Droppable droppableId="todoList">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="todo-list">
            {todoList.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="todo-item"
                  >
                    {todo.text}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Input field to add new items */}
      <form onSubmit={addTodo} className="todo-input-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="todo-input"
          placeholder="Add a new task..."
        />
        <button type="submit" className="todo-submit-btn">Add</button>
      </form>
    </div>
  );
};

export default TodoList;
