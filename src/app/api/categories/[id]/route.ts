import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return { ok: false as const, status: 401 as const }
  const user = await getUserFromToken(token)
  if (!user || user.role !== 'ADMIN') return { ok: false as const, status: 403 as const }
  return { ok: true as const }
}

export async function PUT(
  request: NextRequest,
  ctx: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return NextResponse.json({ error: auth.status === 401 ? 'Not authenticated' : 'Not authorized' }, { status: auth.status })

    const params = 'then' in ctx.params ? await (ctx.params as Promise<{ id: string }>) : (ctx.params as { id: string })
    const id = parseInt(params.id, 10)
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const data = await request.json()
    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: typeof data.name === 'string' ? data.name.trim() : undefined,
        slug: typeof data.slug === 'string' ? data.slug.trim() : undefined,
        isActive: typeof data.isActive === 'boolean' ? data.isActive : undefined,
        sortOrder: Number.isFinite(Number(data.sortOrder)) ? Number(data.sortOrder) : undefined
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return NextResponse.json({ error: auth.status === 401 ? 'Not authenticated' : 'Not authorized' }, { status: auth.status })

    const params = 'then' in ctx.params ? await (ctx.params as Promise<{ id: string }>) : (ctx.params as { id: string })
    const id = parseInt(params.id, 10)
    if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    // “Delete” categories safely by deactivating; this avoids breaking existing product.category strings.
    const updated = await prisma.category.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({ success: true, category: updated })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}

