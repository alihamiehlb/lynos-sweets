import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken, hashPassword } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const data = await request.json()
    const updateData: any = {
      email: data.email,
      name: data.name,
      role: data.role,
      isActive: data.isActive
    }

    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password)
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error('Error updating user:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    await prisma.user.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
