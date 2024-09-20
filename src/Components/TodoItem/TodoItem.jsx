import React from 'react';

function TodoItem({ task, setModalVisibility, setModalItem }) {
  const handleClick = () => {
    setModalItem(task);
    setModalVisibility(true);
    console.log(task);
    
  };

  return (
    <div className="todo-item" onClick={handleClick}>
      {task.task}
      {task.dueDate.getHours() ? `: ${task.dueDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}` : ''}
    </div>
  );
}

export default TodoItem;
