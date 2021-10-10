export interface IProductInfo {
  id: number;
  name: string;
  description: string;
  longDescription?: string;
  categories: number[];
  price: number;
  calories: number;
  isFavourite: boolean;
  image: any;
}

export interface ICard {
  id: number;
  name: string;
  icon: any;
  card_no?: string;
  key?: string;
}
