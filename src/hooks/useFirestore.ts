import firebase from '../lib/system/firebase';
import '../lib/firebase';
import { debug } from './useFirebaseAuth';

export type UseFirestore = ReturnType<typeof useFirestore>;

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
    } catch (err) {
      console.log(err);
      errorCallback?.();
    }
  };

  return {
    addLike,
    deleteLike,
    subscribeToLikeChanges,
    addToFavorites,
    deleteFromFavorites,
  };
};

export default useFirestore;
