import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import useCachedResources from './src/hooks/useCachedResources';
import useColorScheme from './src/hooks/useColorScheme';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/redux/store/store';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { OnBoarding, SignIn, SignUp, ForgotPassword, Otp } from './src/screens';
import CustomDrawer from './src/navigation/CustomDrawer';

const Stack = createStackNavigator();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      //   <SafeAreaProvider>
      //     <AppNavigator colorScheme={colorScheme} />
      //     <StatusBar />
      //   </SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={'OnBoarding'}>
            <Stack.Screen name="OnBoarding" component={OnBoarding} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Home" component={CustomDrawer} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
