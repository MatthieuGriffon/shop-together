export {};

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      getLoginStatus: (callback: (response: FacebookLoginStatusResponse) => void) => void;
      init: (options: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      AppEvents: {
        logPageView: () => void;
      };
    };
  }

interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
}

interface FacebookLoginStatusResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse?: FacebookAuthResponse;
}
}