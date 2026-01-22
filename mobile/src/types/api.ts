// API response types

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  emailVerified: boolean;
  role: 'user' | 'organizer' | 'admin';
  createdAt: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  image?: string;
  gallery?: string[];
  price: {
    min: number;
    max: number;
    currency: string;
  };
  organizer: {
    id: string;
    name: string;
  };
  ticketCount: {
    total: number;
    available: number;
    sold: number;
  };
  status: 'draft' | 'published' | 'cancelled' | 'completed';
}

// Ticket types
export interface Ticket {
  id: string;
  event: {
    id: string;
    title: string;
    startDate: string;
    image?: string;
  };
  ticketType: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  qrCode?: string;
  purchasedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}
