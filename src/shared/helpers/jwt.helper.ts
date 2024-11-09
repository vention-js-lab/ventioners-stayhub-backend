import { JwtPayload } from 'jsonwebtoken';
import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'blogmanagement';

export function generateToken(id: string, expireDate: string): string {
  return sign({ id }, JWT_SECRET, {
    expiresIn: expireDate,
  });
}

export function verifyToken(token: string): JwtPayload | string {
  try {
    return verify(token, JWT_SECRET);
  } catch (error) {
    return 'error';
  }
}
