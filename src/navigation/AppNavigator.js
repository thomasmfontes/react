import React from 'react';
import { Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import DailyGoalsScreen from '../screens/DailyGoalsScreen';
import HumorScreen from '../screens/HumorScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Objective') {
          } else if (route.name === 'Humor') {
            iconName = 'happy';
          } else if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          const scale = focused ? 1.5 : 1; // Scale up when focused
          return (
            <Animated.View style={{ transform: [{ scale }] }}>
              <Ionicons
                name={iconName}
                size={size}
                color={focused ? '#FFB6B9' : '#ccc'}
                style={{
                  shadowColor: '#EFAD0F',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: focused ? 0.5 : 0,
                  shadowRadius: 5,
                }}
              />
            </Animated.View>
          );
        },
        tabBarStyle: {
          backgroundColor: '#1C2541',
          borderTopWidth: 0,
          elevation: 10,
          height: 65,
          paddingBottom: 0,
        },
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen
        name="Humor"
        component={HumorScreen}
        options={{
          headerShown: false,
          title: "",
          headerStyle: { backgroundColor: '#1C2541' },
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: "",
          headerStyle: { backgroundColor: '#3A506B' },
        }}
      />

      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerShown: false,
          title: "",
          headerStyle: { backgroundColor: '#1C2541' },
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1C2541',
          },
          headerTintColor: '#FFB6B9',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
            color: '#FFB6B9',
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Objective" component={DailyGoalsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Recuperar Senha' }} />
      </Stack.Navigator>

      {/* Adiciona o Toast aqui para uso em todo o aplicativo */}
      <Toast />
    </NavigationContainer>
  );
}

export default AppNavigator;
