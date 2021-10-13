import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CartQuantityButton from '../../components/CartQuantityButton';
import Header from '../../components/Header';
import IconButton from '../../components/IconButton';
import { COLORS, FONTS, icons, SIZES } from '../../constants';
import { RootStackScreenProps } from '../../types';
import { SwipeListView } from 'react-native-swipe-list-view';
import StepperInput from '../../components/StepperInput';
import { FooterTotal } from '../../components';
import {
  cartItemsSelector,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  totalPriceSelector,
  totalQuantitySelector,
} from '../../redux/slices/cart';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';

const MyCart = ({ navigation }: RootStackScreenProps<'MyCart'>) => {
  const cartQuantity = useAppSelector(totalQuantitySelector);
  const totalPrice = useAppSelector(totalPriceSelector);
  const myCartList = useAppSelector(cartItemsSelector);
  const dispatch = useAppDispatch();

  // Render
  function renderHeader() {
    return (
      <Header
        title="MY CART"
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
        rightComponent={<CartQuantityButton quantity={cartQuantity} />}
      />
    );
  }

  function renderCartList() {
    return (
      <SwipeListView
        data={myCartList}
        keyExtractor={item => `${item.productId}`}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.padding * 2,
        }}
        disableRightSwipe={true}
        rightOpenValue={-75}
        renderItem={(data, _) => (
          <View
            style={{
              height: 100,
              backgroundColor: COLORS.lightGray2,
              ...styles.cartItemContainer,
            }}>
            {/* Food Image */}
            <View
              style={{
                width: 90,
                height: 100,
                marginLeft: -10,
              }}>
              <Image
                source={data.item.image}
                resizeMode="contain"
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 10,
                }}
              />
            </View>

            {/* Food Info */}
            <View
              style={{
                flex: 1,
              }}>
              <Text style={{ ...FONTS.body3 }}>{data.item.name}</Text>
              <Text style={{ color: COLORS.primary, ...FONTS.h3 }}>
                ${data.item.price}
              </Text>
            </View>

            {/* Quantity */}
            <StepperInput
              containerStyle={{
                height: 50,
                width: 125,
                backgroundColor: COLORS.white,
              }}
              value={data.item.quantity}
              onAdd={() => dispatch(incrementQuantity({ id: data.item.productId }))}
              onMinus={() => {
                dispatch(decrementQuantity({ id: data.item.productId }));
              }}
            />
          </View>
        )}
        renderHiddenItem={(data, _) => (
          <IconButton
            containerStyle={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: COLORS.primary,
              ...styles.cartItemContainer,
            }}
            icon={icons.delete_icon}
            iconStyle={{
              marginRight: 10,
            }}
            onPress={() => dispatch(removeFromCart({ id: data.item.productId }))}
          />
        )}
      />
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

      {/* Cart List */}
      {renderCartList()}

      {/* Footer */}
      <FooterTotal
        subTotal={totalPrice}
        shippingFee={0.0}
        total={totalPrice}
        onPress={() => navigation.navigate('MyCard')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.radius,
    paddingHorizontal: SIZES.radius,
    borderRadius: SIZES.radius,
  },
});

export default MyCart;
