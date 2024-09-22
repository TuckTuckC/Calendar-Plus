import React, { useState, useEffect } from 'react';
import { updateTask } from '../../hooks/controllers';
import './TodoItemModal.css';

function TodoItemModal({ modalVisibility, task, setModalVisibility, todoList, setTodoList }) {
    const [showDates, setShowDates] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [isVisible, setIsVisible] = useState(false); // Control visibility for animation

    useEffect(() => {
        if (task) {
            // Update the state when the task changes
            setTaskName(task?.task || '');
            setDueDate(task?.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '');
            setDueTime(task?.dueTime || ''); // Use the dueTime field directly
        }
    }, [task]); // Re-run the effect whenever `task` changes

    useEffect(() => {
        if (modalVisibility) {
            setIsVisible(true); // When modal becomes visible, start animation
        } else {
            // After animation duration, actually hide modal
            const timeout = setTimeout(() => setIsVisible(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [modalVisibility]);

    if (!task && !isVisible) {
        return null; // If no task or modal should be hidden, render nothing
    }

    const handleSave = () => {
        let dueDateTime;
        if (dueDate && dueTime) {
            // Use the dueDate and dueTime to construct the full datetime object
            dueDateTime = new Date(`${dueDate}T${dueTime}:00`);
        } else if (dueDate) {
            // If no dueTime is provided, use the default time (midnight)
            dueDateTime = new Date(`${dueDate}T00:00:00`);
        } else {
            // If no dueDate is provided, keep the original dueDate
            dueDateTime = task.dueDate;
        }

        if (isNaN(dueDateTime.getTime())) {
            console.error('Invalid date:', dueDateTime);
            return;
        }

        const updatedTask = {
            ...task,
            task: taskName,
            dueDate: dueDateTime,
            dueTime: dueTime ? dueTime : null, // Ensure dueTime is stored, or set to null if empty
        };

        const updatedTodoList = updateTask(todoList, updatedTask);
        setTodoList(updatedTodoList);
        setModalVisibility(false); // Trigger the close animation
    };

    const generateFutureDueDates = (task) => {
        const futureDates = [];
        const currentDate = new Date();
        let dueDate = new Date(task.dueDate);

        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

        while (dueDate <= threeMonthsFromNow) {
            if (dueDate >= currentDate) {
                futureDates.push(new Date(dueDate)); 
            }

            switch (task.repeat) {
                case 'daily':
                    dueDate.setDate(dueDate.getDate() + 1);
                    break;
                case 'weekly':
                    dueDate.setDate(dueDate.getDate() + 7);
                    break;
                case 'monthly':
                    dueDate.setMonth(dueDate.getMonth() + 1);
                    break;
                case 'yearly':
                    dueDate.setFullYear(dueDate.getFullYear() + 1);
                    break;
                default:
                    return futureDates;
            }
        }

        return futureDates;
    };

    const futureDueDates = generateFutureDueDates(task);
    const handleToggleDates = () => {
        setShowDates(prevState => !prevState);
    };

    return (
        <div
            className={`itemModal ${modalVisibility ? 'modal-visible' : 'modal-hidden'}`}
            style={{ display: isVisible ? 'flex' : 'none' }} // Ensures modal is removed after hide animation
        >
            <button className='exitBtn' onClick={() => setModalVisibility(false)}>X</button>
            <h2>Edit Task</h2>

            <label htmlFor="taskName">Task Name</label>
            <input
                type="text"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
            />

            <label htmlFor="dueDate">Due Date</label>
            <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />

            <label htmlFor="dueTime">Due Time</label>
            <input
                type="time"
                id="dueTime"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
            />

            {/* Conditionally render the "Later Dates" button if the task repeats */}
            {task.repeat !== 'none' && (
                <div className="dropdown">
                    <button className="dropdown-btn" onClick={handleToggleDates}>
                        {showDates ? 'Hide Later Dates' : 'Show Later Dates'}
                    </button>
                    {showDates && (
                        <ul className="dropdown-content">
                            {futureDueDates.map((date, index) => (
                                <li key={index}>{new Date(date).toLocaleDateString()}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
    );
}

export default TodoItemModal;
