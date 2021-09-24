import React from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { FONTS, SIZES, COLORS } from '../constants';

interface IFormInput {
  containerStyle?: StyleProp<ViewStyle>;
  label: string;
  placeholder?: string;
  inputStyle?: StyleProp<TextStyle>;
  prependComponent?: React.ReactNode;
  appendComponent?: React.ReactNode;
  onChange(text: string): void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCompleteType?: any;
  autoCapitalize?: any;
  errorMsg?: string;
}

const FormInput = ({
  containerStyle,
  label,
  placeholder,
  inputStyle,
  prependComponent,
  appendComponent,
  onChange,
  secureTextEntry,
  keyboardType = 'default',
  autoCompleteType = 'off',
  autoCapitalize = 'none',
  errorMsg = '',
}: IFormInput) => {
  return (
    <View style={containerStyle}>
      {/* Label & Error msg */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>{label}</Text>
        <Text style={{ color: COLORS.red, ...FONTS.body4 }}>{errorMsg}</Text>
      </View>

      {/* Text input */}
      <View
        style={{
          flexDirection: 'row',
          height: 55,
          paddingHorizontal: SIZES.padding,
          marginTop: SIZES.base,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightGray2,
        }}>
        {prependComponent}
        <TextInput
          style={[
            {
              flex: 1,
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCompleteType={autoCompleteType}
          autoCapitalize={autoCapitalize}
          onChangeText={text => onChange(text)}
        />
        {appendComponent}
      </View>
    </View>
  );
};

export default FormInput;
