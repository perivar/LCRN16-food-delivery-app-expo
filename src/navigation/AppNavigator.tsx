/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import * as React from 'react';
import { useEffect } from 'react';
import { ColorSchemeName } from 'react-native';

import useFirebaseAuth from '../hooks/useFirebaseAuth';
import CustomDrawer from '../navigation/CustomDrawer';
import { loginUser, User, userSelector } from '../redux/slices/auth';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import {
  AddCard,
  Checkout,
  DeliveryMap,
  DeliveryStatus,
  FoodDetail,
  ForgotPassword,
  MyCard,
  MyCart,
  OnBoarding,
  Otp,
  Profile,
  SignIn,
  SignUp,
  Success,
} from '../screens';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import SplashScreen from '../screens/SplashScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

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
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      console.log('AppNavigator - onAuthStateChanged');
      if (authUser) {
        const providerUser = authUser.providerData[0];
        const userInfo: User = {
          uid: providerUser.uid,
          displayName: providerUser.displayName,
          email: providerUser.email,
        };
        dispatch(loginUser(userInfo));
      } else {
        onLogout();
      }
    });
    // unsubscribe auth listener on unmount
    return unsubscribe;
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
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="FoodDetail" component={FoodDetail} />
          <Stack.Screen name="Checkout" component={Checkout} />
          <Stack.Screen name="MyCart" component={MyCart} />
          <Stack.Screen
            name="Success"
            component={Success}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="AddCard" component={AddCard} />
          <Stack.Screen name="MyCard" component={MyCard} />
          <Stack.Screen
            name="DeliveryStatus"
            component={DeliveryStatus}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="Map" component={DeliveryMap} />

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
