import React, { useEffect, useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import './Calendar.css';

const Calendar = ({ calendarTasks, todoList }) => {
  const [monthOffsets, setMonthOffsets] = useState(
    Array.from({ length: 21 }, (_, i) => i - 10)
  ); // Start with 10 months before and 10 after
  const currentMonthIndex = 10; // The index of the current month in the array

  const calendarRef = useRef(null);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  // Auto-scroll to the current month when the component mounts
  useEffect(() => {
    if (calendarRef.current) {
      const currentMonthElement = document.getElementById(`month-${currentMonthIndex}`);
      if (currentMonthElement) {
        currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // When scrolling near the top, load more months above
    if (scrollTop < 100) {
      setMonthOffsets((prevOffsets) => [
        ...Array.from({ length: 10 }, (_, i) => prevOffsets[0] - (10 - i)),
        ...prevOffsets,
      ]);
    }

    // When scrolling near the bottom, load more months below
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setMonthOffsets((prevOffsets) => [
        ...prevOffsets,
        ...Array.from({ length: 10 }, (_, i) => prevOffsets[prevOffsets.length - 1] + i + 1),
      ]);
    }
  };

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
    <div className="calendar-container" onScroll={handleScroll} ref={calendarRef}>
      {monthOffsets.map((offset, index) => (
        <div key={index} id={`month-${index}`} className="calendar-month">
          <h3>{new Date(new Date().setMonth(new Date().getMonth() + offset)).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          <div className="calendar-grid">{renderDays(offset)}</div>
        </div>
      ))}
    </div>
  );
};

export default Calendar;
