import firebase from '../lib/system/firebase';
import '../lib/firebase';
import { debug } from './useFirebaseAuth';

export type UseFirestore = ReturnType<typeof useFirestore>;

const useFirestore = (errorCallback?: () => void) => {
  const onLikePress = (userId: string, postId: string) => {
    const userPosts = firebase
      .firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId);

    // using set to create the field if it doesn't exist yet
    userPosts
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
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

  const onDislikePress = (userId: string, postId: string) => {
    const userPosts = firebase
      .firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId);

    // using update to throw error if the field doesn't exist yet
    userPosts
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
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
    userId: string,
    postId: string,
    setIsLiked: Function
  ) => {
    return firebase
      .firestore()
      .collection('posts')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
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
        }
      );
  };

  return {
    onLikePress,
    onDislikePress,
    subscribeToLikeChanges,
  };
};

export default useFirestore;
