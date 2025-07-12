export const OAUTH_PROVIDERS = {
    google: {
      clientId: 'GOOGLE_CLIENT_ID',
      clientSecret: 'GOOGLE_CLIENT_SECRET',
      redirectUri: 'http://localhost:3000/auth/callback/google',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      scope: 'openid email profile',
    },
    microsoft: {
      clientId: 'MICROSOFT_CLIENT_ID',
      clientSecret: 'MICROSOFT_CLIENT_SECRET',
      redirectUri: 'http://localhost:3000/auth/callback/microsoft',
      authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
      scope: 'openid email profile User.Read',
    },
  };
  