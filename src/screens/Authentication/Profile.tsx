import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

import { Header, IconButton } from '../../components';
import { COLORS, FONTS, icons, images, SIZES } from '../../constants';
import { userSelector } from '../../redux/slices/auth';
import { useAppSelector } from '../../redux/store/hooks';
import { RootStackParamList } from '../../types';

type ProfileNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const user = useAppSelector(userSelector);

  function renderHeader() {
    return (
      <Header
        title="PROFILE"
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 40,
        }}
        leftComponent={
          <IconButton
            icon={icons.back}
            containerStyle={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: SIZES.radius,
              borderColor: COLORS.gray2,
            }}
            iconStyle={{
              width: 28,
              height: 20,
              tintColor: COLORS.gray2,
            }}
            onPress={() => navigation.goBack()}
          />
        }
        rightComponent={<View style={{ width: 40 }} />}
      />
    );
  }

  function renderDetails() {
    return (
      <View
        style={{
          marginTop: SIZES.radius,
          marginBottom: SIZES.padding,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={images.avatar}
          style={{
            width: 200,
            height: 200,
            borderRadius: 200 / 2,
            overflow: 'hidden',
            borderColor: COLORS.lightGray1,
            borderWidth: 1,
            marginBottom: SIZES.padding,
          }}
        />
        <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>
          {user.displayName}
        </Text>
        <Text style={{ color: COLORS.darkGray2, ...FONTS.h4 }}>
          {user.email}
        </Text>
        <Text style={{ color: COLORS.darkGray, ...FONTS.body4 }}>
          {user.uid}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {/* Header */}
      {renderHeader()}

      {/* Body */}
      <ScrollView>
        {/* Profile Detail */}
        {renderDetails()}
      </ScrollView>
    </View>
  );
};

export default Profile;
