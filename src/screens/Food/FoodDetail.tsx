import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  CartQuantityButton,
  Header,
  IconButton,
  IconLabel,
  LineDivider,
  Rating,
  StepperInput,
  TextButton,
} from '../../components';
import {
  COLORS,
  dummyData,
  FONTS,
  icons,
  images,
  SIZES,
} from '../../constants';
import { ICartItem } from '../../constants/types';
import useFirestore from '../../hooks/useFirestore';
import { userSelector } from '../../redux/slices/auth';
import { addToCart, totalQuantitySelector } from '../../redux/slices/cart';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import { RootStackParamList } from '../../types';

type FoodDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FoodDetail'
>;
type FoodDetailRouteProp = RouteProp<RootStackParamList, 'FoodDetail'>;

// if using RootStackScreenProps:
// const FoodDetail = ({
//   navigation,
//   route,
// }: RootStackScreenProps<'FoodDetail'>) => {

// if using useNavigation and useRoute hooks:
const FoodDetail = () => {
  const navigation = useNavigation<FoodDetailNavigationProp>();
  const route = useRoute<FoodDetailRouteProp>();
  // console.log(JSON.stringify(route.params?.item));

  const user = useAppSelector(userSelector);

  const foodItem = route.params?.item;
  const [selectedSize, setSelectedSize] = React.useState<number>(0);
  const [quantity, setQuantity] = React.useState<number>(1);

  const cartQuantity = useAppSelector(totalQuantitySelector);
  const dispatch = useAppDispatch();

  const handleAddCart = () => {
    const cartItem: ICartItem = {
      ...foodItem,
      quantity,
    };
    dispatch(addToCart(cartItem));
  };

  const [isLiked, setIsLiked] = useState<boolean>();
  const { addLike, deleteLike, subscribeToLikeChanges } = useFirestore();

  useEffect(() => {
    const unsubscribe = subscribeToLikeChanges(
      foodItem.creatorId,
      foodItem.name,
      user.email,
      setIsLiked
    );

    // remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
    return () => unsubscribe();
  }, []);

  const likeHandler = () => {
    if (isLiked) {
      deleteLike(foodItem.creatorId, foodItem.name, user.email);
    } else {
      addLike(foodItem.creatorId, foodItem.name, user.email);
    }
    setIsLiked(!isLiked);
  };

  function renderHeader() {
    return (
      <Header
        title="DETAILS"
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
        rightComponent={
          <CartQuantityButton
            quantity={cartQuantity}
            onPress={() => {
              navigation.navigate('MyCart');
            }}
          />
        }
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
        }}>
        {/* Food Card */}
        <View
          style={{
            height: 190,
            borderRadius: 15,
            backgroundColor: COLORS.lightGray2,
          }}>
          {/* Calories & Favourite */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: SIZES.base,
              paddingHorizontal: SIZES.radius,
            }}>
            {/* Calories */}
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={icons.calories}
                style={{
                  width: 30,
                  height: 30,
                }}
              />

              <Text
                style={{
                  color: COLORS.darkGray2,
                  ...FONTS.body4,
                }}>
                {foodItem?.calories} calories
              </Text>
            </View>

            {/* Favourite */}
            <TouchableOpacity onPress={() => likeHandler()}>
              <Image
                source={icons.love}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: isLiked ? COLORS.primary : COLORS.gray,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Food Image */}
          <Image
            source={foodItem?.image}
            resizeMode="contain"
            style={{
              height: 170,
              width: '100%',
            }}
          />
        </View>

        {/* Food Info */}
        <View
          style={{
            marginTop: SIZES.padding,
          }}>
          {/* Name & description */}
          <Text style={{ ...FONTS.h1 }}>{foodItem?.name}</Text>
          <Text
            style={{
              marginTop: SIZES.base,
              color: COLORS.darkGray,
              textAlign: 'justify',
              ...FONTS.body3,
            }}>
            {foodItem?.longDescription}
          </Text>
          {/* Ratings, Duration & Shipping */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: SIZES.padding,
            }}>
            {/* Ratings */}
            <IconLabel
              containerStyle={{
                backgroundColor: COLORS.primary,
              }}
              icon={icons.star}
              label="4.5"
              labelStyle={{
                color: COLORS.white,
              }}
            />

            {/* Duration */}
            <IconLabel
              containerStyle={{
                marginLeft: SIZES.radius,
                paddingHorizontal: 0,
              }}
              icon={icons.clock}
              iconStyle={{
                tintColor: COLORS.black,
              }}
              label="380 Mins"
            />

            {/* Shipping */}
            <IconLabel
              containerStyle={{
                marginLeft: SIZES.radius,
                paddingHorizontal: 0,
              }}
              icon={icons.dollar}
              iconStyle={{
                tintColor: COLORS.black,
              }}
              label="Free Shipping"
            />
          </View>

          {/* Sizes */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: SIZES.padding,
              alignItems: 'center',
            }}>
            <Text style={{ ...FONTS.h3 }}>Sizes:</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginLeft: SIZES.padding,
              }}>
              {dummyData.sizes.map((item, index) => {
                return (
                  <TextButton
                    key={`Sizes-${index}`}
                    buttonContainerStyle={{
                      width: 55,
                      height: 55,
                      margin: SIZES.base,
                      borderWidth: 1,
                      borderRadius: SIZES.radius,
                      borderColor:
                        selectedSize === item.id
                          ? COLORS.primary
                          : COLORS.gray2,
                      backgroundColor:
                        selectedSize === item.id ? COLORS.primary : null,
                    }}
                    label={item.label}
                    labelStyle={{
                      color:
                        selectedSize === item.id ? COLORS.white : COLORS.gray2,
                      ...FONTS.body2,
                    }}
                    onPress={() => setSelectedSize(item.id)}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }

  function renderRestaurant() {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: SIZES.padding,
          paddingHorizontal: SIZES.padding,
          alignItems: 'center',
        }}>
        <Image
          source={images.profile}
          style={{
            width: 50,
            height: 50,
            borderRadius: SIZES.radius,
          }}
        />
        {/* Info */}
        <View
          style={{
            flex: 1,
            marginLeft: SIZES.radius,
            justifyContent: 'center',
          }}>
          <Text style={{ ...FONTS.h3 }}>ByProgrammers</Text>
          <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>
            1.2 KM away from you
          </Text>
        </View>
        {/* Ratings */}
        <Rating
          rating={4}
          iconStyle={{
            marginLeft: 3,
          }}
        />
      </View>
    );
  }

  function renderFooter() {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 120,
          alignItems: 'center',
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.radius,
        }}>
        {/* Stepper Input */}
        <StepperInput
          value={quantity}
          onAdd={() => setQuantity(quantity + 1)}
          onMinus={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
        />

        {/* Text Button */}
        <TextButton
          buttonContainerStyle={{
            flex: 1,
            flexDirection: 'row',
            height: 60,
            marginLeft: SIZES.radius,
            paddingHorizontal: SIZES.radius,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.primary,
          }}
          label="Buy Now"
          label2={`$${foodItem?.price}`}
          onPress={() => {
            handleAddCart();
            navigation.navigate('MyCart');
          }}
        />
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
        {/* Food Detail */}
        {renderDetails()}

        <LineDivider />

        {/* Restaurant */}
        {renderRestaurant()}
      </ScrollView>

      {/* Footer */}
      <LineDivider />
      {renderFooter()}
    </View>
  );
};

export default FoodDetail;
