import React, { useState } from 'react'
import './TodoItemModal.css'

function AddTodoModal({addModalVisibility, setAddModalVisibility, setDueDate, setDueTime, handleAddTodo, setInputValue}) {

    const [taskName, setTaskName] = useState('');
    const [isVisible, setIsVisible] = useState(false); // Control visibility for animation

    const handleAdd = () => {
        handleAddTodo()
        setAddModalVisibility(false)
    }

    return (
        <div
            className={`itemModal ${addModalVisibility === true ? 'modal-visible' : 'modal-hidden'}`}
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

            <button className="save-btn" onClick={handleAdd}>Add</button>
        </div>
    );
}

export default AddTodoModal