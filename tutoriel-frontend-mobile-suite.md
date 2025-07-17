# Tutoriel Frontend Mobile - Suite
## Écrans principaux et navigation

### 13.11 Écran d'accueil

Créer `src/screens/main/HomeScreen.js` :

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { tripsService } from '../../services/trips';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [popularTrips, setPopularTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPopularTrips();
  }, []);

  const loadPopularTrips = async () => {
    try {
      const trips = await tripsService.getAvailableTrips();
      setPopularTrips(trips.slice(0, 5)); // Afficher les 5 premiers
    } catch (error) {
      console.error('Erreur lors du chargement des voyages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', onPress: logout },
      ]
    );
  };

  const formatPrice = (price) => {
    return `${price} €`;
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Bienvenue, {user?.username || 'Utilisateur'} !
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.actionButtonText}>🔍 Rechercher un voyage</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('MyTickets')}
        >
          <Text style={styles.actionButtonText}>🎫 Mes billets</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voyages populaires</Text>
        
        {loading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : (
          popularTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => navigation.navigate('TripDetail', { tripId: trip.id })}
            >
              <View style={styles.tripInfo}>
                <Text style={styles.routeText}>
                  {trip.route?.origin} → {trip.route?.destination}
                </Text>
                <Text style={styles.timeText}>
                  {formatDateTime(trip.departureTime)}
                </Text>
                <Text style={styles.priceText}>
                  {formatPrice(trip.price)}
                </Text>
              </View>
              <View style={styles.tripMeta}>
                <Text style={styles.seatsText}>
                  {trip.availableSeats} places disponibles
                </Text>
                <Text style={styles.vehicleText}>
                  {trip.vehicle?.vehicleType}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007bff',
  },
  welcomeText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    flex: 0.45,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  tripCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripInfo: {
    marginBottom: 10,
  },
  routeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatsText: {
    fontSize: 12,
    color: '#28a745',
  },
  vehicleText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f8f9fa',
    padding: 4,
    borderRadius: 4,
  },
});

export default HomeScreen;
```

### 13.12 Écran de recherche

Créer `src/screens/main/SearchScreen.js` :

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { tripsService } from '../../services/trips';

const SearchScreen = ({ navigation }) => {
  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    departureDate: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleInputChange = (field, value) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('departureDate', selectedDate);
    }
  };

  const handleSearch = async () => {
    if (!searchForm.origin || !searchForm.destination) {
      Alert.alert('Erreur', 'Veuillez remplir l\'origine et la destination');
      return;
    }

    setLoading(true);
    try {
      const results = await tripsService.searchTrips(
        searchForm.origin,
        searchForm.destination,
        searchForm.departureDate.toISOString()
      );
      setSearchResults(results);
      setSearched(true);
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la recherche des voyages');
      console.error('Erreur de recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `${price} €`;
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchForm}>
        <Text style={styles.title}>Rechercher un voyage</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Ville de départ"
          value={searchForm.origin}
          onChangeText={(value) => handleInputChange('origin', value)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Ville d'arrivée"
          value={searchForm.destination}
          onChangeText={(value) => handleInputChange('destination', value)}
        />
        
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            Date de départ: {formatDate(searchForm.departureDate)}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={searchForm.departureDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
        
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.buttonDisabled]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? 'Recherche...' : 'Rechercher'}
          </Text>
        </TouchableOpacity>
      </View>

      {searched && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            Résultats de recherche ({searchResults.length})
          </Text>
          
          {searchResults.length === 0 ? (
            <Text style={styles.noResultsText}>
              Aucun voyage trouvé pour ces critères
            </Text>
          ) : (
            searchResults.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                style={styles.tripCard}
                onPress={() => navigation.navigate('TripDetail', { tripId: trip.id })}
              >
                <View style={styles.tripHeader}>
                  <Text style={styles.routeText}>
                    {trip.route?.origin} → {trip.route?.destination}
                  </Text>
                  <Text style={styles.priceText}>
                    {formatPrice(trip.price)}
                  </Text>
                </View>
                
                <View style={styles.tripDetails}>
                  <Text style={styles.timeText}>
                    Départ: {formatDateTime(trip.departureTime)}
                  </Text>
                  <Text style={styles.timeText}>
                    Arrivée: {formatDateTime(trip.arrivalTime)}
                  </Text>
                </View>
                
                <View style={styles.tripMeta}>
                  <Text style={styles.seatsText}>
                    {trip.availableSeats} places disponibles
                  </Text>
                  <Text style={styles.vehicleText}>
                    {trip.vehicle?.vehicleType}
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => navigation.navigate('Booking', { trip })}
                >
                  <Text style={styles.bookButtonText}>Réserver</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchForm: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsSection: {
    margin: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  tripCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  tripDetails: {
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seatsText: {
    fontSize: 12,
    color: '#28a745',
  },
  vehicleText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f8f9fa',
    padding: 4,
    borderRadius: 4,
  },
  bookButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
```

