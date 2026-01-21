import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    const [products, sales, users, admins] = await Promise.all([
      prisma.product.count(),
      prisma.sale.findMany({
        include: { product: true }
      }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } })
    ])

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.salePrice * sale.quantity, 0)
    const totalCost = sales.reduce((sum, sale) => sum + sale.costPrice * sale.quantity, 0)
    const totalMargin = totalRevenue - totalCost
    const marginPercentage = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0

    const topProducts = await prisma.sale.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: true,
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        })
        return {
          ...product,
          totalSold: item._sum.quantity || 0,
          saleCount: item._count
        }
      })
    )

    return NextResponse.json({
      totalProducts: products,
      totalSales: sales.length,
      totalRevenue,
      totalCost,
      totalMargin,
      marginPercentage: marginPercentage.toFixed(2),
      totalUsers: users,
      totalAdmins: admins,
      topProducts: topProductsWithDetails
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
