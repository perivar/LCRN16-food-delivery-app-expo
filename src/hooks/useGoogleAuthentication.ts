import { GoogleAuthProvider } from '@firebase/auth';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { maybeCompleteAuthSession } from 'expo-web-browser';

maybeCompleteAuthSession();

function login(id_token: string) {
  console.log('Signing in with Google...', { id_token });

  try {
    const credential = GoogleAuthProvider.credential(id_token);

    return credential;
  } catch (error) {
    throw error;
  }
}

export default function useGoogleAuthentication() {
  const [request, _, promptAsync] = useIdTokenAuthRequest({
    // ...Constants.manifest?.extra?.google,
    expoClientId: Constants.manifest.extra.expoGoogleClientId,
  });

  async function prompt() {
    const response = await promptAsync();

    if (response?.type !== 'success') {
      throw new Error(response.type);
    }
    const credential = login(response.params.id_token);

    return [credential];
  }

  return [!!request, prompt] as const;
}
