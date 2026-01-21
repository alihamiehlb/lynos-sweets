import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  ctx: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = 'then' in ctx.params ? await (ctx.params as Promise<{ id: string }>) : (ctx.params as { id: string })
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const data = await request.json()
    const product = await prisma.product.update({
      where: { id: parseInt(params.id, 10) },
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        cost: parseFloat(data.cost),
        imageUrl: data.imageUrl,
        category: data.category,
        isFeatured: data.isFeatured
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = 'then' in ctx.params ? await (ctx.params as Promise<{ id: string }>) : (ctx.params as { id: string })
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    await prisma.product.delete({
      where: { id: parseInt(params.id, 10) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
