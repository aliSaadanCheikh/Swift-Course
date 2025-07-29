// Types pour l'authentification
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
}

// Types pour les routes de transport
export interface Route {
  id: number;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  transportType: 'BUS' | 'TRAIN' | 'PLANE';
  companyName: string;
  availableSeats: number;
  description?: string;
  active: boolean;
}

// Types pour les billets
export interface Ticket {
  id: number;
  ticketNumber: string;
  route: Route;
  user: User;
  travelDate: string;
  quantity: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'USED';
  passengerName?: string;
  passengerPhone?: string;
  specialRequests?: string;
  purchaseDate: string;
}

export interface TicketPurchase {
  routeId: number;
  travelDate: string;
  quantity: number;
  passengerName?: string;
  passengerPhone?: string;
  specialRequests?: string;
}

// Types pour la recherche
export interface SearchFilters {
  departureCity: string;
  arrivalCity: string;
  departureDate?: string;
  transportType?: 'BUS' | 'TRAIN' | 'PLANE';
  minPrice?: number;
  maxPrice?: number;
}

// Types pour la navigation
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  RouteDetails: { route: Route };
  TicketPurchase: { route: Route };
  Payment: { ticket: TicketPurchase; route: Route };
  TicketDetails: { ticket: Ticket };
  Profile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  MyTickets: undefined;
  Profile: undefined;
};

// Types pour les erreurs API
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}