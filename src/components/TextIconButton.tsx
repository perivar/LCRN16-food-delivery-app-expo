import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  ImageStyle,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import { FONTS, COLORS } from '../constants';

interface ITextIconButton {
  containerStyle: StyleProp<ViewStyle>;
  label: string;
  labelStyle: StyleProp<TextStyle>;
  icon: ImageSourcePropType;
  iconPosition: 'LEFT' | 'RIGHT';
  iconStyle: StyleProp<ImageStyle>;
  onPress?(): void;
}

const TextIconButton = ({
  containerStyle,
  label,
  labelStyle,
  icon,
  iconPosition,
  iconStyle,
  onPress,
}: ITextIconButton) => {
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
      {iconPosition === 'LEFT' && (
        <Image
          source={icon}
          style={[
            {
              ...styles.image,
            },
            iconStyle,
          ]}
        />
      )}

      <Text
        style={[
          {
            ...FONTS.body3,
          },
          labelStyle,
        ]}>
        {label}
      </Text>

      {iconPosition === 'RIGHT' && (
        <Image
          source={icon}
          style={[
            {
              ...styles.image,
            },
            iconStyle,
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    marginLeft: 5,
    width: 20,
    height: 20,
    tintColor: COLORS.black,
  },
});

export default TextIconButton;
