// constants.js ek utility file (Aisi file jo Bar-bar use honay wali cheezein rakhti hai) hoti hai jahan hum API URLs, routes aur storage keys ko centralize karte hain taake app maintainable, scalable aur bug-free rahe.

// Backend Api Base Url
export const API_BASE_URL = "http://localhost:3000/api";

// Api Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    PROFILE: "/auth/profile",
  },

  // Room endpoints
  ROOMS: {
    GET_ALL: "/rooms",
    CREATE: "/rooms",
    GET_BY_ID: (roomId) => `/rooms/${roomId}`,
    JOIN: (roomId) => `/rooms/${roomId}/join`,
    LEAVE: (roomId) => `/rooms/${roomId}/leave`,
    DELETE: (roomId) => `/rooms/${roomId}`,
  },
};

// LocalStorage keys
// ye use hue gi localstorage mai token and loggedin data store krne ke liye... Example (localStorage.setItem(STORAGE_KEYS.TOKEN, token))
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

// App Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  ROOM: "/room/:roomId",
  PROFILE: "/profile",
};
