import firebase from '../lib/system/firebase';
import '../lib/firebase';
import { debug, UserCredentials } from './useFirebaseAuth';
import { User } from '../redux/slices/auth';
import { ICartItem } from '../constants/types';

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
  createdAt: firebase.firestore.FieldValue;
}

const useFirestore = (errorCallback?: () => void) => {
  const database = firebase.firestore();
  const currentUser = firebase.auth().currentUser;

  const addLike = (creatorId: string, postId: string, email: string) => {
    const id = email ?? currentUser?.uid;

    const userPosts = database
      .collection('posts')
      .doc(creatorId)
      .collection('userPosts')
      .doc(postId);

    // using set to create the field if it doesn't exist yet
    userPosts
      .collection('likes')
      .doc(id)
      .set({})
      .then(() => {
        userPosts.set(
          {
            likesCount: firebase.firestore.FieldValue.increment(1),
          },
          {
            merge: true,
          }
        );
        console.log('Successfully added like');
      })
      .catch(error => {
        debug(error);
        errorCallback?.();
      });
  };

  const deleteLike = (creatorId: string, postId: string, email: string) => {
    const id = email ?? currentUser?.uid;

    const userPosts = database
      .collection('posts')
      .doc(creatorId)
      .collection('userPosts')
      .doc(postId);

    // using update to throw error if the field doesn't exist yet
    userPosts
      .collection('likes')
      .doc(id)
      .delete()
      .then(() => {
        userPosts.update({
          likesCount: firebase.firestore.FieldValue.increment(-1),
        });
        console.log('Successfully removed like');
      })
      .catch(error => {
        debug(error);
        errorCallback?.();
      });
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

    return database
      .collection('posts')
      .doc(creatorId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(id)
      .onSnapshot(
        doc => {
          setIsLiked(false);
          if (doc.exists) {
            // the document is empty (using .set({}) so exist is enough)
            setIsLiked(true);
          }
        },
        error => {
          console.log(error);
          errorCallback?.();
        }
      );
  };

  const addToFavorites = (productId: string, email: string) => {
    const id = email ?? currentUser?.uid;

    try {
      const document = database
        .collection('users')
        .doc(id)
        .collection('favorites')
        .doc(productId)
        .get();

      document.then(doc => {
        if (doc.exists) {
          console.log('Product already in favorites');
        } else {
          database
            .collection('users')
            .doc(id)
            .collection('favorites')
            .doc(productId)
            .set({});
          console.log('Successfully added to favorites');
        }
      });
    } catch (error) {
      console.log(error);
      errorCallback?.();
    }
  };

  const deleteFromFavorites = (productId: string, email: string) => {
    const id = email ?? currentUser?.uid;

    try {
      database
        .collection('users')
        .doc(id)
        .collection('favorites')
        .doc(productId)
        .delete();

      console.log('Product removed from favorites');
    } catch (error) {
      console.log(error);
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
    const now = firebase.firestore.FieldValue.serverTimestamp();

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

    try {
      const responseOrder: Order = {
        ...newOrder,
      };
      const document = await database.collection('orders').add(newOrder);
      const { id: orderId } = document;
      responseOrder.id = orderId;
      await database
        .collection('users')
        .doc(`${user.email}`)
        .collection('orders')
        .add({ orderId });

      console.log(`Order ${orderId} placed successfully`);
      return responseOrder;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getAllOrders = async () => {
    try {
      let orders: Order[] = [];
      const ordersSnapshots = await database.collection('orders').get();
      const usersPromises: Promise<
        firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
      >[] = [];

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
          database.doc(`/users/${orderSnapshot.data().email}`).get()
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
      console.log(error);
      throw error;
    }
  };

  const getOrderDetails = async (orderId: string) => {
    try {
      const orderDocument = await database.doc(`/orders/${orderId}`).get();

      if (orderDocument.exists) {
        let orderData = orderDocument.data() as Order;
        orderData.id = orderDocument.id;
        const productsPromises: Promise<
          firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
        >[] = [];

        orderData.products.forEach(product => {
          const promise = database.doc(`/products/${product.productId}`).get();
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
      const documentSnapshot = await database.doc(`/orders/${orderId}`).get();

      if (!documentSnapshot.exists) {
        console.log('Order not found');
        return;
      }

      await database.doc(`/orders/${orderId}`).delete();

      console.log(`Order ${orderId} deleted successfully`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateOrder = async (order: Order) => {
    if (order.id || order.createdAt || order.products) {
      console.log('Not allowed to edit');
      return;
    }

    try {
      await database.collection('orders').doc(`${order.id}`).update(order);
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
