/*
 * ============================================
 * CONSTANTS - App-wide Configuration
 * ============================================
 * 
 * This file stores all constant values used throughout the app.
 * Having them in one place makes the app easier to maintain.
 * 
 * If you need to change the backend URL or add new routes,
 * you only need to update this file!
 */

// ============================================
// LOCALSTORAGE KEYS
// ============================================
// Keys used to store data in browser's localStorage

export const STORAGE_KEYS = {
  TOKEN: "token",     // Authentication token
  USER: "user",       // User information
};

// ============================================
// PROGRAMMING LANGUAGES
// ============================================
// Supported languages for code editor

export const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "typescript", label: "TypeScript" },
];

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_LANGUAGE = "javascript";
export const DEFAULT_CODE = "// Start coding here...";
