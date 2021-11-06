import { FacebookAuthProvider } from '@firebase/auth';
import { useAuthRequest } from 'expo-auth-session/providers/facebook';
import Constants from 'expo-constants';
import { maybeCompleteAuthSession } from 'expo-web-browser';

maybeCompleteAuthSession();

function login(access_token: string) {
  console.log('Signing in with Facebook...', { access_token });

  try {
    const credential = FacebookAuthProvider.credential(access_token);

    return credential;
  } catch (error) {
    throw error;
  }
}

export default function useFacebookAuthentication() {
  const [request, _, promptAsync] = useAuthRequest({
    // ...Constants.manifest?.extra?.facebook,
    expoClientId: Constants.manifest.extra.expoFacebookClientId,
  });

  async function prompt() {
    const response = await promptAsync();

    if (response?.type !== 'success') {
      throw new Error(response.type);
    }
    const credential = login(response.params.access_token);

    return [credential];
  }

  return [!!request, prompt] as const;
}
