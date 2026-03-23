/**
 * JWT Utility
 */

import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "default_secret_change_in_production";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export interface JwtPayload {
  userId: number;
  email: string;
  roleId: number;
  roleName?: string;
}

export class JwtUtil {
  static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return null;
    }
  }
}
