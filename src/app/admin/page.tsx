'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stats {
  totalProducts: number
  totalSales: number
  totalRevenue: number
  totalCost: number
  totalMargin: number
  marginPercentage: string
  totalUsers: number
  totalAdmins: number
  topProducts: Array<{
    id: number
    name: string
    totalSold: number
    saleCount: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.status === 401 || res.status === 403) {
        router.push('/admin/login')
        return
      }
      if (!res.ok) return
      const data = await res.json()
      setUser(data.user)
    } catch {
      // Don't force logout on transient failures (e.g. temporary DB issues).
      return
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Lynos Sweets Admin
              </h1>
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 underline-offset-4 hover:underline"
              >
                View site
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/products" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-sm text-gray-600 mb-1">Products</div>
            <div className="text-3xl font-bold text-pink-600">{stats?.totalProducts || 0}</div>
          </Link>
          <Link href="/admin/categories" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-sm text-gray-600 mb-1">Categories</div>
            <div className="text-3xl font-bold text-purple-600">{'—'}</div>
          </Link>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Sales</div>
            <div className="text-3xl font-bold text-purple-600">{stats?.totalSales || 0}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Revenue</div>
            <div className="text-3xl font-bold text-green-600">${stats?.totalRevenue.toFixed(2) || '0.00'}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Margin</div>
            <div className="text-3xl font-bold text-indigo-600">{stats?.marginPercentage || '0'}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Financial Overview</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold text-green-600">${stats?.totalRevenue.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Cost</span>
                <span className="font-semibold text-red-600">${stats?.totalCost.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-800 font-semibold">Net Margin</span>
                <span className="font-bold text-indigo-600">${stats?.totalMargin.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Top Products</h2>
            <div className="space-y-2">
              {stats?.topProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-gray-700">{product.name}</span>
                  <span className="text-pink-600 font-semibold">{product.totalSold} sold</span>
                </div>
              ))}
              {(!stats?.topProducts || stats.topProducts.length === 0) && (
                <p className="text-gray-400 text-sm">No sales yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/admin/products" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-2xl mb-2">🍬</div>
            <h3 className="text-lg font-semibold mb-1">Manage Products</h3>
            <p className="text-sm text-gray-600">Add, edit, or delete Lynos Sweets products</p>
          </Link>
          <Link href="/admin/categories" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-2xl mb-2">🏷️</div>
            <h3 className="text-lg font-semibold mb-1">Manage Categories</h3>
            <p className="text-sm text-gray-600">Create categories like Drinks, Boxes, Specials</p>
          </Link>
          <Link href="/admin/users" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="text-lg font-semibold mb-1">Manage Users</h3>
            <p className="text-sm text-gray-600">View and manage users and admins</p>
          </Link>
          <Link href="/admin/sales" className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-lg font-semibold mb-1">View Sales</h3>
            <p className="text-sm text-gray-600">Track sales history and analytics</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
