export const shouldRenderTaskOnDate = (task, currentDay) => {
    const taskDate = new Date(task.dueDate);
  
    // Check if the task is non-repeating and should be rendered on the exact due date
    if (task.repeat === 'none' || !task.repeat) {
      return taskDate.toDateString() === currentDay.toDateString();  // Compare only date, not time
    }
  
    // For repeating tasks, only render if the dueDate is <= currentDay
    if (taskDate.getTime() <= currentDay.getTime()) {
      switch (task.repeat) {
        case 'daily':
          return true; // Daily tasks should always render
        case 'weekly':
          return taskDate.getDay() === currentDay.getDay(); // Same weekday
        case 'monthly':
          return taskDate.getDate() === currentDay.getDate(); // Same day of the month
        case 'yearly':
          return taskDate.getMonth() === currentDay.getMonth() && taskDate.getDate() === currentDay.getDate(); // Same month and day
        default:
          return false;
      }
    }
    return false;
};
  

export const updateTask = (taskList, updatedTask) => {
// Find the index of the task being updated
const taskIndex = taskList.findIndex(task => task.id === updatedTask.id);

// If task exists, update it
if (taskIndex !== -1) {
    const updatedTaskList = [...taskList];
    updatedTaskList[taskIndex] = updatedTask;
    return updatedTaskList;
}

// If task doesn't exist (unlikely), return the original task list
return taskList;
};
