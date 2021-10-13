import { LatLng } from 'react-native-maps';
import { ICard, IProductInfo } from './types';

const myProfile = {
  name: 'ByProgrammers',
  profile_image: require('../../assets/images/profile.png'),
  address: 'No. 88, Jln Padungan, Kuching',
};

const categories = [
  {
    id: 1,
    name: 'Fast Food',
    icon: require('../../assets/icons/burger.png'),
  },
  {
    id: 2,
    name: 'Fruit Item',
    icon: require('../../assets/icons/cherry.png'),
  },
  {
    id: 3,
    name: 'Rice Item',
    icon: require('../../assets/icons/rice.png'),
  },
];

const hamburger: IProductInfo = {
  productId: 1,
  userId: 'BurgerKing',
  name: 'Hamburger',
  description: 'Chicken patty hamburger',
  longDescription: 'Chicken patty hamburger',
  categories: [1, 2],
  price: 15.99,
  calories: 78,
  isFavourite: true,
  image: require('../../assets/dummyData/hamburger.png'),
};

const hotTacos: IProductInfo = {
  productId: 2,
  userId: 'Mexicana',
  name: 'Hot Tacos',
  description: 'Mexican tortilla & tacos',
  longDescription: 'Mexican tortilla & tacos',
  categories: [1, 3],
  price: 10.99,
  calories: 82,
  isFavourite: false,
  image: require('../../assets/dummyData/hot_tacos.png'),
};

const vegBiryani: IProductInfo = {
  productId: 3,
  userId: 'Indian',
  name: 'Veg Biryani',
  description: 'Indian Vegetable Biryani',
  longDescription:
    'A popular spice and vegetables mixed favoured rice dish which is typically prepared by layering the biryani gravy and basmati rice in flat bottom vessel.',
  categories: [1, 2, 3],
  price: 13.99,
  calories: 95,
  isFavourite: true,
  image: require('../../assets/dummyData/veg_biryani.png'),
};

const wrapSandwich: IProductInfo = {
  productId: 4,
  userId: 'BurgerKing',
  name: 'Wrap Sandwich',
  description: 'Grilled vegetables sandwich',
  longDescription: 'Grilled vegetables sandwich',
  categories: [1, 2],
  price: 9.99,
  calories: 59,
  isFavourite: true,
  image: require('../../assets/dummyData/wrap_sandwich.png'),
};

const menu = [
  {
    id: 1,
    name: 'Featured',
    list: [hamburger, hotTacos, vegBiryani],
  },
  {
    id: 2,
    name: 'Nearby you',
    list: [hamburger, vegBiryani, wrapSandwich],
  },
  {
    id: 3,
    name: 'Popular',
    list: [hamburger, hotTacos, wrapSandwich],
  },
  {
    id: 4,
    name: 'Newest',
    list: [hamburger, hotTacos, vegBiryani],
  },
  {
    id: 5,
    name: 'Trending',
    list: [hamburger, vegBiryani, wrapSandwich],
  },
  {
    id: 6,
    name: 'Recommended',
    list: [hamburger, hotTacos, wrapSandwich],
  },
];

const sizes = [
  {
    id: 1,
    label: '12"',
  },
  {
    id: 2,
    label: '14"',
  },
  {
    id: 3,
    label: '16"',
  },
  {
    id: 4,
    label: '18"',
  },
];

const myCart = [
  {
    ...hamburger,
    qty: 1,
  },
  {
    ...hotTacos,
    qty: 2,
  },
  {
    ...vegBiryani,
    qty: 1,
  },
];

const myCards: ICard[] = [
  {
    productId: 1,
    name: 'Master Card',
    icon: require('../../assets/icons/mastercard.png'),
    card_no: '1234',
  },
  {
    productId: 2,
    name: 'Google Pay',
    icon: require('../../assets/icons/google.png'),
    card_no: '1234',
  },
];

const allCards: ICard[] = [
  {
    productId: 1,
    name: 'Apple Pay',
    icon: require('../../assets/icons/apple.png'),
  },
  {
    productId: 2,
    name: 'Visa',
    icon: require('../../assets/icons/visa.png'),
  },
  {
    productId: 3,
    name: 'PayPal',
    icon: require('../../assets/icons/paypal.png'),
  },
  {
    productId: 4,
    name: 'Google Pay',
    icon: require('../../assets/icons/google.png'),
  },
  {
    productId: 5,
    name: 'Master Card',
    icon: require('../../assets/icons/mastercard.png'),
  },
];

const fromLocs: LatLng[] = [
  {
    latitude: 58.85524552763719,
    longitude: 5.7201897059969475,
  },
  {
    latitude: 58.85260105183051,
    longitude: 5.743285908320634,
  },
  {
    latitude: 1.5238753474714375,
    longitude: 110.34261833833622,
  },
  {
    latitude: 1.5578068150528928,
    longitude: 110.35482523764315,
  },
  {
    latitude: 1.558050496260768,
    longitude: 110.34743759630511,
  },
  {
    latitude: 1.5573478487252896,
    longitude: 110.35568783282145,
  },
];

export default {
  vegBiryani,
  myProfile,
  categories,
  menu,
  sizes,
  myCart,
  myCards,
  allCards,
  fromLocs,
};
