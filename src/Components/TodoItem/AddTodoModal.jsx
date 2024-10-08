import React, { useState, useEffect } from 'react'
import './TodoItemModal.css'

function AddTodoModal({ addModalVisibility, setAddModalVisibility, setDueDate, setDueTime, handleAddTodo, setInputValue, repeatOption, setRepeatOption }) {

    const [isVisible, setIsVisible] = useState(false); // Control visibility for animation

    console.log(isVisible);


    const handleAdd = () => {
        handleAddTodo()
        setAddModalVisibility(false)
    }

    useEffect(() => {
        if (addModalVisibility) {
            setIsVisible(true); // When modal becomes visible, start animation
        } else {
            // After animation duration, actually hide modal
            const timeout = setTimeout(() => setIsVisible(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [addModalVisibility]);

    return (
        <div className={`modal-container ${addModalVisibility ? 'modal-visible' : 'modal-hidden'}`}
            style={{ display: isVisible ? 'flex' : 'none' }}>
            <div
                className={`itemModal ${addModalVisibility ? 'modal-visible' : 'modal-hidden'}`}
            >
                <button className='exitBtn' onClick={() => setAddModalVisibility(false)}>X</button>
                <h2>Add Task</h2>

                <label htmlFor="taskName">Task Name</label>
                <input
                    type="text"
                    id="taskName"
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter task name"
                />

                <label htmlFor="dueDate">Due Date</label>
                <input
                    type="date"
                    id="dueDate"
                    onChange={(e) => setDueDate(e.target.value)}
                />

                <label htmlFor="dueTime">Due Time</label>
                <input
                    type="time"
                    id="dueTime"
                    onChange={(e) => setDueTime(e.target.value)}
                />

                <select value={repeatOption} onChange={(e) => setRepeatOption(e.target.value)}>
                    <option value="none">Does not repeat</option>
                    <option value="daily">Every day</option>
                    <option value="weekly">Every week</option>
                    <option value="monthly">Every month</option>
                    <option value="yearly">Every year</option>
                </select>

                <button className="save-btn" onClick={handleAdd}>Add</button>
            </div>
        </div>
    );
}

export default AddTodoModal