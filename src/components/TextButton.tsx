import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { COLORS, FONTS } from '../constants';

interface ITextButton {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  label2?: string;
  label2Style?: StyleProp<TextStyle>;
  buttonContainerStyle: StyleProp<ViewStyle>;
  onPress?(): void;
  disabled?: boolean;
}

const TextButton = ({
  label,
  labelStyle,
  label2 = '',
  label2Style,
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

      {label2 !== '' && (
        <Text
          style={[
            {
              flex: 1,
              textAlign: 'right',
              color: COLORS.white,
              ...FONTS.h3,
            },
            label2Style,
          ]}>
          {label2}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default TextButton;
