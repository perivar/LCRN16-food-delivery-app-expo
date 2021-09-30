import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants';

export default function Spinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.darkGray2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
