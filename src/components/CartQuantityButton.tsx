import React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { COLORS, FONTS, icons, SIZES } from '../constants';

interface ICartQuantityButton {
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  quantity: number;
  onPress?(): void;
}

const CartQuantityButton = ({
  containerStyle,
  iconStyle,
  quantity,
  onPress,
}: ICartQuantityButton) => {
  return (
    <TouchableOpacity
      style={[
        {
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightOrange2,
        },
        containerStyle,
      ]}
      onPress={onPress}>
      <Image
        source={icons.cart}
        style={[
          {
            width: 20,
            height: 20,
            tintColor: COLORS.black,
          },
          iconStyle,
        ]}
      />

      <View
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          height: 15,
          width: 15,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.primary,
        }}>
        <Text
          style={{
            color: COLORS.white,
            ...FONTS.body5,
            lineHeight: 0,
            fontSize: 10,
          }}>
          {quantity}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CartQuantityButton;
