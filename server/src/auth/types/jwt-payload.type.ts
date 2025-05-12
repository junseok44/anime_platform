export type TokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  type: TokenType;
}
