import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { COLORS } from '../constants';

interface ILineDivider {
  lineStyle?: StyleProp<ViewStyle>;
}

const LineDivider = ({ lineStyle }: ILineDivider) => {
  return (
    <View
      style={[
        {
          height: 2,
          width: '100%',
          backgroundColor: COLORS.lightGray2,
        },
        lineStyle,
      ]}
    />
  );
};

export default LineDivider;
