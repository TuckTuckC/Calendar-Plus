import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      // Parse the stored JSON and convert 'dueDate' back to a Date object if needed
      return item 
        ? JSON.parse(item).map(task => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : null, // Convert dueDate back to Date object
          }))
        : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
