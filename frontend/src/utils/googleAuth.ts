// Google OAuth utility functions

export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Google OAuth script'));
    document.head.appendChild(script);
  });
};

export const getGoogleUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching Google user info:', error);
    throw error;
  }
};

export const handleGoogleLogin = async (): Promise<{
  idToken_name: string;
  idToken_email: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error('Google OAuth not initialized'));
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your_google_client_id_here') {
      reject(new Error('Google Client ID not configured. Please update your .env file.'));
      return;
    }

    window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile openid',
      callback: async (response: any) => {
        try {
          const userInfo = await getGoogleUserInfo(response.access_token);
          
          // Return the user info in the format expected by your backend
          resolve({
            idToken_name: userInfo.name || userInfo.given_name || 'Unknown User',
            idToken_email: userInfo.email,
          });
        } catch (error) {
          console.error('Google login error:', error);
          reject(error);
        }
      },
    }).requestAccessToken();
  });
};
