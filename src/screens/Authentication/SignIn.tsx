import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationButtonType,
} from 'expo-apple-authentication';
import {
  AuthCredential,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

import {
  CustomSwitch,
  FormInput,
  TextButton,
  TextIconButton,
} from '../../components';
import { COLORS, FONTS, icons, SIZES } from '../../constants';
import useAppleAuthentication from '../../hooks/useAppleAuthentication';
import useEmailPasswordAuthentication from '../../hooks/useEmailPasswordAuthentication';
import useFacebookAuthentication from '../../hooks/useFacebookAuthentication';
import useGoogleAuthentication from '../../hooks/useGoogleAuthentication';
import { RootStackParamList } from '../../types';
import { utils } from '../../utils';
import loginWithCredential from '../../utils/loginWithCredential';
import AuthLayout from './AuthLayout';

type SignInNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;
type SignInRouteProp = RouteProp<RootStackParamList, 'SignIn'>;

const SignIn = () => {
  const navigation = useNavigation<SignInNavigationProp>();

  // const {
  //   onAppleLogin,
  //   onGoogleLogin,
  //   onFacebookLogin,
  //   onEmailAndPasswordLogin,
  // } = useFirebaseAuth();

  const [googleAuthLoading, authWithGoogle] = useGoogleAuthentication();
  const [appleAuthAvailable, authWithApple] = useAppleAuthentication();
  const [facebookAuthAvailable, authWithFacebook] = useFacebookAuthentication();
  const [authWithEmailPassword] = useEmailPasswordAuthentication();

  async function login(credential: AuthCredential, data?: any) {
    const user = await loginWithCredential(credential, data);
    console.log('logged in user: ', user);
    navigation.navigate('Home');
  }

  async function loginWithGoogle() {
    try {
      const [credential] = await authWithGoogle();
      await login(credential);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  }

  async function loginWithApple() {
    try {
      const [credential, data] = await authWithApple();
      await login(credential, data);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  }

  async function loginWithFacebook() {
    try {
      const [credential, data] = await authWithFacebook();
      await login(credential, data);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  }

  async function loginWithEmailPassword(email: string, password: string) {
    try {
      // const credential = authWithEmailPassword(email, password);
      // await login(credential);
      const auth = getAuth();
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  }

  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  const [password, setPassword] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  const [saveMe, setSaveMe] = React.useState(false);

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
          value={email}
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
          value={password}
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
          // onPress={() => onEmailAndPasswordLogin(email, password)}
          onPress={() => loginWithEmailPassword(email, password)}
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
          // onPress={onFacebookLogin}
          onPress={loginWithFacebook}
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
          // onPress={onGoogleLogin}
          onPress={loginWithGoogle}
        />

        {/* {Platform.OS === 'ios' && ( */}
        {appleAuthAvailable && (
          <AppleAuthenticationButton
            buttonType={AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={SIZES.radius}
            style={{
              height: 50,
              alignItems: 'center',
              marginTop: SIZES.radius,
            }}
            onPress={loginWithApple}
          />
        )}
      </View>
    </AuthLayout>
  );
};

export default SignIn;
