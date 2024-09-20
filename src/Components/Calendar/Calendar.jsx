import React, { useEffect, useRef, useState } from 'react';
import { shouldRenderTaskOnDate } from '../../hooks/controllers';
import TodoItem from '../TodoItem/TodoItem';
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
    const adjustedDate = new Date(currentYear, currentMonth + monthOffset, 1);
    const month = adjustedDate.getMonth();
    const year = adjustedDate.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfWeek = adjustedDate.getDay();

    let days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${month}-${i}`} className="calendar-day empty-day" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(year, month, i);
      currentDay.setHours(0, 0, 0, 0);
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

      const tasksForDay = todoList.filter((task) => shouldRenderTaskOnDate(task, currentDay));

      days.push(
        <div key={`day-${year}-${month + 1}-${i}`} className="calendar-day">
          <div className="day-number">{i}</div>
          <div className="tasks-container">
            {tasksForDay.length > 0 ? tasksForDay.map((task, index) => (
              <TodoItem task={task} key={task.id} />
            )) : <p></p>}
          </div>
        </div>
      );
    }

    while (days.length < 35) {
      days.push(<div key={`empty-${month}-${days.length}`} className="calendar-day empty-day" />);
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
          <div key={index} id={`month-${index}`} className={`calendar-month ${isCurrentMonth ? 'current-month' : ''}`}>
            <h3>
              {new Date(new Date().setMonth(new Date().getMonth() + offset)).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="calendar-grid">{renderDays(offset)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
