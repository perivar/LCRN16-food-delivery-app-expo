import '../lib/firebase';

import { getAuth } from '@firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  FieldValue,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { ICartItem } from '../constants/types';
import { User } from '../redux/slices/auth';
import { UserCredentials } from './useFirebaseAuth';

export type UseFirestore = ReturnType<typeof useFirestore>;

export interface Order {
  id?: string;
  displayName?: string;
  uid: string;
  email: string;
  products: ICartItem[];
  deliveryAddress: string;
  billingAddress: string;
  comments: string;
  completed: boolean;
  createdAt: FieldValue;
}

const useFirestore = (errorCallback?: () => void) => {
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;

  const addLike = (creatorId: string, postId: string, email: string) => {
    try {
      const id = email ?? currentUser?.uid;

      const likeRef = doc(
        db,
        'posts',
        creatorId,
        'userPosts',
        postId,
        'likes',
        id
      );

      // using set with merge to create the field if it doesn't exist yet
      setDoc(likeRef, {}, { merge: true }).then(() => {
        const userPostRef = doc(db, 'posts', creatorId, 'userPosts', postId);
        // and increment count
        setDoc(
          userPostRef,
          {
            likesCount: increment(1),
          },
          { merge: true }
        ).then(() => {
          console.log('Successfully added like');
        });
      });
    } catch (error) {
      console.error(error);
      errorCallback?.();
    }
  };

  const deleteLike = (creatorId: string, postId: string, email: string) => {
    try {
      const id = email ?? currentUser?.uid;

      const likeRef = doc(
        db,
        'posts',
        creatorId,
        'userPosts',
        postId,
        'likes',
        id
      );
      // using update to throw error if the field doesn't exist yet
      deleteDoc(likeRef).then(() => {
        const userPostRef = doc(db, 'posts', creatorId, 'userPosts', postId);
        // and decrement count
        updateDoc(userPostRef, {
          likesCount: increment(-1),
        }).then(() => {
          console.log('Successfully removed like');
        });
      });
    } catch (error) {
      console.error(error);
      errorCallback?.();
    }
  };

  // TODO: I believe this is a very NON-performant way of getting likes
  // this gets one and one like, instead of listening to all the likes
  // an user have done, which probably is much better
  const subscribeToLikeChanges = (
    creatorId: string,
    postId: string,
    email: string,
    setIsLiked: Function
  ) => {
    const id = email ?? currentUser?.uid;

    const likeRef = doc(
      db,
      'posts',
      creatorId,
      'userPosts',
      postId,
      'likes',
      id
    );

    const unsubscribe = onSnapshot(
      likeRef,
      likeDoc => {
        setIsLiked(false);
        if (likeDoc.exists()) {
          // console.log(creatorId, postId, likeDoc.id);
          // the document is empty (using setDoc with {} so exist is enough)
          setIsLiked(true);
        }
      },
      error => {
        console.error(error);
        errorCallback?.();
      }
    );
    return unsubscribe;
  };

  const addToFavorites = (productId: string, email: string) => {
    try {
      const id = email ?? currentUser?.uid;

      const favouriteRef = doc(db, 'users', id, 'favorites', productId);
      getDoc(favouriteRef).then(favouriteDoc => {
        if (favouriteDoc.exists()) {
          console.log('Product already in favorites');
        } else {
          // using set to create the field if it doesn't exist yet
          setDoc(favouriteRef, {}).then(() => {
            console.log('Successfully added to favorites');
          });
        }
      });
    } catch (error) {
      console.error(error);
      errorCallback?.();
    }
  };

  const deleteFromFavorites = (productId: string, email: string) => {
    try {
      const id = email ?? currentUser?.uid;

      const favouriteRef = doc(db, 'users', id, 'favorites', productId);
      deleteDoc(favouriteRef).then(() => {
        console.log('Product removed from favorites');
      });
    } catch (error) {
      console.error(error);
      errorCallback?.();
    }
  };

  const addNewOrder = async (
    user: User,
    cart: ICartItem[],
    deliveryAddress: string,
    billingAddress: string,
    comments?: string
  ) => {
    try {
      const now = serverTimestamp();

      const newOrder: Order = {
        uid: user.uid,
        email: user.email,
        products: cart,
        deliveryAddress: deliveryAddress,
        billingAddress: billingAddress,
        comments: comments ?? '',
        completed: false,
        createdAt: now,
      };

      const responseOrder: Order = {
        ...newOrder,
      };

      const document = await addDoc(collection(db, 'orders'), newOrder);

      const { id: orderId } = document;
      responseOrder.id = orderId;

      await addDoc(collection(db, 'users', `${user.email}`, 'orders'), {
        orderId,
      });

      console.log(`Order ${orderId} placed successfully`);
      return responseOrder;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getAllOrders = async () => {
    try {
      let orders: Order[] = [];
      const ordersSnapshots = await getDocs(collection(db, 'orders'));
      const usersPromises: Promise<DocumentSnapshot<DocumentData>>[] = [];

      ordersSnapshots.forEach(orderSnapshot => {
        orders.push({
          id: orderSnapshot.id,
          uid: orderSnapshot.data().uid,
          email: orderSnapshot.data().email,
          products: orderSnapshot.data().products,
          deliveryAddress: orderSnapshot.data().deliveryAddress,
          billingAddress: orderSnapshot.data().billingAddress,
          comments: orderSnapshot.data().comments,
          completed: orderSnapshot.data().completed,
          createdAt: orderSnapshot.data().createdAt,
        });
        usersPromises.push(
          getDoc(doc(db, `/users/${orderSnapshot.data().email}`))
        );
      });

      const usersSnapshots = await Promise.all(usersPromises);

      orders.map(order => {
        usersSnapshots.forEach(snapshot => {
          if (order.email === (snapshot.data() as UserCredentials).email)
            order.displayName = `${snapshot.data().displayName}`;
        });
      });

      return orders;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getOrderDetails = async (orderId: string) => {
    try {
      const orderDocument = await getDoc(doc(db, `/orders/${orderId}`));

      if (orderDocument.exists()) {
        let orderData = orderDocument.data() as Order;
        orderData.id = orderDocument.id;
        const productsPromises: Promise<DocumentSnapshot<DocumentData>>[] = [];

        orderData.products.forEach(product => {
          const promise = getDoc(doc(db, `/products/${product.productId}`));
          productsPromises.push(promise);
        });

        // TODO: fix a interface for the product data
        const productsSnapshots = await Promise.all(productsPromises);

        const productsData: any = [];

        productsSnapshots.forEach((product: any) => {
          let productData: any = {};
          productData = product.data();
          productData.id = product.id;
          productsData.push(productData);
        });

        orderData.products.map((product: any) => {
          productsData.forEach((productData: any) => {
            if (productData.id === product.productId) {
              product.details = productData;
            }
          });
        });

        return orderData;
      }
      console.log('Order not found');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const orderDocument = await getDoc(doc(db, `/orders/${orderId}`));

      if (!orderDocument.exists()) {
        console.log('Order not found');
        return;
      }

      await deleteDoc(doc(db, `/orders/${orderId}`));
      console.log(`Order ${orderId} deleted successfully`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateOrder = async (order: Order) => {
    try {
      if (order.id || order.createdAt || order.products) {
        console.log('Not allowed to edit');
        return;
      }

      await updateDoc(doc(db, `/orders/${order.id}`), { order });
      console.log(`Order ${order.id} updated successfully`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    addLike,
    deleteLike,
    subscribeToLikeChanges,
    addToFavorites,
    deleteFromFavorites,
    addNewOrder,
    getAllOrders,
    getOrderDetails,
    deleteOrder,
    updateOrder,
  };
};

export default useFirestore;
