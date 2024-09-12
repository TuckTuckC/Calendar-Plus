import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { format, startOfMonth, getDaysInMonth, addMonths, subMonths } from 'date-fns';
import './Calendar.css';

const Calendar = ({ calendarTasks }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Helper function to get month names and days
  const getMonthDetails = (monthOffset) => {
    const monthDate = addMonths(startOfMonth(new Date(currentYear, currentMonth)), monthOffset);
    const monthName = format(monthDate, 'MMMM yyyy');
    const daysInMonth = getDaysInMonth(monthDate);
    return { monthDate, monthName, daysInMonth };
  };

  // Create an array of months (-3 to +3 around the current month)
  const monthsArray = Array.from({ length: 7 }, (_, i) => getMonthDetails(i - 3));

  return (
    <div className="calendar-container">
      {monthsArray.map((month, monthIndex) => (
        <div className="month-container" key={monthIndex}>
          <h3>{month.monthName}</h3>
          <div className="calendar">
            {Array.from({ length: 31 }, (_, dayIndex) => (
              <Droppable key={dayIndex} droppableId={`day-${monthIndex}-${dayIndex}`}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="calendar-day">
                    {dayIndex < month.daysInMonth ? (
                      <>
                        <p>{dayIndex + 1}</p>
                        {calendarTasks[monthIndex]?.[dayIndex]?.map((task, taskIndex) => (
                          <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="calendar-task"
                              >
                                {task.text}
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </>
                    ) : (
                      <p className="empty-day"></p> // Empty squares for days that don't exist
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Calendar;
