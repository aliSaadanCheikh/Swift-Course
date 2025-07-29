# Tutoriel Complet : Application Mobile de Vente de Billets de Transport

## 📱 Vue d'ensemble du projet

Ce tutoriel vous guide pas à pas dans la création d'une application mobile moderne de vente de billets de transport qui fonctionne sur **Android et iOS**. L'application utilise :

- **Backend** : Spring Boot (Java) avec base de données MySQL
- **Frontend Mobile** : React Native avec Expo (cross-platform)
- **Authentification** : JWT (JSON Web Tokens)
- **Paiements** : Stripe pour les transactions sécurisées
- **Architecture** : API REST pour la communication client-serveur

## 🏗️ Architecture du Projet

```
transport-ticket-app/
├── backend/                    # API Spring Boot
│   └── transport-backend/
│       ├── src/main/java/com/transport/ticketapp/
│       │   ├── entity/         # Entités JPA (User, Route, Ticket, Role)
│       │   ├── repository/     # Repositories Spring Data
│       │   ├── service/        # Logique métier
│       │   ├── controller/     # Contrôleurs REST
│       │   ├── dto/           # Data Transfer Objects
│       │   ├── security/      # Configuration sécurité & JWT
│       │   └── exception/     # Gestion des exceptions
│       └── src/main/resources/
│           └── application.yml # Configuration
├── frontend/                  # Application mobile React Native
│   └── TicketApp/
│       ├── src/
│       │   ├── components/    # Composants réutilisables
│       │   ├── screens/       # Écrans de l'application
│       │   ├── navigation/    # Configuration navigation
│       │   ├── services/      # Services API
│       │   ├── context/       # Contextes React (Auth, etc.)
│       │   ├── types/         # Types TypeScript
│       │   └── utils/         # Utilitaires
│       └── App.tsx           # Point d'entrée
└── docs/                     # Documentation
```

## 🚀 Phase 1 : Configuration de l'environnement de développement

### 1.1 Prérequis système

Avant de commencer, assurez-vous d'avoir installé :

```bash
# Java 17 ou supérieur
java -version

# Node.js 18 ou supérieur
node --version
npm --version

# Maven pour la gestion des dépendances Java
mvn --version

# MySQL Server
mysql --version
```

### 1.2 Installation des outils de développement

#### Pour le backend Spring Boot :
```bash
# Installation de Java 17 (Ubuntu/Debian)
sudo apt update
sudo apt install openjdk-17-jdk maven

# Vérification
java -version
mvn --version
```

#### Pour le frontend React Native :
```bash
# Installation de Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation des outils React Native
npm install -g @react-native-community/cli @expo/cli

# Vérification
expo --version
```

### 1.3 Configuration de la base de données MySQL

```sql
-- Connexion à MySQL en tant qu'administrateur
mysql -u root -p

-- Création de la base de données
CREATE DATABASE transport_tickets;

-- Création de l'utilisateur pour l'application
CREATE USER 'transport_user'@'localhost' IDENTIFIED BY 'transport_password';
GRANT ALL PRIVILEGES ON transport_tickets.* TO 'transport_user'@'localhost';
FLUSH PRIVILEGES;

-- Vérification
USE transport_tickets;
SHOW TABLES;
```

## 🏗️ Phase 2 : Développement du Backend Spring Boot

### 2.1 Création du projet Spring Boot

```bash
# Création du répertoire principal
mkdir transport-ticket-app
cd transport-ticket-app
mkdir backend frontend docs

# Création du projet Maven
cd backend
mvn archetype:generate \
  -DgroupId=com.transport.ticketapp \
  -DartifactId=transport-backend \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

### 2.2 Configuration des dépendances (pom.xml)

Le fichier `pom.xml` contient toutes les dépendances nécessaires :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <!-- Configuration Spring Boot parent -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.transport.ticketapp</groupId>
    <artifactId>transport-backend</artifactId>
    <version>1.0.0</version>
    <name>Transport Ticket App</name>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Base de données MySQL -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT pour l'authentification -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Stripe pour les paiements -->
        <dependency>
            <groupId>com.stripe</groupId>
            <artifactId>stripe-java</artifactId>
            <version>22.25.0</version>
        </dependency>
        
        <!-- Lombok pour réduire le code boilerplate -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Tests -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

## 📱 Phase 3 : Développement de l'Application Mobile React Native

### 3.1 Création du projet React Native avec Expo

```bash
cd frontend

# Création de l'application avec template TypeScript
npx create-expo-app TicketApp --template blank-typescript

cd TicketApp

