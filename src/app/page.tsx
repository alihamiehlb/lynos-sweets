import React from "react";
import Image from "next/image";

// Always render fresh data (no prerendered cache) so deletions/edits show immediately.
export const revalidate = 0;
export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}

const specialties = [
  "Small-batch sweets crafted fresh all day",
  "Custom dessert boxes for events and gifting",
  "Seasonal treats and celebratory desserts",
  "Perfect pairings for cozy evenings in",
];

export default async function Home() {
  const products = await getProducts()
  const featuredProducts = products.filter((p: any) => p.isFeatured).slice(0, 3)
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-amber-50 to-white text-stone-900">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 md:px-8 lg:px-12">
        {/* Hero */}
        <section className="flex flex-1 flex-col items-center gap-10 md:flex-row md:items-start">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-sm font-medium text-rose-700 shadow-sm ring-1 ring-rose-100 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
              Fresh out of the oven at Lynos Sweets
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Handcrafted sweets and indulgent treats that{" "}
              <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                melt your heart.
              </span>
            </h1>
            <p className="max-w-xl text-balance text-base text-stone-600 sm:text-lg">
              At <span className="font-semibold text-rose-700">Lynos Sweets</span>, every creation is mixed, poured, and
              finished by hand. Explore our signature treats and curated dessert boxes in a cozy, modern experience.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#menu"
                className="group inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:-translate-y-0.5 hover:bg-rose-600"
              >
                View sweets menu
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#about"
                className="inline-flex items-center text-sm font-medium text-rose-700 underline-offset-4 transition hover:text-rose-800 hover:underline"
              >
                Learn about Lynos Sweets
              </a>
              <a
                href="/admin/login"
                className="inline-flex items-center text-sm font-semibold text-rose-700 rounded-full border border-rose-200 px-4 py-2 bg-white/80 shadow-sm transition hover:bg-rose-50 hover:-translate-y-0.5"
              >
                Login
              </a>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-stone-500 sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-amber-100 p-1.5">
                  <span className="block h-full w-full animate-bounce rounded-full bg-amber-400" />
                </span>
                Baked fresh in small batches
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-rose-100 p-1.5">
                  <span className="block h-full w-full animate-[spin_4s_linear_infinite] rounded-full border-2 border-rose-400 border-t-transparent" />
                </span>
                Curated flavours all year round
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-1 justify-center md:mt-0">
            <div className="relative h-80 w-full max-w-sm">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-200 via-amber-100 to-white shadow-2xl shadow-rose-200/60" />
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-700">
                      Lynos Sweets
                    </p>
                    <p className="text-sm text-stone-600">Cookie Flight · Today&apos;s Selection</p>
                  </div>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm">
                    Limited batch
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {displayProducts.map((cookie: any, idx: number) => (
                    <div
                      key={cookie.id || idx}
                      className="group relative overflow-hidden rounded-2xl bg-white/80 p-2 text-xs shadow-sm ring-1 ring-rose-100 transition hover:-translate-y-1 hover:shadow-md hover:ring-rose-200"
                    >
                      <div className="relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 via-amber-100 to-white">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,114,182,0.25),transparent_60%),radial-gradient(circle_at_80%_0%,rgba(251,191,36,0.3),transparent_55%)]" />
                        {cookie.imageUrl ? (
                          <img src={cookie.imageUrl} alt={cookie.name} className="relative scale-110 opacity-80 transition-transform duration-500 group-hover:scale-125 w-full h-full object-cover" />
                        ) : (
                          <div className="text-2xl">🍪</div>
                        )}
                      </div>
                      <p className="line-clamp-2 font-semibold text-[11px] text-stone-800">{cookie.name}</p>
                      <p className="mt-1 line-clamp-2 text-[10px] text-stone-500">{cookie.description || ''}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-rose-700">${cookie.price?.toFixed(2) || '0.00'}</span>
                        {cookie.isFeatured && (
                          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-medium text-rose-600">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-stone-600">
                  <p>Pre-order dessert boxes for events.</p>
                  <span className="rounded-full bg-stone-900 px-3 py-1 text-[10px] font-semibold text-amber-200">
                    Pick-up · Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="mt-20 space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">Signature sweets highlights</h2>
              <p className="mt-1 max-w-xl text-sm text-stone-600">
                Swipe through some favourites from our sweets collection. Visit Lynos Sweets in person or get them curated in a
                dessert box.
              </p>
            </div>
            <p className="text-xs text-stone-500">
              Prices in USD. Availability varies by day and season.
            </p>
          </div>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {products.slice(0, 6).map((cookie: any, index: number) => (
              <article
                key={cookie.id || index}
                className="group relative overflow-hidden rounded-3xl bg-white/80 p-5 shadow-lg shadow-rose-100/60 ring-1 ring-rose-100 transition hover:-translate-y-1.5 hover:shadow-xl hover:ring-rose-200"
                style={{ animation: `floatUp 0.7s ease-out ${index * 0.08}s both` } as React.CSSProperties}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-100/60 blur-2xl" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">{cookie.name}</h3>
                    <p className="mt-1 text-sm text-stone-600">{cookie.description || ''}</p>
                  </div>
                  <span className="rounded-2xl bg-stone-900 px-3 py-2 text-xs font-semibold text-amber-200 shadow-md">
                    ${cookie.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="relative mt-4 flex items-center justify-between text-xs text-stone-500">
                  <p>{cookie.category || 'Sweets'}</p>
                  <p className="inline-flex items-center gap-1">
                    Freshly baked
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
                  </p>
                </div>
              </article>
            ))}
            {products.length === 0 && (
              <p className="col-span-3 text-center text-stone-500 py-8">No products available yet. Check back soon!</p>
            )}
          </div>
        </section>

        {/* About */}
        <section id="about" className="mt-20 grid gap-10 md:grid-cols-[1.2fr_minmax(0,1fr)] md:items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-stone-900 sm:text-3xl">A boutique sweets studio in every detail</h2>
            <p className="text-sm text-stone-600 sm:text-base">
              Lynos Sweets is a small, passionate sweets studio focused on{" "}
              <span className="font-medium text-rose-700">textures, balance, and warmth</span>. From the first crackle
              of a cookie edge to the soft center, we obsess over every bite.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {specialties.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/70 p-3 text-sm text-stone-700 shadow-sm ring-1 ring-amber-100"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-3xl bg-stone-900 px-5 py-6 text-amber-100 shadow-xl shadow-stone-900/50">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
              Behind the sweets
            </p>
            <p className="text-sm text-amber-50/90">
              Every treat from Lynos Sweets starts with real ingredients, small batches, and a lot of care.
            </p>
            <div className="space-y-3 rounded-2xl bg-stone-800/80 p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-200">Thoughtful recipes</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                  Crafted in small runs
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-300">Seasonal menus</span>
                <span className="font-semibold text-amber-200">Curated for moments</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-300">Carefully packed</span>
                <span className="font-semibold text-amber-200">Ready to share</span>
              </div>
              <p className="mt-2 text-[11px] text-stone-400">
                From tasting to packaging, every detail is designed so you can simply enjoy your sweets.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-rose-100 pt-6 text-xs text-stone-500 sm:flex sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lynos Sweets. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Crafted with love, sugar, and a hint of butter.
          </p>
        </footer>
      </main>
    </div>
  );
}
