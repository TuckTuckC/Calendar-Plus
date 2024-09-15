import React, { useEffect, useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import './Calendar.css';

const Calendar = ({ calendarTasks, todoList }) => {
  const [monthOffsets, setMonthOffsets] = useState(
    Array.from({ length: 21 }, (_, i) => i - 10)
  ); // Start with 10 months before and 10 after

  const calendarRef = useRef(null);

  // Get the correct current month and year using Date()
  const currentDate = new Date(); // Get the current date from the system
  const currentMonth = currentDate.getMonth(); // Current month (0 = January, 11 = December)
  const currentYear = currentDate.getFullYear(); // Current year
  const currentMonthOffset = 0; // Current month will have offset 0 in this calculation

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  // Set the scrollTop directly when the component mounts to position the scroll at the current month
  useEffect(() => {
    const currentMonthElement = document.querySelector('.current-month');
    if (currentMonthElement && calendarRef.current) {
      // Calculate the position of the current month and set it as the scrollTop value
      const calendarContainer = calendarRef.current;
      const offsetTop = currentMonthElement.offsetTop;
      calendarContainer.scrollTop = offsetTop; // Set the scrollTop to directly position at the current month
    }
  }, []);

  // Smooth scroll back to the current month when the button is clicked
  const scrollToCurrentMonth = () => {
    const currentMonthElement = document.querySelector('.current-month');
    if (currentMonthElement) {
      currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Smooth scroll
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // Dynamically load months when scrolling to top or bottom
    if (scrollTop < 100) {
      setMonthOffsets((prevOffsets) => {
        const newOffsets = [
          ...Array.from({ length: 5 }, (_, i) => prevOffsets[0] - (5 - i)),
          ...prevOffsets,
        ];
        return newOffsets;
      });
    }

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setMonthOffsets((prevOffsets) => {
        const newOffsets = [
          ...prevOffsets,
          ...Array.from({ length: 5 }, (_, i) => prevOffsets[prevOffsets.length - 1] + i + 1),
        ];
        return newOffsets;
      });
    }
  };

  const renderDays = (monthOffset) => {
    // Calculate month and year dynamically
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
          {(provided, snapshot) => (
            <div
              className={`calendar-day ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ minWidth: '100px', minHeight: '100px', maxWidth: '150px', maxHeight: '150px' }}  // Set size here
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
      <button className="scroll-button" onClick={scrollToCurrentMonth}>
        Back to Current Month
      </button>
      {monthOffsets.map((offset, index) => {
        const isCurrentMonth = offset === currentMonthOffset;
        return (
          <div
            key={index}
            id={`month-${index}`}
            className={`calendar-month ${isCurrentMonth ? 'current-month' : ''}`} // Add 'current-month' class
          >
            <h3>
              {new Date(new Date().setMonth(new Date().getMonth() + offset)).toLocaleString(
                'default',
                { month: 'long', year: 'numeric' }
              )}
            </h3>
            <div className="calendar-grid">{renderDays(offset)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
