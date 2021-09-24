import React from 'react';
import { ImageSourcePropType } from 'react-native';
import {
  TouchableOpacity,
  Image,
  StyleProp,
  ImageStyle,
  ViewStyle,
} from 'react-native';

import { COLORS } from '../constants';

interface IIconButton {
  containerStyle: StyleProp<ViewStyle>;
  icon: ImageSourcePropType;
  iconStyle: StyleProp<ImageStyle>;
  onPress(): void;
}

const IconButton = ({
  containerStyle,
  icon,
  iconStyle,
  onPress,
}: IIconButton) => {
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Image
        source={icon}
        style={[
          {
            width: 30,
            height: 30,
            tintColor: COLORS.white,
          },
          iconStyle,
        ]}
      />
    </TouchableOpacity>
  );
};
export default IconButton;
