export interface User {
  id?: string;
  email: string;
  emailVerified?: boolean;
  displayName?: string;
  lastLoginAt?: string;
  lastRefreshAt?: string;
  phoneNumber?: string;
  photoURL?: string;
  providerUserInfo?: any[];
  validSince?: string;
  publicId?: string;
}
