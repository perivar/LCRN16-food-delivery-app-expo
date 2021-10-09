/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type CustomDrawerParamList = {
  // default screens
  MainLayout: undefined;
  SignIn: undefined;
};

export type RootStackParamList = {
  // default screens
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  // added screens
  // splash
  Splash: undefined;
  // auth
  OnBoarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Otp: undefined;
  // app
  Home: undefined;
  FoodDetail: undefined;
  Checkout: { selectedCard: string } | undefined;
  MyCart: undefined;
  Success: undefined;
  AddCard: { selectedCard: string } | undefined;
  MyCard: undefined;
  DeliveryStatus: undefined;
  Map: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  // default tabs
  TabOne: undefined;
  TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
