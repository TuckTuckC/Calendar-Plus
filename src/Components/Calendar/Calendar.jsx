import React, { useEffect, useRef, useState } from 'react';
import { shouldRenderTaskOnDate } from '../../hooks/controllers';
import TodoItem from '../TodoItem/TodoItem';
import { handleScroll } from '../../hooks/controllers';
import Day from './Day';
import './Calendar.css';

const Calendar = ({ todoList, setModalItem, setModalVisibility }) => {
  const [monthOffsets, setMonthOffsets] = useState(Array.from({ length:  7}, (_, i) => i - 3));
  const [loading, setLoading] = useState(false); // Track loading state
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

  // const handleScroll = (e) => {
  //   const { scrollTop, scrollHeight, clientHeight } = e.target;
  
  //   // Load more past months if near the top
  //   if (scrollTop < 100 && !loading) {
  //     setLoading(true);
  
  //     // Store the current scroll height and top position
  //     const previousScrollHeight = scrollHeight;
  
  //     // Add months to the top
  //     setMonthOffsets((prevOffsets) => [
  //       ...Array.from({ length: 2 }, (_, i) => prevOffsets[0] - (5 - i)),
  //       ...prevOffsets,
  //     ]);
  
  //     // Use setTimeout to wait for the DOM to update, then adjust scroll position
  //     setTimeout(() => {
  //       const newScrollHeight = calendarRef.current.scrollHeight;
  //       calendarRef.current.scrollTop = newScrollHeight - previousScrollHeight + scrollTop;
  //       setLoading(false); // Reset loading after months are added
  //     }, 0);
  //   }
  
  //   // Load more future months if near the bottom
  //   if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
  //     setLoading(true);
  //     setMonthOffsets((prevOffsets) => [
  //       ...prevOffsets,
  //       ...Array.from({ length: 2 }, (_, i) => prevOffsets[prevOffsets.length - 1] + i + 1),
  //     ]);
  //     setLoading(false);
  //   }
  // };
  
  

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
        <Day currentDay={currentDay} tasksForDay={tasksForDay} setModalItem={setModalItem} setModalVisibility={setModalVisibility}/>
      );
    }

    while (days.length < 35) {
      days.push(<div key={`empty-${month}-${days.length}`} className="calendar-day empty-day" />);
    }

    return days;
  };

  return (
    <div className="calendar-container" onScroll={(e) => handleScroll(e, loading, setLoading, setMonthOffsets, calendarRef, 5)} ref={calendarRef}>
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
