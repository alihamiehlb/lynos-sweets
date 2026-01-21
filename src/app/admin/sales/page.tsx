'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Sale {
  id: number
  productId: number
  quantity: number
  salePrice: number
  costPrice: number
  createdAt: string
  product: {
    id: number
    name: string
  }
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '1'
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchSales()
    fetchProducts()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      if (res.status === 401 || res.status === 403) router.push('/admin/login')
    } catch {
      // Don't force logout on transient failures.
      return
    }
  }

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/sales')
      if (res.ok) {
        const data = await res.json()
        setSales(data)
      }
    } catch (error) {
      console.error('Failed to fetch sales:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: parseInt(formData.productId),
          quantity: parseInt(formData.quantity)
        })
      })

      if (res.ok) {
        setShowModal(false)
        setFormData({ productId: '', quantity: '1' })
        fetchSales()
      }
    } catch (error) {
      console.error('Failed to create sale:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.salePrice * sale.quantity, 0)
  const totalCost = sales.reduce((sum, sale) => sum + sale.costPrice * sale.quantity, 0)
  const totalMargin = totalRevenue - totalCost

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF0] via-rose-50 to-white">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
              Lynos Sweets Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                View site
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
              <Link href="/admin/categories" className="text-gray-600 hover:text-gray-900">
                Categories
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Sales History</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-2 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all"
          >
            + Record Sale
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Cost</div>
            <div className="text-3xl font-bold text-red-600">${totalCost.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Net Margin</div>
            <div className="text-3xl font-bold text-indigo-600">${totalMargin.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Margin</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => {
                const margin = (sale.salePrice - sale.costPrice) * sale.quantity
                return (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">${(sale.salePrice * sale.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">${(sale.costPrice * sale.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">${margin.toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Record Sale</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price.toFixed(2)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all"
                  >
                    Record Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
