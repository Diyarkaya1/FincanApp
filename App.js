import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Tüm ekranlarımızı import ediyoruz
import HomeScreen from './src/screens/HomeScreen';
import AddCoffeeScreen from './src/screens/AddCoffeeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

// Uygulama başlamadan önce başlangıç ekranını görünür tut
SplashScreen.preventAutoHideAsync();

// Kullanıcı giriş yapmadıysa gösterilecek ekranlar
const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Giriş Yap' }} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Kayıt Ol' }} />
  </AuthStack.Navigator>
);

// Kullanıcı giriş yaptıysa gösterilecek ekranlar
const AppNavigator = ({ coffees }) => (
  <AppStack.Navigator>
    <AppStack.Screen name="Home" options={{ title: 'Fincan Ana Sayfa' }}>
      {/* HomeScreen'e kahve listesini prop olarak gönderiyoruz */}
      {(props) => <HomeScreen {...props} coffees={coffees} />}
    </AppStack.Screen>
    <AppStack.Screen name="AddCoffee" component={AddCoffeeScreen} options={{ title: 'Yeni Kahve Ekle' }} />
    <AppStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profilim' }} />
  </AppStack.Navigator>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [coffees, setCoffees] = useState([]);

  // Fontları yükleme
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  // Kullanıcı durumunu dinleme
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribeAuth;
  }, []);

  // Kahve paylaşımlarını dinleme
  useEffect(() => {
    const q = query(collection(db, "coffees"), orderBy("createdAt", "desc"));
    const unsubscribeDB = onSnapshot(q, (querySnapshot) => {
      const coffeesData = [];
      querySnapshot.forEach((doc) => {
        coffeesData.push({ ...doc.data(), id: doc.id });
      });
      setCoffees(coffeesData);
    });
    return unsubscribeDB;
  }, []);

  // Fontlar yüklendiğinde başlangıç ekranını gizleme
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Fontlar yüklenene kadar hiçbir şey gösterme
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      {user ? <AppNavigator coffees={coffees} /> : <AuthNavigator />}
    </NavigationContainer>
  );
}