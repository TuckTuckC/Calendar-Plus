import React, { useState } from 'react';
import { updateTask } from '../../hooks/controllers';
import './TodoItemModal.css';

function TodoItemModal({ modalVisibility, task, setModalVisibility, todoList, setTodoList }) {
    const [showDates, setShowDates] = useState(false);
    const [taskName, setTaskName] = useState(task?.task || '');
    const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '');
    const [dueTime, setDueTime] = useState(task?.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

    // Check if task exists before trying to render the modal content
    if (!task) {
        return null; // If no task, render nothing
    }

    const handleSave = () => {
        // Ensure the dueDate and dueTime are provided and create a Date object
        let dueDateTime;
        
        // If both dueDate and dueTime are provided, create the full Date object
        if (dueDate && dueTime) {
            dueDateTime = new Date(`${dueDate}T${dueTime}:00`); // Ensure time is in HH:mm:ss format
        } else if (dueDate) {
            // If only dueDate is provided, set the time to 00:00:00 (midnight)
            dueDateTime = new Date(`${dueDate}T00:00:00`);
        } else {
            // Fallback to the task's existing dueDate if nothing is provided
            dueDateTime = task.dueDate;
        }
    
        // Validate that the created date is valid
        if (isNaN(dueDateTime.getTime())) {
            console.error('Invalid date:', dueDateTime);
            return;
        }
    
        // Create the updated task object
        const updatedTask = {
            ...task,
            task: taskName,
            dueDate: dueDateTime // Use the parsed dueDateTime
        };

        console.log(updatedTask);
        
    
        // Update the todo list using the updateTask function
        const updatedTodoList = updateTask(todoList, updatedTask);
        setTodoList(updatedTodoList);
    
        // Close the modal after saving
        setModalVisibility(false);
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
        <div className="itemModal" style={{ visibility: modalVisibility ? 'visible' : 'hidden' }}>
            <button className='exitBtn' onClick={() => setModalVisibility(false)}>X</button>
            <h2>Edit Task</h2>

            <label htmlFor="taskName">Task Name</label>
            <input
                type="text"
                id="taskName"
                defaultValue={task.task}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
            />

            <label htmlFor="dueDate">Due Date</label>
            <input
                type="date"
                id="dueDate"
                defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : ''}
                onChange={(e) => setDueDate(e.target.value)}
            />

            <label htmlFor="dueTime">Due Time</label>
            <input
                type="time"
                id="dueTime"
                defaultValue={task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                onChange={(e) => setDueTime(e.target.value)}
            />

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

            <button className="save-btn" onClick={() => handleSave()}>Save</button>
        </div>
    );
}

export default TodoItemModal;
