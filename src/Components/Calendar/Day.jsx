import React from 'react';
import { useDrop } from 'react-dnd';
import TodoItem from '../TodoItem/TodoItem';

const Day = ({ currentDay, tasksForDay, setModalItem, setModalVisibility, onTaskDrop }) => {

  return (
    <div className="calendar-day">
      <div className="day-number">{currentDay.getDate()}</div>
      <div className="tasks-container">
        {tasksForDay.length > 0 ? (
          tasksForDay.map((task, index) => (
            <TodoItem task={task} setModalItem={setModalItem} setModalVisibility={setModalVisibility} />
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default Day;
