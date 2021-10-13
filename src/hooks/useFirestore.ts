import { useCallback, useEffect, useState } from 'react';
import firebase from '../lib/system/firebase';
import '../lib/firebase';
import { debug } from './useFirebaseAuth';

export type UseFirestore = ReturnType<typeof useFirestore>;

const useFirestore = (errorCallback?: () => void) => {

    const onLikePress = (userId: string, postId: string) => {
        const userPosts = firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId);

        userPosts.collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
            .then(() => {
                userPosts
                    .set(
                        {
                            likesCount: firebase.firestore.FieldValue.increment(1)
                        },
                        {
                            merge: true,
                        });
            }).catch((error) => {
                debug(error);
                errorCallback?.();
            })
    }
    const onDislikePress = (userId: string, postId: string) => {
        const userPosts = firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId);

        userPosts.collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
            .then(() => {
                userPosts.set(
                    {
                        likesCount: firebase.firestore.FieldValue.increment(-1)
                    },
                    {
                        merge: true,
                    });
            }).catch((error) => {
                debug(error);
                errorCallback?.();
            })
    }

    return {
        onLikePress,
        onDislikePress
    };
};

export default useFirestore;
