/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import { OnBoarding, SignIn, SignUp, ForgotPassword, Otp } from '../screens';
import CustomDrawer from '../navigation/CustomDrawer';
import SimsScreen from '../screens/SimsScreen';
import YodaScreen from '../screens/YodaScreen';
import { useEffect } from 'react';
import { loginUser, User, userSelector } from '../redux/slices/auth';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import SplashScreen from '../screens/SplashScreen';
import firebase from '../lib/system/firebase';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import BottomTabNavigator from './BottomTabNavigator';

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const user = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  const { onLogout, setup } = useFirebaseAuth();

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = firebase.auth().onAuthStateChanged(authUser => {
      console.log('AppNavigator - onAuthStateChanged');
      if (authUser) {
        const user: User = {
          uid: authUser.uid,
          displayName: authUser.displayName,
          email: authUser.email,
        };
        dispatch(loginUser(user));
      } else {
        onLogout();
      }
    });
    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  if (!setup) {
    // We haven't finished checking for user yet
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={CustomDrawer} />
          <Stack.Screen name="Sims" component={SimsScreen} />
          <Stack.Screen name="Yoda" component={YodaScreen} />
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: 'Oops!' }}
          />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>
        </>
      ) : (
        <>
          <Stack.Screen name="OnBoarding" component={OnBoarding} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Otp" component={Otp} />
        </>
      )}
    </Stack.Navigator>
  );
};

const AppNavigator = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
