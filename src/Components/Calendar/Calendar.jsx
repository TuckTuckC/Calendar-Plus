import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import './Calendar.css';

const Calendar = ({ calendarTasks, todoList }) => {
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const renderDays = (monthOffset) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const month = (currentMonth + monthOffset) % 12;
    const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
    const daysInMonth = getDaysInMonth(month, year);

    const tasksForMonth = todoList.filter((task) => {
      const taskMonth = task.dueDate.getMonth();
      const taskYear = task.dueDate.getFullYear();
      return taskMonth === month && taskYear === year;
    });

    let days = [];
    for (let i = 1; i <= 31; i++) {
      const dayTasks = tasksForMonth.filter((task) => task.dueDate.getDate() === i);
      const sortedTasks = dayTasks.sort((a, b) => (a.time && b.time ? a.time.localeCompare(b.time) : a.time ? -1 : 1));

      const droppableId = `day-${year}-${month + 1}-${i}`;
      console.log('Rendering Droppable with ID:', droppableId); // Log the Droppable IDs

      days.push(
        <Droppable droppableId={droppableId} key={droppableId}>
          {(provided) => (
            <div
              className="calendar-day"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="day-number">{i <= daysInMonth ? i : ''}</div>
              <div className="tasks-container">
                {sortedTasks.map((task, index) => (
                  <div key={index} className={`task-item ${task.time ? '' : 'all-day-task'}`}>
                    {task.task} {task.time ? `@ ${task.time}` : '(All-day)'}
                  </div>
                ))}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <h2>Current Month</h2>
      <div className="calendar-grid">{renderDays(0)}</div>

      <h2>Next 3 Months</h2>
      {[1, 2, 3].map((offset) => (
        <div key={offset} className="calendar-month">
          <h3>{new Date(new Date().setMonth(new Date().getMonth() + offset)).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <div className="calendar-grid">{renderDays(offset)}</div>
        </div>
      ))}
    </div>
  );
};

export default Calendar;
