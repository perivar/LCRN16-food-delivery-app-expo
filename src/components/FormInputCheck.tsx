import React from 'react';
import { View, Image } from 'react-native';
import { COLORS, icons } from '../constants';

interface IFormInputCheck {
  value: string;
  error: string;
}

const FormInputCheck = ({ value, error }: IFormInputCheck) => {
  return (
    <View
      style={{
        justifyContent: 'center',
      }}>
      <Image
        source={
          value === '' || (value !== '' && error === '')
            ? icons.correct
            : icons.cancel
        }
        style={{
          height: 20,
          width: 20,
          tintColor:
            value === ''
              ? COLORS.gray
              : value !== '' && error === ''
              ? COLORS.green
              : COLORS.red,
        }}
      />
    </View>
  );
};

export default FormInputCheck;
