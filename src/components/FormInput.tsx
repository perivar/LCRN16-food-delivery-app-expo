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
  inputContainerStyle?: StyleProp<ViewStyle>;
  label?: string;
  placeholder?: string;
  inputStyle?: StyleProp<TextStyle>;
  value?: string;
  prependComponent?: React.ReactNode;
  appendComponent?: React.ReactNode;
  onChange?(text: string): void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCompleteType?: any;
  autoCapitalize?: any;
  errorMsg?: string;
  maxLength?: number;
}

const FormInput = ({
  containerStyle,
  inputContainerStyle,
  label,
  placeholder,
  inputStyle,
  value = '',
  prependComponent,
  appendComponent,
  onChange,
  secureTextEntry,
  keyboardType = 'default',
  autoCompleteType = 'off',
  autoCapitalize = 'none',
  errorMsg = '',
  maxLength,
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
        style={[
          {
            flexDirection: 'row',
            height: SIZES.height > 800 ? 55 : 45,
            paddingHorizontal: SIZES.padding,
            marginTop: SIZES.height > 800 ? SIZES.base : 0,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.lightGray2,
          },
          inputContainerStyle,
        ]}>
        {prependComponent}
        <TextInput
          style={[
            {
              flex: 1,
            },
            inputStyle,
          ]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCompleteType={autoCompleteType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          onChangeText={text => (onChange ? onChange(text) : {})}
        />
        {appendComponent}
      </View>
    </View>
  );
};

export default FormInput;
