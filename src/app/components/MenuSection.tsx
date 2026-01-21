'use client'

import { useMemo, useState } from 'react'
import { ProductImage } from './ProductImage'

type Product = {
  id: number
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string | null
  isFeatured: boolean
}

type Category = {
  id: number
  name: string
  slug: string
}

function normalizeCategory(value: string | null | undefined) {
  return (value || '').trim()
}

export function MenuSection({
  products,
  categories
}: {
  products: Product[]
  categories: Category[]
}) {
  const [active, setActive] = useState<string>('All')

  const categoryChips = useMemo(() => {
    const fromProducts = new Set<string>()
    for (const p of products) {
      const c = normalizeCategory(p.category)
      if (c) fromProducts.add(c)
    }
    const merged = new Set<string>([
      ...categories.map((c) => c.name),
      ...Array.from(fromProducts)
    ])
    return ['All', ...Array.from(merged).sort((a, b) => a.localeCompare(b))]
  }, [categories, products])

  const filtered = useMemo(() => {
    if (active === 'All') return products
    return products.filter((p) => normalizeCategory(p.category) === active)
  }, [active, products])

  return (
    <section id="menu" className="mt-20 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">Sweets menu</h2>
          <p className="mt-1 max-w-xl text-sm text-stone-600">
            Browse our creations — sweets, dessert boxes, and drinks. New items appear instantly after the admin adds them.
          </p>
        </div>
        <p className="text-xs text-stone-500">Prices in USD. Availability varies by day and season.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categoryChips.map((name) => {
          const selected = name === active
          return (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={[
                'category-chip',
                selected
                  ? 'bg-stone-900 text-amber-200 ring-stone-900/15'
                  : 'bg-white/80 text-stone-700 ring-rose-100 hover:bg-rose-50'
              ].join(' ')}
            >
              {name}
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => (
          <article
            key={item.id}
            className="menu-card group relative overflow-hidden rounded-3xl bg-white/80 p-5 shadow-lg shadow-rose-100/60 ring-1 ring-rose-100 transition hover:-translate-y-1.5 hover:shadow-xl hover:ring-rose-200"
            style={{ animationDelay: `${index * 80}ms` } as React.CSSProperties}
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-100/60 blur-2xl" />
            <div className="relative">
              <ProductImage
                src={item.imageUrl}
                alt={item.name}
                className="mb-4 h-44 w-full"
                fallbackEmoji={normalizeCategory(item.category).toLowerCase().includes('drink') ? '🧋' : '🍬'}
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-stone-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-stone-600 line-clamp-2">{item.description || ''}</p>
                </div>
                <span className="rounded-2xl bg-stone-900 px-3 py-2 text-xs font-semibold text-amber-200 shadow-md">
                  ${item.price?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                <p>{item.category || 'Sweets'}</p>
                <p className="inline-flex items-center gap-1">
                  Freshly made
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
                </p>
              </div>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-center text-stone-500 py-8">
            No items in this category yet.
          </p>
        )}
      </div>
    </section>
  )
}

