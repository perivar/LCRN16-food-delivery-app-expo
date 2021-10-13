export interface IProductInfo {
  userId: string;
  productId: number;
  name: string;
  description: string;
  longDescription?: string;
  categories: number[];
  price: number;
  calories: number;
  isFavourite: boolean;
  image: any;
}

export interface ICartItem extends IProductInfo {
  quantity: number;
}

export interface ICard {
  productId: number;
  name: string;
  icon: any;
  card_no?: string;
  key?: string;
}
