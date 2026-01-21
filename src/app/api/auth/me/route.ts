import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const user = await getUserFromToken(token)
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  return NextResponse.json({ user })
}
