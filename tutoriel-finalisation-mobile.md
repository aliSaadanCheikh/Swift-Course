# Tutoriel Mobile - Finalisation
## Écrans finaux et déploiement

### 13.19 Écran de profil

Créer `src/screens/main/ProfileScreen.js` :

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Charger les données du profil utilisateur
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Ici, vous pourriez ajouter la logique pour sauvegarder les modifications
    Alert.alert('Succès', 'Profil mis à jour avec succès');
    setIsEditing(false);
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Profil</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.username}>@{user?.username}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              editable={isEditing}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profileData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Sauvegarder</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Modifier le profil</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionText}>Historique des voyages</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionText}>Paramètres</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionText}>Aide et support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Text style={styles.actionText}>À propos</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputDisabled: {
    backgroundColor: '#f8f9fa',
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
```

### 13.20 Écran de détail d'un voyage

Créer `src/screens/trip/TripDetailScreen.js` :

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
import { tripsService } from '../../services/trips';

const TripDetailScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTripDetails();
  }, []);

  const loadTripDetails = async () => {
    try {
      const tripData = await tripsService.getTripById(tripId);
      setTrip(tripData);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les détails du voyage');
      navigation.goBack();
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleBooking = () => {
    if (trip.availableSeats <= 0) {
      Alert.alert('Indisponible', 'Plus de places disponibles pour ce voyage');
      return;
    }
    navigation.navigate('Booking', { trip });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Voyage non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.routeText}>
          {trip.route?.origin} → {trip.route?.destination}
        </Text>
        <Text style={styles.priceText}>
          {formatPrice(trip.price)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informations du voyage</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Départ :</Text>
          <Text style={styles.infoValue}>
            {formatDateTime(trip.departureTime)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Arrivée :</Text>
          <Text style={styles.infoValue}>
            {formatDateTime(trip.arrivalTime)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Durée :</Text>
          <Text style={styles.infoValue}>
            {calculateDuration(trip.departureTime, trip.arrivalTime)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Distance :</Text>
          <Text style={styles.infoValue}>
            {trip.route?.distanceKm} km
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Véhicule</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type :</Text>
          <Text style={styles.infoValue}>
            {trip.vehicle?.vehicleType}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Numéro :</Text>
          <Text style={styles.infoValue}>
            {trip.vehicle?.vehicleNumber}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Capacité :</Text>
          <Text style={styles.infoValue}>
            {trip.vehicle?.capacity} places
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Disponibilité</Text>
        
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityText}>
            {trip.availableSeats} places disponibles
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: trip.availableSeats > 0 ? '#28a745' : '#dc3545' }
          ]}>
            <Text style={styles.statusText}>
              {trip.availableSeats > 0 ? 'Disponible' : 'Complet'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.bookButton,
          trip.availableSeats <= 0 && styles.bookButtonDisabled
        ]}
        onPress={handleBooking}
        disabled={trip.availableSeats <= 0}
      >
        <Text style={styles.bookButtonText}>
          {trip.availableSeats > 0 ? 'Réserver ce voyage' : 'Voyage complet'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    alignItems: 'center',
  },
  routeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: 16,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#007bff',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TripDetailScreen;
```

### 13.21 Constantes et utilitaires

Créer `src/utils/constants.js` :

```javascript
// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000,
};

// Couleurs de l'application
export const COLORS = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  background: '#f5f5f5',
};

// Tailles de police
export const FONT_SIZES = {
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 20,
  title: 24,
};

// Statuts des billets
export const TICKET_STATUS = {
  BOOKED: 'BOOKED',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  USED: 'USED',
};

// Types de véhicules
export const VEHICLE_TYPES = {
  BUS: 'BUS',
  TRAIN: 'TRAIN',
  METRO: 'METRO',
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  UNAUTHORIZED: 'Session expirée, veuillez vous reconnecter',
  SERVER_ERROR: 'Erreur du serveur, veuillez réessayer',
  VALIDATION_ERROR: 'Données invalides',
};
```

Créer `src/utils/helpers.js` :

```javascript
import { COLORS, TICKET_STATUS } from './constants';

export const formatPrice = (price) => {
  return `${price} €`;
};

export const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatTime = (time) => {
  return new Date(time).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case TICKET_STATUS.BOOKED:
      return COLORS.warning;
    case TICKET_STATUS.CONFIRMED:
      return COLORS.success;
    case TICKET_STATUS.CANCELLED:
      return COLORS.danger;
    case TICKET_STATUS.USED:
      return COLORS.secondary;
    default:
      return COLORS.secondary;
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case TICKET_STATUS.BOOKED:
      return 'Réservé';
    case TICKET_STATUS.CONFIRMED:
      return 'Confirmé';
    case TICKET_STATUS.CANCELLED:
      return 'Annulé';
    case TICKET_STATUS.USED:
      return 'Utilisé';
    default:
      return status;
  }
};

export const calculateDuration = (startTime, endTime) => {
  const diff = new Date(endTime) - new Date(startTime);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const generateBookingReference = () => {
  return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
};
```

### 13.22 Gestion des erreurs globales

Créer `src/utils/errorHandler.js` :

```javascript
import { Alert } from 'react-native';
import { ERROR_MESSAGES } from './constants';

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Erreur de réponse du serveur
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return 'Accès refusé';
      case 404:
        return 'Ressource non trouvée';
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return data.message || ERROR_MESSAGES.SERVER_ERROR;
    }
  } else if (error.request) {
    // Erreur de réseau
    return ERROR_MESSAGES.NETWORK_ERROR;
  } else {
    // Autre erreur
    return error.message || 'Une erreur inattendue s\'est produite';
  }
};

export const showErrorAlert = (error) => {
  const message = handleApiError(error);
  Alert.alert('Erreur', message);
};
```

### 13.23 Configuration pour la production

Créer `app.json` :

```json
{
  "expo": {
    "name": "Transport Tickets",
    "slug": "transport-tickets",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#007bff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.transport.tickets"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#007bff"
      },
      "package": "com.transport.tickets"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### 13.24 Build et déploiement

#### Pour Expo :

```bash
# Installer EAS CLI
npm install -g @expo/eas-cli

# Se connecter à Expo
eas login

# Configurer le projet
eas build:configure

# Build pour Android
eas build --platform android

# Build pour iOS
eas build --platform ios

# Publier sur Expo
expo publish
```

#### Pour React Native CLI :

```bash
# Build pour Android
cd android
./gradlew assembleRelease

# Build pour iOS
cd ios
xcodebuild -workspace TransportTicketApp.xcworkspace -scheme TransportTicketApp -configuration Release archive
```

### 13.25 Tests de l'application mobile

Créer `src/__tests__/services/auth.test.js` :

```javascript
import { authService } from '../../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock axios
jest.mock('axios');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token',
          user: { id: 1, username: 'testuser' }
        }
      };

      // Mock API response
      require('axios').post.mockResolvedValue(mockResponse);

      const result = await authService.login('testuser', 'password');

      expect(result).toEqual(mockResponse.data);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'mock-token');
    });

    it('should handle login error', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' }
        }
      };

      require('axios').post.mockRejectedValue(mockError);

      await expect(authService.login('testuser', 'wrongpassword'))
        .rejects.toEqual(mockError.response.data);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      await authService.logout();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userData');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', async () => {
      AsyncStorage.getItem.mockResolvedValue('mock-token');

      const result = await authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when token does not exist', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
```

### 13.26 Scripts de déploiement

Créer `scripts/deploy.sh` :

```bash
#!/bin/bash

echo "🚀 Déploiement de l'application Transport Tickets..."

# Vérifier que le backend est en cours d'exécution
echo "📡 Vérification du backend..."
if ! curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "❌ Le backend n'est pas accessible. Veuillez le démarrer d'abord."
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Exécuter les tests
echo "🧪 Exécution des tests..."
npm test

# Build pour production
echo "🏗️ Build de l'application..."
if command -v eas &> /dev/null; then
    echo "Building with EAS..."
    eas build --platform all
else
    echo "Building with Expo..."
    expo build:android
    expo build:ios
fi

echo "✅ Déploiement terminé avec succès!"
```

### 13.27 Documentation finale

Créer `README-Mobile.md` :

```markdown
# Transport Tickets Mobile App

Application mobile React Native pour la vente de billets de transport.

## Fonctionnalités

- ✅ Authentification (connexion/inscription)
- ✅ Recherche de voyages
- ✅ Réservation de billets
- ✅ Gestion des billets
- ✅ Profil utilisateur
- ✅ Interface responsive

## Prérequis

- Node.js 14+
- React Native CLI ou Expo CLI
- Android Studio (pour Android)
- Xcode (pour iOS)

## Installation

1. Cloner le projet
```bash
git clone <repository-url>
cd TransportTicketApp
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer l'API
- Modifier `src/services/api.js` avec l'URL de votre backend
- Démarrer le backend Java sur `http://localhost:8080`

4. Lancer l'application
```bash
# Avec Expo
npx expo start

# Avec React Native CLI
npx react-native start
npx react-native run-android # ou run-ios
```

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── screens/        # Écrans de l'application
├── services/       # Services API
├── navigation/     # Configuration de navigation
├── context/        # Contextes React
├── utils/          # Utilitaires et helpers
└── styles/         # Styles globaux
```

## Configuration

### Variables d'environnement

Créer un fichier `.env` :

```
API_BASE_URL=http://localhost:8080/api
API_TIMEOUT=10000
```

### Personnalisation

- Couleurs : `src/utils/constants.js`
- Styles : `src/styles/`
- Configuration API : `src/services/api.js`

## Tests

```bash
# Exécuter les tests
npm test

# Tests avec coverage
npm run test:coverage
```

## Déploiement

### Android

```bash
# Build APK
cd android
./gradlew assembleRelease

# Ou avec EAS
eas build --platform android
```

### iOS

```bash
# Build avec Xcode
cd ios
xcodebuild -workspace TransportTicketApp.xcworkspace -scheme TransportTicketApp -configuration Release archive

# Ou avec EAS
eas build --platform ios
```

## Dépannage

### Problèmes courants

1. **Erreur de connexion API**
   - Vérifier que le backend est démarré
   - Vérifier l'URL dans `src/services/api.js`

2. **Erreur de build Android**
   - Nettoyer le projet : `cd android && ./gradlew clean`
   - Vérifier Android SDK

3. **Erreur de build iOS**
   - Nettoyer Xcode : `Product > Clean Build Folder`
   - Vérifier les certificats

## Support

Pour toute question ou problème, consultez la documentation ou créez une issue.
```

## Conclusion

Ce tutoriel complet vous a guidé à travers la création d'une application mobile complète avec React Native pour la vente de billets de transport. L'application inclut :

### ✅ Fonctionnalités implémentées :
- Authentification complète (connexion/inscription)
- Recherche de voyages avec filtres
- Réservation de billets en temps réel
- Gestion des billets (annulation, statuts)
- Profil utilisateur éditable
- Navigation intuitive avec onglets
- Gestion des erreurs et loading states
- Interface responsive et moderne

### 🛠️ Technologies utilisées :
- React Native / Expo
- React Navigation
- AsyncStorage pour la persistance
- Axios pour les appels API
- Context API pour la gestion d'état
- JWT pour l'authentification

### 📱 Prêt pour la production :
- Configuration de build Android/iOS
- Tests unitaires
- Gestion des erreurs
- Documentation complète
- Scripts de déploiement

Cette application mobile s'intègre parfaitement avec le backend Java développé précédemment, formant une solution complète pour la vente de billets de transport.