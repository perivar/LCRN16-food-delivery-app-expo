import type { AuthCredential } from '@firebase/auth';
import {
  getAuth,
  signInWithCredential,
  updateEmail,
  updateProfile,
} from '@firebase/auth';

export default async function loginWithCredential(
  credential: AuthCredential,
  data?: any
) {
  console.log('Logging in with credential', credential, data);

  const auth = getAuth();
  const { user } = await signInWithCredential(auth, credential);

  console.log('Signed in with credential. Updating profile details...');

  if (data?.email && !user.email) {
    await updateEmail(user, data.email);
  }

  if (data?.displayName && !user.displayName) {
    await updateProfile(user, { displayName: data.displayName });
  }

  return user;
}