# Installation des dépendances nécessaires
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context \
  @react-native-async-storage/async-storage \
  axios \
  react-native-vector-icons @expo/vector-icons \
  react-native-paper react-native-elements \
  @stripe/stripe-react-native \
  expo-linear-gradient
```

### 3.2 Fonctionnalités de l'application mobile

#### 🔐 Authentification sécurisée
- Inscription avec validation des données
- Connexion avec JWT
- Gestion automatique des sessions
- Déconnexion sécurisée

#### 🔍 Recherche de trajets
- Recherche par ville de départ/arrivée
- Filtres par date, type de transport, prix
- Affichage en temps réel de la disponibilité
- Interface intuitive et moderne

#### 🎫 Gestion des billets
- Achat de billets en quelques clics
- Paiement sécurisé avec Stripe
- Historique des achats
- Codes QR pour la validation
- Annulation possible selon conditions

#### 📱 Interface utilisateur moderne
- Design Material Design / iOS natif
- Navigation fluide entre les écrans
- Animations et transitions
- Mode sombre/clair
- Responsive sur toutes tailles d'écran

### 3.3 Architecture technique mobile

#### Types TypeScript pour la sécurité
```typescript
// Types pour l'authentification
export interface User {
  id: number;
  username: string;
  email: string;
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
```

#### Service API avec intercepteurs
```typescript
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8080/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    // Intercepteur pour ajouter automatiquement le token JWT
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Gestion automatique des erreurs d'authentification
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          // Redirection vers login
        }
        return Promise.reject(error);
      }
    );
  }
}
```

## 💳 Phase 4 : Système de paiement sécurisé avec Stripe

### 4.1 Configuration Stripe côté backend

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    
    @Value("${stripe.api.key}")
    private String stripeApiKey;
    
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }
    
    public PaymentIntent createPaymentIntent(Long amount, String currency) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount) // Montant en centimes
                .setCurrency(currency)
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build()
                )
                .build();
        
        return PaymentIntent.create(params);
    }
    
    @Transactional
    public String confirmPayment(String paymentIntentId, Long ticketId) {
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            
            if ("succeeded".equals(paymentIntent.getStatus())) {
                // Mettre à jour le statut du billet
                Ticket ticket = ticketRepository.findById(ticketId)
                    .orElseThrow(() -> new RuntimeException("Billet non trouvé"));
                
                ticket.setStatus(Ticket.TicketStatus.CONFIRMED);
                ticketRepository.save(ticket);
                
                return "Paiement confirmé avec succès";
            }
        } catch (StripeException e) {
            throw new RuntimeException("Erreur lors de la confirmation du paiement");
        }
    }
}
```

### 4.2 Intégration Stripe côté mobile

```typescript
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

const PaymentScreen: React.FC = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const handlePayment = async () => {
    // 1. Créer un Payment Intent côté serveur
    const { clientSecret } = await ApiService.createPaymentIntent(totalAmount, 'eur');

    // 2. Initialiser la feuille de paiement
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'TicketExpress',
      paymentIntentClientSecret: clientSecret,
      defaultBillingDetails: {
        name: passengerName,
      },
    });

    if (error) {
      Alert.alert('Erreur', error.message);
      return;
    }

    // 3. Présenter la feuille de paiement
    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      Alert.alert('Paiement échoué', paymentError.message);
    } else {
      // 4. Confirmer le paiement côté serveur
      await ApiService.confirmPayment(paymentIntentId, ticketId);
      Alert.alert('Succès', 'Votre billet a été confirmé !');
    }
  };
};
```

## 🔒 Sécurité et bonnes pratiques

### 4.1 Authentification JWT sécurisée

```java
@Component
@Slf4j
public class JwtTokenProvider {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration}")
    private int jwtExpirationInMs;
    
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);
        
        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
    
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(authToken);
            return true;
        } catch (JwtException ex) {
            log.error("Token JWT invalide: {}", ex.getMessage());
        }
        return false;
    }
}
```

### 4.2 Validation des données

```java
// Validation côté backend
public class TicketPurchaseDto {
    
    @NotNull(message = "L'ID de la route est obligatoire")
    private Long routeId;
    
    @NotNull(message = "La date de voyage est obligatoire")
    @Future(message = "La date de voyage doit être dans le futur")
    private LocalDate travelDate;
    
    @NotNull(message = "La quantité est obligatoire")
    @Min(value = 1, message = "La quantité doit être au moins 1")
    @Max(value = 10, message = "Maximum 10 billets par commande")
    private Integer quantity;
}
```

