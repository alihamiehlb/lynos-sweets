'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Category = {
  id: number
  name: string
  slug: string
  isActive: boolean
  sortOrder: number
}

export default function CategoriesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({ name: '', sortOrder: '0' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchCategories()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      if (res.status === 401 || res.status === 403) {
        router.push('/admin/login')
        return
      }
      if (!res.ok) {
        setAuthError('Auth check failed temporarily. Please refresh.')
      }
    } catch {
      setAuthError('Network error checking login. Please refresh.')
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          sortOrder: form.sortOrder
        })
      })
      if (res.ok) {
        setForm({ name: '', sortOrder: '0' })
        fetchCategories()
      }
    } finally {
      setSaving(false)
    }
  }

  const deactivateCategory = async (id: number) => {
    if (!confirm('Remove this category? (Products will keep their existing category text.)')) return
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (res.ok) fetchCategories()
  }

  const sorted = useMemo(() => {
    return [...categories].sort((a, b) => (a.sortOrder - b.sortOrder) || a.name.localeCompare(b.name))
  }, [categories])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Lynos Sweets Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" prefetch={false} className="text-gray-600 hover:text-gray-900">
                View site
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-600 mt-1">Create categories like Drinks, Dessert Boxes, Cakes, Specials — anything.</p>
        </div>

        {authError && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {authError}
          </div>
        )}

        <form onSubmit={createCategory} className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_160px] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Drinks"
                required
                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-60"
            >
              {saving ? 'Saving…' : '+ Add'}
            </button>
          </div>
        </form>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y">
            {sorted.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500">slug: {c.slug} · order: {c.sortOrder}</div>
                </div>
                <button
                  onClick={() => deactivateCategory(c.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            {sorted.length === 0 && (
              <div className="px-6 py-8 text-sm text-gray-500">No categories yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

