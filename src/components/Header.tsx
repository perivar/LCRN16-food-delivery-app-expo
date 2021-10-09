import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { FONTS } from '../constants';

interface IHeader {
  containerStyle: StyleProp<ViewStyle>;
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const Header = ({
  containerStyle,
  title,
  leftComponent,
  rightComponent,
}: IHeader) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
        },
        containerStyle,
      ]}>
      {/* Left */}
      {leftComponent}

      {/* Title */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ ...FONTS.h3 }}>{title}</Text>
      </View>

      {/* Right */}
      {rightComponent}
    </View>
  );
};

export default Header;