```typescript
// Validation côté mobile
const validatePurchaseForm = (data: TicketPurchase): string[] => {
  const errors: string[] = [];
  
  if (!data.routeId) {
    errors.push('Veuillez sélectionner un trajet');
  }
  
  if (!data.travelDate) {
    errors.push('Veuillez sélectionner une date de voyage');
  } else if (new Date(data.travelDate) <= new Date()) {
    errors.push('La date de voyage doit être dans le futur');
  }
  
  if (!data.quantity || data.quantity < 1) {
    errors.push('La quantité doit être au moins 1');
  } else if (data.quantity > 10) {
    errors.push('Maximum 10 billets par commande');
  }
  
  return errors;
};
```

## 🚀 Déploiement et distribution

### 5.1 Déploiement du backend

```bash
# Build du JAR de production
mvn clean package -DskipTests

# Démarrage avec profil de production
java -jar -Dspring.profiles.active=prod target/transport-backend-1.0.0.jar
```

### 5.2 Build de l'application mobile

```bash
# Configuration EAS (Expo Application Services)
npm install -g @expo/eas-cli
eas login

# Build pour Android
eas build --platform android --profile production

# Build pour iOS (nécessite un compte développeur Apple)
eas build --platform ios --profile production

# Soumission aux stores
eas submit --platform android
eas submit --platform ios
```

## 📊 Fonctionnalités avancées

### 6.1 Notifications push

```typescript
// Configuration des notifications
import * as Notifications from 'expo-notifications';

export const NotificationService = {
  async registerForPushNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission refusée pour les notifications');
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Envoyer le token au backend
    await ApiService.updatePushToken(token);
    
    return token;
  },

  setupNotificationHandlers() {
    // Notification reçue quand l'app est ouverte
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification);
    });

    // Notification cliquée
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification cliquée:', response);
      // Navigation vers l'écran approprié
    });
  }
};
```

### 6.2 Mode hors ligne

```typescript
// Gestion du cache pour le mode hors ligne
export const CacheService = {
  async cacheRoutes(routes: Route[]) {
    await AsyncStorage.setItem('cached_routes', JSON.stringify({
      data: routes,
      timestamp: Date.now()
    }));
  },

  async getCachedRoutes(): Promise<Route[]> {
    try {
      const cached = await AsyncStorage.getItem('cached_routes');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        
        // Cache valide pendant 1 heure
        if (Date.now() - timestamp < 3600000) {
          return data;
        }
      }
    } catch (error) {
      console.error('Erreur cache:', error);
    }
    
    return [];
  },

  async syncWhenOnline() {
    // Synchroniser les données en attente quand la connexion revient
    const pendingData = await AsyncStorage.getItem('pending_sync');
    if (pendingData) {
      const data = JSON.parse(pendingData);
      await ApiService.syncPendingData(data);
      await AsyncStorage.removeItem('pending_sync');
    }
  }
};
```

### 6.3 Géolocalisation

```typescript
import * as Location from 'expo-location';

export const LocationService = {
  async getCurrentLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission de géolocalisation refusée');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  },

  async findNearbyStations(latitude: number, longitude: number) {
    // Recherche des stations proches via l'API
    return ApiService.getNearbyStations(latitude, longitude, 5000); // 5km de rayon
  },

  async reverseGeocode(latitude: number, longitude: number) {
    const result = await Location.reverseGeocodeAsync({ latitude, longitude });
    
    if (result.length > 0) {
      const address = result[0];
      return `${address.city}, ${address.region}`;
    }
    
    return 'Localisation inconnue';
  }
};
```

## 🎯 Guide d'utilisation pour l'utilisateur final

### 7.1 Première utilisation

1. **Téléchargement** : Installer l'app depuis Google Play Store ou Apple App Store
2. **Inscription** : Créer un compte avec email et mot de passe sécurisé
3. **Vérification** : Confirmer l'email (si activé)
4. **Connexion** : Se connecter avec les identifiants

### 7.2 Recherche et achat de billets

1. **Recherche** :
   - Sélectionner ville de départ et d'arrivée
   - Choisir la date de voyage
   - Appliquer des filtres (prix, type de transport)

2. **Sélection** :
   - Comparer les options disponibles
   - Voir les détails (horaires, compagnie, prix)
   - Choisir le trajet souhaité

3. **Achat** :
   - Saisir les informations passager
   - Sélectionner le nombre de billets
   - Procéder au paiement sécurisé

4. **Confirmation** :
   - Recevoir la confirmation par email
   - Accéder au billet dans "Mes Billets"
   - Présenter le QR code lors du voyage

### 7.3 Gestion des billets

- **Historique** : Voir tous les billets achetés
- **Détails** : Informations complètes du voyage
- **Annulation** : Annuler selon les conditions
- **Support** : Contacter le service client

## 🔧 Maintenance et évolution

### 8.1 Monitoring de l'application

