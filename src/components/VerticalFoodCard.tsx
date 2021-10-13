import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleProp,
  ViewStyle,
} from 'react-native';
import firebase from '../lib/system/firebase';
import { COLORS, FONTS, SIZES, icons } from '../constants';
import { IProductInfo } from '../constants/types';
import useFirestore from '../hooks/useFirestore';

interface IVerticalFoodCard {
  containerStyle: StyleProp<ViewStyle>;
  item: IProductInfo;
  onPress(): void;
}

const VerticalFoodCard = ({
  containerStyle,
  item,
  onPress,
}: IVerticalFoodCard) => {
  const [isLiked, setIsLiked] = useState<boolean>();
  const {
    onLikePress,
    onDislikePress,
  } = useFirestore();

  const foodItem = item;

  // TODO: I believe this is a very NON-performant way of getting likes
  // this gets one and one like, instead of listening to all the likes
  // an user have done, which probably is much better
  useEffect(() => {
    const unsubscribe =
      firebase
        .firestore()
        .collection("posts")
        .doc(foodItem.userId)
        .collection("userPosts")
        .doc(foodItem.productId.toString())
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .onSnapshot((doc) => {
          setIsLiked(false);
          if (doc.exists) {
            // the document is empty (using .set({}) so exist is enough)
            setIsLiked(true);
          }
        });

    // remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
    return () => unsubscribe()
  }, []);

  const likeHandler = () => {
    if (isLiked) {
      onDislikePress(foodItem.userId, foodItem.productId.toString())
    } else {
      onLikePress(foodItem.userId, foodItem.productId.toString())
    }
    setIsLiked(!isLiked);
  }

  return (
    <TouchableOpacity
      style={[
        {
          width: 200,
          padding: SIZES.radius,
          alignItems: 'center',
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.lightGray2,
        },
        containerStyle,
      ]}
      onPress={onPress}>
      {/* Calories and Favourite */}
      <View style={{ flexDirection: 'row' }}>
        {/* Calories */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Image
            source={icons.calories}
            style={{
              width: 30,
              height: 30,
            }}
          />
          <Text style={{ color: COLORS.darkGray2, ...FONTS.body5 }}>
            {foodItem.calories} Calories
          </Text>
        </View>

        {/* Favourite */}
        <TouchableOpacity
          onPress={() => likeHandler()}>
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

      {/* Image */}
      <View
        style={{
          height: 150,
          width: 150,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={foodItem.image}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </View>

      {/* Info */}
      <View
        style={{
          alignItems: 'center',
          marginTop: -20,
        }}>
        <Text style={{ ...FONTS.h3 }}>{foodItem.name}</Text>
        <Text
          style={{
            color: COLORS.darkGray2,
            textAlign: 'center',
            ...FONTS.body5,
          }}>
          {foodItem.description}
        </Text>
        <Text style={{ marginTop: SIZES.radius, ...FONTS.h2 }}>
          ${foodItem.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default VerticalFoodCard;
