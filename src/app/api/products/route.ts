import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        cost: parseFloat(data.cost),
        imageUrl: data.imageUrl,
        category: data.category,
        isFeatured: data.isFeatured || false
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
