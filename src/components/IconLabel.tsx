import React from 'react';
import {
  View,
  Image,
  Text,
  TextStyle,
  StyleProp,
  ImageSourcePropType,
  ViewStyle,
  ImageStyle,
} from 'react-native';

import { FONTS, SIZES } from '../constants';

interface IIconLabel {
  containerStyle: StyleProp<ViewStyle>;
  icon: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
}

const IconLabel = ({
  containerStyle,
  icon,
  iconStyle,
  label,
  labelStyle,
}: IIconLabel) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          paddingVertical: SIZES.base,
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
        },
        containerStyle,
      ]}>
      <Image
        source={icon}
        style={[
          {
            width: 20,
            height: 20,
          },
          iconStyle,
        ]}
      />

      <Text
        style={[
          {
            marginLeft: SIZES.base,
            ...FONTS.body3,
          },
          labelStyle,
        ]}>
        {label}
      </Text>
    </View>
  );
};

export default IconLabel;
