// App constants

export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
  VERSION: process.env.API_VERSION || 'v1',
  TIMEOUT: 30000,
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

export const ROUTES = {
  AUTH: {
    LOGIN: 'Login',
    SIGNUP: 'SignUp',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
  MAIN: {
    HOME: 'Home',
    EVENTS: 'Events',
    TICKETS: 'Tickets',
    PROFILE: 'Profile',
  },
  EVENTS: {
    LIST: 'EventList',
    DETAIL: 'EventDetail',
    SEARCH: 'Search',
  },
  TICKETS: {
    LIST: 'TicketList',
    DETAIL: 'TicketDetail',
    CHECKOUT: 'Checkout',
  },
};
