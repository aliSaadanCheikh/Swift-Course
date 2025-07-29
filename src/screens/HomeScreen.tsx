import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList, Route } from '../types';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../services/api';

type HomeScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPopularRoutes();
  }, []);

  const loadPopularRoutes = async () => {
    try {
      setIsLoading(true);
      // Pour l'instant, on charge toutes les routes
      // En production, vous pourriez avoir un endpoint spécifique pour les routes populaires
      const routes = await ApiService.getRoutes();
      setPopularRoutes(routes.slice(0, 5)); // Prendre les 5 premières
    } catch (error) {
      console.error('Erreur lors du chargement des routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPopularRoutes();
    setRefreshing(false);
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'BUS':
        return 'bus-outline';
      case 'TRAIN':
        return 'train-outline';
      case 'PLANE':
        return 'airplane-outline';
      default:
        return 'location-outline';
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Format HH:MM
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* En-tête de bienvenue */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.username || 'Utilisateur'} !</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Ionicons name="search-outline" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Rechercher</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('MyTickets')}
            >
              <Ionicons name="ticket-outline" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Mes Billets</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Profil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Routes populaires */}
        <View style={styles.popularRoutes}>
          <Text style={styles.sectionTitle}>Routes populaires</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : popularRoutes.length > 0 ? (
            popularRoutes.map((route) => (
              <TouchableOpacity
                key={route.id}
                style={styles.routeCard}
                onPress={() => {
                  // Navigation vers les détails de la route
                  // navigation.navigate('RouteDetails', { route });
                }}
              >
                <View style={styles.routeHeader}>
                  <View style={styles.routeInfo}>
                    <Ionicons
                      name={getTransportIcon(route.transportType) as any}
                      size={20}
                      color="#007AFF"
                    />
                    <Text style={styles.companyName}>{route.companyName}</Text>
                  </View>
                  <Text style={styles.routePrice}>{route.price}€</Text>
                </View>

                <View style={styles.routeDetails}>
                  <View style={styles.cityContainer}>
                    <Text style={styles.cityName}>{route.departureCity}</Text>
                    <Text style={styles.timeText}>{formatTime(route.departureTime)}</Text>
                  </View>

                  <View style={styles.routeArrow}>
                    <Ionicons name="arrow-forward-outline" size={20} color="#666" />
                  </View>

                  <View style={styles.cityContainer}>
                    <Text style={styles.cityName}>{route.arrivalCity}</Text>
                    <Text style={styles.timeText}>{formatTime(route.arrivalTime)}</Text>
                  </View>
                </View>

                <View style={styles.routeFooter}>
                  <Text style={styles.seatsText}>
                    {route.availableSeats} places disponibles
                  </Text>
                  <Text style={styles.transportType}>{route.transportType}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="bus-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Aucune route disponible</Text>
            </View>
          )}
        </View>

        {/* Conseils */}
        <View style={styles.tips}>
          <Text style={styles.sectionTitle}>Conseils</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={24} color="#FFA500" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Réservez à l'avance</Text>
              <Text style={styles.tipText}>
                Obtenez les meilleurs prix en réservant vos billets à l'avance.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    padding: 8,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minWidth: 80,
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  popularRoutes: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  routePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cityContainer: {
    flex: 1,
    alignItems: 'center',
  },
  cityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  routeArrow: {
    paddingHorizontal: 15,
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatsText: {
    fontSize: 12,
    color: '#666',
  },
  transportType: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  tips: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tipContent: {
    flex: 1,
    marginLeft: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default HomeScreen;