import React from 'react';
import './TodoItem.css';

function TodoItem({ task, setModalVisibility, setModalItem }) {
  const handleClick = () => {
    setModalItem(task);
    setModalVisibility(true);
    console.log(task);
    
  };

  return (
    <div className={`todo-item ${task.dueDate.getHours() ? '' : 'allDay'}`} onClick={handleClick}>
      {task.dueDate.getHours() ? `${task.dueDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}: ` : ''}
      {task.task}
    </div>
  );
}

export default TodoItem;
