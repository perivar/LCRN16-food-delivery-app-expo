import React from 'react';
import {
  TouchableOpacity,
  Text,
  TextStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { FONTS, COLORS } from '../constants';

interface ITextButton {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  buttonContainerStyle: StyleProp<ViewStyle>;
  onPress?(): void;
  disabled?: boolean;
}

const TextButton = ({
  label,
  labelStyle,
  buttonContainerStyle,
  onPress,
  disabled,
}: ITextButton) => {
  return (
    <TouchableOpacity
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.primary,
        },
        buttonContainerStyle,
      ]}
      disabled={disabled}
      onPress={onPress}>
      <Text style={[{ color: COLORS.white, ...FONTS.h3 }, labelStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default TextButton;
