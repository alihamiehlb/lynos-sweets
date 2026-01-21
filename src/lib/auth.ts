import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthUser {
  id: number
  email: string
  name: string | null
  role: 'ADMIN' | 'USER'
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch {
    return null
  }
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  const decoded = verifyToken(token)
  if (!decoded) return null

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, name: true, role: true, isActive: true }
  })

  if (!user || !user.isActive) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as 'ADMIN' | 'USER'
  }
}
