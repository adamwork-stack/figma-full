import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {LoginScreen} from '../screens/auth/LoginScreen';
import {SignUpScreen} from '../screens/auth/SignUpScreen';
import {ForgotPasswordScreen} from '../screens/auth/ForgotPasswordScreen';
import {EventListScreen} from '../screens/events/EventListScreen';
import {EventDetailScreen} from '../screens/events/EventDetailScreen';
import {TicketListScreen} from '../screens/tickets/TicketListScreen';
import {TicketDetailScreen} from '../screens/tickets/TicketDetailScreen';
import {CheckoutScreen} from '../screens/tickets/CheckoutScreen';
import {ProfileScreen} from '../screens/profile/ProfileScreen';
import {EditProfileScreen} from '../screens/profile/EditProfileScreen';
import {SettingsScreen} from '../screens/profile/SettingsScreen';
import {NotificationsScreen} from '../screens/notifications/NotificationsScreen';
import {loadUserFromStorage} from '../store/slices/authSlice';
import {RootState, AppDispatch} from '../store/store';
import {Typography} from '../components';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens for main app
const HomeScreen = () => <EventListScreen />;
const EventsScreen = () => <EventListScreen />;
const TicketsScreen = () => (
  <Typography variant="h1" style={{textAlign: 'center', marginTop: 100}}>
    Tickets Screen
  </Typography>
);
const ProfileScreen = () => (
  <Typography variant="h1" style={{textAlign: 'center', marginTop: 100}}>
    Profile Screen
  </Typography>
);

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

const EventsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EventList"
        component={EventListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{title: 'Event Details'}}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{title: 'Checkout'}}
      />
    </Stack.Navigator>
  );
};

const TicketsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TicketList"
        component={TicketListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetailScreen}
        options={{title: 'Ticket Details'}}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{title: 'Edit Profile'}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings'}}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{title: 'Notifications'}}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#666666',
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Events" component={EventsStack} />
      <Tab.Screen name="Tickets" component={TicketsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {isAuthenticated, isLoading} = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Typography variant="h1" style={{textAlign: 'center', marginTop: 100}}>
        Loading...
      </Typography>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
