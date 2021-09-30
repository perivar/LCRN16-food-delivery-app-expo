import * as React from 'react';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '../redux/store/hooks';
import { isUserAuthenticatedSelector } from '../redux/slices/auth';
import { RootStackParamList } from '../types';

export default function SplashScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isUserAuthenticated = useAppSelector(isUserAuthenticatedSelector);

  React.useEffect(() => {
    if (isUserAuthenticated) navigation.replace('Home');
  }, [isUserAuthenticated]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Splash!</Text>
      <TouchableOpacity
        onPress={() => navigation.replace('Home')}
        style={styles.link}>
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
