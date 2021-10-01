import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import AuthLayout from './AuthLayout';
import { FONTS, SIZES, COLORS, icons } from '../../constants';

import {
  CustomSwitch,
  FormInput,
  TextButton,
  TextIconButton,
} from '../../components';
import { utils } from '../../utils';

import * as AppleAuthentication from 'expo-apple-authentication';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import Auth from '../../lib/auth';
import { loginUser, User } from '../../redux/slices/auth';
import { useAppDispatch } from '../../redux/store/hooks';

const auth = new Auth();

const SignIn = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const dispatch = useAppDispatch();
  const { onAppleLogin, onGoogleLogin, onFacebookLogin } = useFirebaseAuth();

  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  const [password, setPassword] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  const [saveMe, setSaveMe] = React.useState(false);

  const [signInError, setSignInError] = React.useState('');

  const isEnableSignIn = () => {
    return email !== '' && password !== '' && emailError === '';
  };

  return (
    <AuthLayout
      title="Let's Sign You In"
      subtitle="Welcome back, you've been missed">
      <View
        style={{
          flex: 1,
          marginTop: SIZES.padding * 2,
        }}>
        {/* Form Inputs */}
        <FormInput
          label="Email"
          keyboardType="email-address"
          autoCompleteType="email"
          onChange={value => {
            utils.validateEmail(value, setEmailError);
            setEmail(value);
          }}
          errorMsg={emailError}
          appendComponent={
            <View
              style={{
                justifyContent: 'center',
              }}>
              <Image
                source={
                  email === '' || (email !== '' && emailError === '')
                    ? icons.correct
                    : icons.cancel
                }
                style={{
                  height: 20,
                  width: 20,
                  tintColor:
                    email === ''
                      ? COLORS.gray
                      : email !== '' && emailError === ''
                      ? COLORS.green
                      : COLORS.red,
                }}
              />
            </View>
          }
        />

        <FormInput
          label="Password"
          secureTextEntry={!showPass}
          autoCompleteType="password"
          containerStyle={{
            marginTop: SIZES.radius,
          }}
          onChange={value => setPassword(value)}
          appendComponent={
            <TouchableOpacity
              style={{
                width: 40,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
              onPress={() => setShowPass(!showPass)}>
              <Image
                source={showPass ? icons.eye_close : icons.eye}
                style={{
                  height: 20,
                  width: 20,
                  tintColor: COLORS.gray,
                }}
              />
            </TouchableOpacity>
          }
        />

        {/* Save me & Forgot Password */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: SIZES.radius,
            justifyContent: 'space-between',
          }}>
          <CustomSwitch
            value={saveMe}
            onChange={(value: boolean) => {
              setSaveMe(value);
            }}
          />

          <TextButton
            label="Forgot Password?"
            buttonContainerStyle={{
              backgroundColor: null,
            }}
            labelStyle={{
              color: COLORS.gray,
              ...FONTS.body4,
            }}
            onPress={() => navigation.navigate('ForgotPassword')}
          />
        </View>

        {signInError !== '' && (
          <View style={{ marginTop: SIZES.radius }}>
            <Text
              style={{
                color: COLORS.red,
                ...FONTS.body4,
              }}>
              {signInError}
            </Text>
          </View>
        )}

        {/* Sign In */}
        <TextButton
          label="Sign In"
          disabled={isEnableSignIn() ? false : true}
          buttonContainerStyle={{
            height: 55,
            alignItems: 'center',
            marginTop: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: isEnableSignIn()
              ? COLORS.primary
              : COLORS.transparentPrimary,
          }}
          onPress={() => {
            auth
              .doSignInWithEmailAndPassword(email, password)
              .then(data => {
                setSignInError(undefined);
                const providerUser = data.user.providerData[0];
                const user: User = {
                  uid: providerUser.uid,
                  displayName: providerUser.displayName,
                  email: providerUser.email,
                };
                dispatch(loginUser(user));
              })
              .catch((error: any) => {
                console.log(error);
                setSignInError(JSON.stringify(error?.message));
              });
          }}
        />

        {/* Sign Up */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: SIZES.radius,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: COLORS.darkGray,
              ...FONTS.body3,
            }}>
            Don't have an account?
          </Text>

          <TextButton
            label="Sign Up"
            buttonContainerStyle={{
              marginLeft: 3,
              backgroundColor: null,
            }}
            labelStyle={{
              color: COLORS.primary,
              ...FONTS.h3,
            }}
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
      </View>

      {/* Footer */}
      <View>
        {/* Facebook */}
        <TextIconButton
          containerStyle={{
            height: 50,
            alignItems: 'center',
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.blue,
          }}
          icon={icons.fb}
          iconPosition="LEFT"
          iconStyle={{
            tintColor: COLORS.white,
          }}
          label="Sign in with Facebook"
          labelStyle={{
            marginLeft: SIZES.radius,
            color: COLORS.white,
          }}
          onPress={onFacebookLogin}
        />

        {/* Google */}
        <TextIconButton
          containerStyle={{
            height: 50,
            alignItems: 'center',
            marginTop: SIZES.radius,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.lightGray2,
          }}
          icon={icons.google}
          iconPosition="LEFT"
          iconStyle={{
            tintColor: null,
          }}
          label="Sign in with Google"
          labelStyle={{
            marginLeft: SIZES.radius,
          }}
          onPress={onGoogleLogin}
        />

        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={SIZES.radius}
            style={{
              height: 50,
              alignItems: 'center',
              marginTop: SIZES.radius,
            }}
            onPress={onAppleLogin}
          />
        )}
      </View>
    </AuthLayout>
  );
};

export default SignIn;
