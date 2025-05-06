import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  accessTokenExpiresIn: '1h',
  refreshTokenExpiresIn: '7d',
}));
