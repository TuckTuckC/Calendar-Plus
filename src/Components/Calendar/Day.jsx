import React from 'react';
import TodoItem from '../TodoItem/TodoItem';

const Day = ({ currentDay, tasksForDay, setModalItem, setModalVisibility, onTaskDrop }) => {

  return (
    <div className={currentDay.getFullYear() === new Date().getFullYear() &&
      currentDay.getMonth() === new Date().getMonth() &&
      currentDay.getDate() === new Date().getDate() ? 'todayCal calendar-day' : 'calendar-day'}>
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
