import React, { useEffect, useRef, useState } from 'react';

import { Droppable, Draggable } from 'react-beautiful-dnd';
import './Calendar.css';

const Calendar = ({ todoList }) => {
  const [monthOffsets, setMonthOffsets] = useState(Array.from({ length: 21 }, (_, i) => i - 10));
  const calendarRef = useRef(null);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthOffset = 0;

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    const currentMonthElement = document.querySelector('.current-month');
    if (currentMonthElement && calendarRef.current) {
      const calendarContainer = calendarRef.current;
      const offsetTop = currentMonthElement.offsetTop;
      calendarContainer.scrollTop = offsetTop;
    }
  }, []);

  const scrollToCurrentMonth = () => {
    const currentMonthElement = document.querySelector('.current-month');
    if (currentMonthElement) {
      currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop < 100) {
      setMonthOffsets((prevOffsets) => [
        ...Array.from({ length: 5 }, (_, i) => prevOffsets[0] - (5 - i)),
        ...prevOffsets,
      ]);
    }

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setMonthOffsets((prevOffsets) => [
        ...prevOffsets,
        ...Array.from({ length: 5 }, (_, i) => prevOffsets[prevOffsets.length - 1] + i + 1),
      ]);
    }
  };

  const renderDays = (monthOffset) => {
    const month = (currentMonth + monthOffset) % 12;
    const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
    const daysInMonth = getDaysInMonth(month, year);

    const tasksForMonth = todoList.filter((task) => {
      const taskMonth = task.dueDate.getMonth();
      const taskYear = task.dueDate.getFullYear();
      return taskMonth === month && taskYear === year;
    });

    let days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayTasks = tasksForMonth.filter((task) => task.dueDate.getDate() === i);
      const sortedTasks = dayTasks.sort((a, b) => a.dueDate - b.dueDate);

      const droppableId = `day-${year}-${month + 1}-${i}`; // Unique droppableId

      days.push(
        <Droppable droppableId={droppableId} key={droppableId}>
          {(provided, snapshot) => (
            <div
              className={`calendar-day ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ minWidth: '100px', minHeight: '100px', maxWidth: '150px', maxHeight: '150px' }}
            >
              <div className="day-number">{i <= daysInMonth ? i : ''}</div>
              <div className="tasks-container">
                {sortedTasks.length > 0 ? (
                  sortedTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
                      {(provided) => (
                        <div
                          className={`task-item ${task.dueDate.getHours() === 0 ? 'all-day-task' : ''}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {task.task}
                          {task.dueDate.getHours() ? `: ${task.dueDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}` : '(All-day)'}
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <p></p>
                )}
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
            className={`calendar-month ${isCurrentMonth ? 'current-month' : ''}`}
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
