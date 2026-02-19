import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for merging class names
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format a date string into "Mon YYYY" or just "Mon"
export function formatDate(dateString, showMonthOnly = false) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  
  return showMonthOnly ? month : `${month} ${year}`;
}

// Generate a random ID string
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Download a JavaScript object as JSON file
export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'cv-data.json';
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// Read a JSON file and parse its content
export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}