```java
// Métriques personnalisées avec Micrometer
@Component
public class CustomMetrics {
    
    private final Counter ticketPurchaseCounter;
    private final Timer paymentProcessingTimer;
    
    public CustomMetrics(MeterRegistry meterRegistry) {
        this.ticketPurchaseCounter = Counter.builder("tickets.purchased")
            .description("Nombre total de billets achetés")
            .register(meterRegistry);
            
        this.paymentProcessingTimer = Timer.builder("payment.processing.time")
            .description("Temps de traitement des paiements")
            .register(meterRegistry);
    }
    
    public void incrementTicketPurchase() {
        ticketPurchaseCounter.increment();
    }
    
    public void recordPaymentTime(Duration duration) {
        paymentProcessingTimer.record(duration);
    }
}
```

### 8.2 Logs structurés

```java
// Logging structuré avec Logback
@Slf4j
@RestController
public class TicketController {
    
    @PostMapping("/tickets/purchase")
    public ResponseEntity<?> purchaseTicket(@RequestBody TicketPurchaseDto dto) {
        
        MDC.put("userId", getCurrentUserId().toString());
        MDC.put("routeId", dto.getRouteId().toString());
        
        try {
            log.info("Début achat billet - Route: {}, Quantité: {}", 
                dto.getRouteId(), dto.getQuantity());
            
            Ticket ticket = ticketService.purchaseTicket(dto);
            
            log.info("Achat billet réussi - TicketId: {}, Montant: {}", 
                ticket.getId(), ticket.getTotalPrice());
            
            return ResponseEntity.ok(ticket);
            
        } catch (Exception e) {
            log.error("Erreur achat billet", e);
            throw e;
        } finally {
            MDC.clear();
        }
    }
}
```

### 8.3 Tests automatisés

```java
// Tests d'intégration
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
class TicketControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldPurchaseTicketSuccessfully() {
        // Given
        TicketPurchaseDto purchaseDto = new TicketPurchaseDto();
        purchaseDto.setRouteId(1L);
        purchaseDto.setTravelDate(LocalDate.now().plusDays(1));
        purchaseDto.setQuantity(1);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getValidJwtToken());
        HttpEntity<TicketPurchaseDto> request = new HttpEntity<>(purchaseDto, headers);
        
        // When
        ResponseEntity<Ticket> response = restTemplate.postForEntity(
            "/api/tickets/purchase", request, Ticket.class);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(TicketStatus.PENDING);
    }
}
```

```typescript
// Tests unitaires React Native avec Jest
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';
import { AuthProvider } from '../src/context/AuthContext';

describe('LoginScreen', () => {
  it('should login successfully with valid credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue(undefined);
    
    const { getByPlaceholderText, getByText } = render(
      <AuthProvider value={{ login: mockLogin, isLoading: false }}>
        <LoginScreen />
      </AuthProvider>
    );
    
    // Saisir les identifiants
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Mot de passe'), 'password123');
    
    // Cliquer sur connexion
    fireEvent.press(getByText('Se connecter'));
    
    // Vérifier que la fonction login a été appelée
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        usernameOrEmail: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

## 🎯 Conclusion

Félicitations ! Vous avez maintenant une compréhension complète de la création d'une application mobile moderne de vente de billets de transport qui fonctionne sur **Android et iOS**.

### 🏆 Ce que vous avez appris :

1. **Architecture complète** : API REST Spring Boot + Application React Native cross-platform
2. **Sécurité avancée** : JWT, validation, protection des endpoints, paiements sécurisés
3. **Base de données** : Modélisation JPA, relations, optimisations
4. **UX/UI moderne** : Interface intuitive, navigation fluide, design responsive
5. **Intégrations** : Stripe, notifications push, géolocalisation
6. **Déploiement** : Production-ready avec monitoring et tests

### 🚀 Prochaines étapes possibles :

- **Tests automatisés** : Augmenter la couverture de tests
- **CI/CD** : Pipeline de déploiement automatique
- **Microservices** : Découper en services plus spécialisés
- **Analytics** : Intégrer des outils d'analyse d'usage
- **Internationalisation** : Support multi-langues
- **Accessibilité** : Améliorer l'accessibilité pour tous les utilisateurs

### 📚 Ressources complémentaires :

- [Documentation Spring Boot](https://spring.io/projects/spring-boot)
- [Documentation React Native](https://reactnative.dev/)
- [Documentation Expo](https://docs.expo.dev/)
- [Documentation Stripe](https://stripe.com/docs)
- [Guide sécurité mobile OWASP](https://owasp.org/www-project-mobile-security/)

**Bravo !** Vous disposez maintenant d'une application mobile professionnelle et sécurisée ! 🎉📱