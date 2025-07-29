import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <LinearGradient
        colors={['#007AFF', '#0056CC']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo et titre */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>🚌</Text>
            </View>
            <Text style={styles.title}>TicketExpress</Text>
            <Text style={styles.subtitle}>
              Votre solution de transport moderne
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Achetez vos billets de transport en toute simplicité.
              Bus, trains, avions - tout en un seul endroit.
            </Text>
          </View>

          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.primaryButtonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.secondaryButtonText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>

          {/* Fonctionnalités */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureText}>Paiement sécurisé</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>Billets électroniques</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>Réservation instantanée</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  descriptionContainer: {
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    marginVertical: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#fff',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  primaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default WelcomeScreen;