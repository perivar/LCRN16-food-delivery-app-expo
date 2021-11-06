import { EmailAuthProvider } from '@firebase/auth';

function login(email: string, password: string) {
  console.log('Signing in with email and password...', { email, password });

  try {
    // login using OAuthCredential, and create user if it doesn't exist
    var credential = EmailAuthProvider.credential(email, password);

    return credential;
  } catch (error) {
    throw error;
  }
}

export default function useEmailPasswordAuthentication() {
  return [login];
}
