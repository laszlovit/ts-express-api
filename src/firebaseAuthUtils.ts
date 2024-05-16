import axios from 'axios';

export async function exchangeCustomToken(
  customToken: string,
): Promise<{ idToken: string; refreshToken: string }> {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        token: customToken,
        returnSecureToken: true,
      },
    );

    const { idToken, refreshToken } = response.data;

    return { idToken, refreshToken };
  } catch (error: any) {
    console.error('Error exchanging custom token:', error.message);
    throw new Error('Failed to exchange custom token');
  }
}
