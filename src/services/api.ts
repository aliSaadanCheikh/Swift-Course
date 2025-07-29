import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  Route, 
  Ticket, 
  TicketPurchase, 
  SearchFilters,
  ApiResponse 
} from '../types';

// Configuration de base de l'API
const BASE_URL = 'http://localhost:8080/api'; // Changez cette URL selon votre configuration

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'authentification
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les réponses et les erreurs
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expiré, déconnecter l'utilisateur
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  // Services d'authentification
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/signin', credentials);
    const authData = response.data;
    
    // Sauvegarder le token
    await AsyncStorage.setItem('authToken', authData.accessToken);
    await AsyncStorage.setItem('user', JSON.stringify({
      id: authData.userId,
      username: authData.username,
      email: authData.email
    }));
    
    return authData;
  }

  async register(userData: RegisterData): Promise<string> {
    const response: AxiosResponse<{ message: string }> = await this.api.post('/auth/signup', userData);
    return response.data.message;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  }

  // Services pour les routes
  async getRoutes(): Promise<Route[]> {
    const response: AxiosResponse<ApiResponse<Route[]>> = await this.api.get('/routes');
    return response.data.data;
  }

  async getRouteById(id: number): Promise<Route> {
    const response: AxiosResponse<ApiResponse<Route>> = await this.api.get(`/routes/${id}`);
    return response.data.data;
  }

  async searchRoutes(filters: SearchFilters): Promise<Route[]> {
    const params = new URLSearchParams();
    
    if (filters.departureCity) params.append('departureCity', filters.departureCity);
    if (filters.arrivalCity) params.append('arrivalCity', filters.arrivalCity);
    if (filters.departureDate) params.append('departureDate', filters.departureDate);
    if (filters.transportType) params.append('transportType', filters.transportType);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    const response: AxiosResponse<ApiResponse<Route[]>> = await this.api.get(`/routes/search?${params}`);
    return response.data.data;
  }

  // Services pour les billets
  async purchaseTicket(ticketData: TicketPurchase): Promise<Ticket> {
    const response: AxiosResponse<ApiResponse<Ticket>> = await this.api.post('/tickets/purchase', ticketData);
    return response.data.data;
  }

  async getUserTickets(): Promise<Ticket[]> {
    const response: AxiosResponse<ApiResponse<Ticket[]>> = await this.api.get('/tickets/my-tickets');
    return response.data.data;
  }

  async getTicketById(id: number): Promise<Ticket> {
    const response: AxiosResponse<ApiResponse<Ticket>> = await this.api.get(`/tickets/${id}`);
    return response.data.data;
  }

  async cancelTicket(id: number): Promise<string> {
    const response: AxiosResponse<{ message: string }> = await this.api.put(`/tickets/${id}/cancel`);
    return response.data.message;
  }

  // Service pour vérifier si l'utilisateur est connecté
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  }

  // Service pour obtenir l'utilisateur actuel
  async getCurrentUser(): Promise<any> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Service pour les paiements (intégration avec Stripe)
  async createPaymentIntent(amount: number, currency: string = 'eur'): Promise<{ clientSecret: string }> {
    const response: AxiosResponse<{ clientSecret: string }> = await this.api.post('/payments/create-intent', {
      amount: amount * 100, // Stripe utilise les centimes
      currency
    });
    return response.data;
  }

  async confirmPayment(paymentIntentId: string, ticketId: number): Promise<string> {
    const response: AxiosResponse<{ message: string }> = await this.api.post('/payments/confirm', {
      paymentIntentId,
      ticketId
    });
    return response.data.message;
  }
}

export default new ApiService();