### 13.13 Écran de réservation

Créer `src/screens/main/BookingScreen.js` :

```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { ticketsService } from '../../services/tickets';

const BookingScreen = ({ route, navigation }) => {
  const { trip } = route.params;
  const { user } = useAuth();
  const [seatNumber, setSeatNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    return `${price} €`;
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBooking = async () => {
    if (!seatNumber.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un numéro de siège');
      return;
    }

    setLoading(true);
    try {
      const ticket = await ticketsService.bookTicket(
        user.id, // Vous devrez peut-être ajuster ceci selon votre implémentation
        trip.id,
        seatNumber
      );

      Alert.alert(
        'Réservation confirmée !',
        `Votre billet a été réservé avec succès.\nRéférence: ${ticket.bookingReference}`,
        [
          {
            text: 'Voir mes billets',
            onPress: () => navigation.navigate('MyTickets'),
          },
          {
            text: 'Accueil',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur de réservation', error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.tripInfo}>
        <Text style={styles.title}>Détails du voyage</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.routeText}>
            {trip.route?.origin} → {trip.route?.destination}
          </Text>
          
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>Départ:</Text>
            <Text style={styles.timeValue}>
              {formatDateTime(trip.departureTime)}
            </Text>
          </View>
          
          <View style={styles.timeInfo}>
            <Text style={styles.timeLabel}>Arrivée:</Text>
            <Text style={styles.timeValue}>
              {formatDateTime(trip.arrivalTime)}
            </Text>
          </View>
          
          <View style={styles.metaInfo}>
            <Text style={styles.vehicleInfo}>
              Véhicule: {trip.vehicle?.vehicleType} - {trip.vehicle?.vehicleNumber}
            </Text>
            <Text style={styles.seatsInfo}>
              {trip.availableSeats} places disponibles
            </Text>
          </View>
          
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Prix:</Text>
            <Text style={styles.priceValue}>
              {formatPrice(trip.price)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bookingForm}>
        <Text style={styles.formTitle}>Informations de réservation</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Numéro de siège (ex: A1, B2, etc.)"
          value={seatNumber}
          onChangeText={setSeatNumber}
          autoCapitalize="characters"
        />
        
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Résumé</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Passager:</Text>
            <Text style={styles.summaryValue}>{user?.username}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Siège:</Text>
            <Text style={styles.summaryValue}>
              {seatNumber || 'Non spécifié'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total:</Text>
            <Text style={styles.summaryValue}>
              {formatPrice(trip.price)}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.bookButton, loading && styles.buttonDisabled]}
          onPress={handleBooking}
          disabled={loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? 'Réservation...' : 'Confirmer la réservation'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tripInfo: {
    margin: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
  },
  timeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  metaInfo: {
    marginTop: 15,
    marginBottom: 15,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  seatsInfo: {
    fontSize: 14,
    color: '#28a745',
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceLabel: {
    fontSize: 16,
    color: '#333',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  bookingForm: {
    margin: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
  summary: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
```

### 13.14 Écran "Mes billets"

Créer `src/screens/main/MyTicketsScreen.js` :

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { ticketsService } from '../../services/tickets';

const MyTicketsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserTickets();
  }, []);

  const loadUserTickets = async () => {
    try {
      const userTickets = await ticketsService.getUserTickets(user.id);
      setTickets(userTickets);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger vos billets');
      console.error('Erreur lors du chargement des billets:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserTickets();
    setRefreshing(false);
  };

  const handleCancelTicket = (ticketId) => {
    Alert.alert(
      'Annuler le billet',
      'Êtes-vous sûr de vouloir annuler ce billet ?',
      [
        { text: 'Non', style: 'cancel' },
        { text: 'Oui', onPress: () => cancelTicket(ticketId) },
      ]
    );
  };

  const cancelTicket = async (ticketId) => {
    try {
      await ticketsService.cancelTicket(ticketId);
      Alert.alert('Succès', 'Billet annulé avec succès');
      loadUserTickets(); // Recharger la liste
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'annuler le billet');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'BOOKED':
        return '#ffc107';
      case 'CONFIRMED':
        return '#28a745';
      case 'CANCELLED':
        return '#dc3545';
      case 'USED':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'BOOKED':
        return 'Réservé';
      case 'CONFIRMED':
        return 'Confirmé';
      case 'CANCELLED':
        return 'Annulé';
      case 'USED':
        return 'Utilisé';
      default:
        return status;
    }
  };

  const formatPrice = (price) => {
    return `${price} €`;
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Chargement de vos billets...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Mes billets</Text>
      
      {tickets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Vous n'avez aucun billet</Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.searchButtonText}>Rechercher un voyage</Text>
          </TouchableOpacity>
        </View>
      ) : (
        tickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <Text style={styles.referenceText}>
                Ref: {ticket.bookingReference}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(ticket.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(ticket.status)}
                </Text>
              </View>
            </View>
            
            <View style={styles.tripInfo}>
              <Text style={styles.routeText}>
                {ticket.trip?.route?.origin} → {ticket.trip?.route?.destination}
              </Text>
              <Text style={styles.timeText}>
                Départ: {formatDateTime(ticket.trip?.departureTime)}
              </Text>
              <Text style={styles.timeText}>
                Arrivée: {formatDateTime(ticket.trip?.arrivalTime)}
              </Text>
            </View>
            
            <View style={styles.ticketDetails}>
              <Text style={styles.seatText}>
                Siège: {ticket.seatNumber || 'Non spécifié'}
              </Text>
              <Text style={styles.priceText}>
                Prix: {formatPrice(ticket.totalPrice)}
              </Text>
              <Text style={styles.bookingDateText}>
                Réservé le: {formatDateTime(ticket.bookingDate)}
              </Text>
            </View>
            
            {ticket.status === 'BOOKED' && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelTicket(ticket.id)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: '#333',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  referenceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tripInfo: {
    marginBottom: 15,
  },
  routeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  ticketDetails: {
    marginBottom: 15,
  },
  seatText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 3,
  },
  bookingDateText: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MyTicketsScreen;
```

### 13.15 Navigation principale

Créer `src/navigation/MainNavigator.js` :

```javascript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import BookingScreen from '../screens/main/BookingScreen';
import MyTicketsScreen from '../screens/main/MyTicketsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import TripDetailScreen from '../screens/trip/TripDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ title: 'Accueil' }}
    />
    <Stack.Screen 
      name="TripDetail" 
      component={TripDetailScreen} 
      options={{ title: 'Détails du voyage' }}
    />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Search" 
      component={SearchScreen} 
      options={{ title: 'Rechercher' }}
    />
    <Stack.Screen 
      name="Booking" 
      component={BookingScreen} 
      options={{ title: 'Réservation' }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'SearchTab') {
            iconName = 'search';
          } else if (route.name === 'MyTickets') {
            iconName = 'confirmation-number';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ title: 'Accueil' }}
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchStack} 
        options={{ title: 'Rechercher' }}
      />
      <Tab.Screen 
        name="MyTickets" 
        component={MyTicketsScreen} 
        options={{ title: 'Mes billets' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
```

### 13.16 Configuration de l'application principale

Créer `App.js` :

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import MainNavigator from './src/navigation/MainNavigator';
import { Text, View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
});

export default App;
```

### 13.17 Commandes pour lancer l'application

```bash
# Démarrer le serveur de développement
npx expo start

# Ou pour React Native CLI
npx react-native start

# Dans un autre terminal, pour Android
npx react-native run-android

# Pour iOS
npx react-native run-ios
```

### 13.18 Configuration du package.json

```json
{
  "name": "transportticketapp",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-navigation/bottom-tabs": "^6.5.7",
    "@react-navigation/native": "^6.1.6",
    "@react-navigation/stack": "^6.3.16",
    "@react-native-async-storage/async-storage": "1.17.11",
    "@react-native-community/datetimepicker": "7.2.0",
    "axios": "^1.4.0",
    "expo": "~48.0.15",
    "expo-status-bar": "~1.4.4",
    "react": "18.2.0",
    "react-native": "0.71.8",
    "react-native-gesture-handler": "~2.9.0",
    "react-native-reanimated": "~2.14.4",
    "react-native-safe-area-context": "4.5.0",
    "react-native-screens": "~3.20.0",
    "react-native-vector-icons": "^9.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  }
}
```

Cette suite du tutoriel couvre les écrans principaux de l'application mobile, la navigation, et l'intégration avec l'API backend. L'application est maintenant fonctionnelle avec toutes les fonctionnalités de base pour la vente de billets de transport.