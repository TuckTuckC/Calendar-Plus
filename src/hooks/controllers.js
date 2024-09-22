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

export const handleScroll = (e, loading, setLoading, setOffsets, containerRef, offsetUnit = 15) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;

  // Load more items (months/tasks) if near the top
  if (scrollTop < 100 && !loading) {
    setLoading(true);

    // Store the current scroll height and top position
    const previousScrollHeight = scrollHeight;

    // Add items (months/tasks) to the top
    setOffsets((prevOffsets) => [
      ...Array.from({ length: 2 }, (_, i) => prevOffsets[0] - (offsetUnit - i)),
      ...prevOffsets,
    ]);

    // Use setTimeout to wait for the DOM to update, then adjust scroll position
    setTimeout(() => {
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop = newScrollHeight - previousScrollHeight + scrollTop;
      setLoading(false); // Reset loading after items are added
    }, 0);
  }

  // Load more items (months/tasks) if near the bottom
  if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
    setLoading(true);
    
    // Add items (months/tasks) to the bottom
    setOffsets((prevOffsets) => [
      ...prevOffsets,
      ...Array.from({ length: 2 }, (_, i) => prevOffsets[prevOffsets.length - 1] + i + 1),
    ]);

    setLoading(false); // Reset loading after items are added
  }
};

export const handleScrollTodoList = (e, loading, setLoading, setDaysOffset, scrollContainerRef, increment) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;

  // Load more past days if near the top
  if (scrollTop < 100 && !loading) {
    setLoading(true);

    setDaysOffset((prevState) => ({
      ...prevState,
      past: prevState.past + increment, // Increment the past offset
    }));

    // Adjust scroll position to prevent "jumping" after days are loaded
    setTimeout(() => {
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      scrollContainerRef.current.scrollTop = scrollTop + (newScrollHeight - scrollHeight);
      setLoading(false);
    }, 0);
  }

  // Load more future days if near the bottom
  if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
    setLoading(true);

    setDaysOffset((prevState) => ({
      ...prevState,
      future: prevState.future + increment, // Increment the future offset
    }));

    setLoading(false);
  }
};

