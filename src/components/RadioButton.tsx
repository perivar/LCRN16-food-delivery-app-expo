import React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { COLORS, FONTS, icons, SIZES } from '../constants';

interface IRadioButton {
  containerStyle?: StyleProp<ViewStyle>;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  isSelected: boolean;
  onPress?(): void;
}

const RadioButton = ({
  containerStyle,
  label,
  labelStyle,
  iconStyle,
  isSelected,
  onPress,
}: IRadioButton) => {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        containerStyle,
      ]}
      onPress={onPress}>
      <Image
        source={isSelected ? icons.check_on : icons.check_off}
        style={[
          {
            marginLeft: 5,
            width: 20,
            height: 20,
          },
          iconStyle,
        ]}
      />
      <Text
        style={[
          {
            marginLeft: SIZES.radius,
            color: COLORS.gray,
            ...FONTS.body3,
          },
          labelStyle,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default RadioButton;
