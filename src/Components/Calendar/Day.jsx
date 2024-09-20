import React from 'react';
import { useDrop } from 'react-dnd';

const Day = ({ currentDay, tasksForDay, onTaskDrop }) => {
  const [, drop] = useDrop({
    accept: 'task',
    drop: (draggedTask) => {
      onTaskDrop(draggedTask, currentDay);
    },
  });

  return (
    <div ref={drop} className="calendar-day">
      <div className="day-number">{currentDay.getDate()}</div>
      <div className="tasks-container">
        {tasksForDay.length > 0 ? (
          tasksForDay.map((task, index) => (
            <div key={index} className="task">
              {task.task}
            </div>
          ))
        ) : (
          <p>No tasks</p>
        )}
      </div>
    </div>
  );
};

export default Day;
