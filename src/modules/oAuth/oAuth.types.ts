import { GoogleUserCreateDto } from './dtos';

export type OAuthResponse = GoogleUserCreateDto & {
  picture: string;
  refreshToken: string;
  accessToken: string;
};
