import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, MainTabParamList } from '../types';

// Import des écrans
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MyTicketsScreen from '../screens/MyTicketsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RouteDetailsScreen from '../screens/RouteDetailsScreen';
import TicketPurchaseScreen from '../screens/TicketPurchaseScreen';
import PaymentScreen from '../screens/PaymentScreen';
import TicketDetailsScreen from '../screens/TicketDetailsScreen';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Navigation par onglets pour les utilisateurs connectés
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'MyTickets':
              iconName = focused ? 'ticket' : 'ticket-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ tabBarLabel: 'Rechercher' }}
      />
      <Tab.Screen 
        name="MyTickets" 
        component={MyTicketsScreen} 
        options={{ tabBarLabel: 'Mes Billets' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

// Navigation principale de l'application
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          // Écrans pour les utilisateurs non connectés
          <>
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ 
                title: 'Connexion',
                headerBackTitleVisible: false 
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ 
                title: 'Inscription',
                headerBackTitleVisible: false 
              }}
            />
          </>
        ) : (
          // Écrans pour les utilisateurs connectés
          <>
            <Stack.Screen 
              name="Main" 
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="RouteDetails" 
              component={RouteDetailsScreen}
              options={{ title: 'Détails du Trajet' }}
            />
            <Stack.Screen 
              name="TicketPurchase" 
              component={TicketPurchaseScreen}
              options={{ title: 'Achat de Billet' }}
            />
            <Stack.Screen 
              name="Payment" 
              component={PaymentScreen}
              options={{ title: 'Paiement' }}
            />
            <Stack.Screen 
              name="TicketDetails" 
              component={TicketDetailsScreen}
              options={{ title: 'Détails du Billet' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;