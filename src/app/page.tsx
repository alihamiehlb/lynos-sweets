import React from "react";
import { cookies } from "next/headers";
import { MenuSection } from "./components/MenuSection";

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

async function getCategories() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
    })
    return categories
  } catch (error) {
    // Table may not exist yet until migration runs; keep homepage working.
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
  const cookieStore = await cookies();
  const hasAuth = !!cookieStore.get("auth-token");
  const products = await getProducts()
  const categories = await getCategories()
  const featuredProducts = products.filter((p: any) => p.isFeatured).slice(0, 3)
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFBF0] via-[#FEF9E7] to-white text-stone-900 relative overflow-hidden">
      {/* Animated pink background shapes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="animated-bg-shape"></div>
        <div className="animated-bg-shape"></div>
        <div className="animated-bg-shape"></div>
        <div className="animated-bg-shape"></div>
      </div>
      
      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 md:px-8 lg:px-12">
        {/* Hero */}
        <section className="flex flex-1 flex-col items-center gap-10 md:flex-row md:items-start">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1 text-sm font-medium text-rose-600 shadow-sm ring-1 ring-rose-200 backdrop-blur hover-scale slide-in-up">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400 sparkle" />
              Fresh out of the oven at Lynos Sweets
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Handcrafted sweets and indulgent treats that{" "}
              <span className="bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text text-transparent">
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
                className="group relative inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-400/40 transition-all hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-500/50 overflow-hidden"
              >
                <span className="absolute inset-0 shimmer"></span>
                <span className="relative z-10">View sweets menu</span>
                <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#about"
                className="inline-flex items-center text-sm font-medium text-rose-700 underline-offset-4 transition hover:text-rose-800 hover:underline"
              >
                Learn about Lynos Sweets
              </a>
              {!hasAuth ? (
                <a
                  href="/admin/login"
                  className="inline-flex items-center text-sm font-semibold text-rose-700 rounded-full border border-rose-200 px-4 py-2 bg-white/90 shadow-sm transition-all hover:bg-rose-50 hover:-translate-y-0.5 hover:shadow-md hover:border-rose-300 hover-scale"
                >
                  Login
                </a>
              ) : (
                <a
                  href="/admin"
                  className="inline-flex items-center text-sm font-semibold text-rose-700 rounded-full border border-rose-200 px-4 py-2 bg-white/90 shadow-sm transition-all hover:bg-rose-50 hover:-translate-y-0.5 hover:shadow-md hover:border-rose-300 hover-scale"
                >
                  Admin dashboard
                </a>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-stone-500 sm:text-sm">
              <div className="flex items-center gap-2 hover-scale transition-transform">
                <span className="h-6 w-6 rounded-full bg-[#FEF9E7] p-1.5 pulse-glow">
                  <span className="block h-full w-full animate-bounce rounded-full bg-rose-300" />
                </span>
                Crafted fresh in small batches
              </div>
              <div className="flex items-center gap-2 hover-scale transition-transform">
                <span className="h-6 w-6 rounded-full bg-rose-100 p-1.5 pulse-glow">
                  <span className="block h-full w-full animate-[spin_4s_linear_infinite] rounded-full border-2 border-rose-400 border-t-transparent" />
                </span>
                Curated flavours all year round
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-1 justify-center md:mt-0">
            <div className="relative h-80 w-full max-w-sm hover-scale">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-200 via-[#FEF9E7] to-white shadow-2xl shadow-rose-200/60 animated-gradient pulse-glow" />
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-700">
                      Lynos Sweets
                    </p>
                    <p className="text-sm text-stone-600">Today&apos;s Selection</p>
                  </div>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm">
                    Limited batch
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {displayProducts.map((cookie: any, idx: number) => (
                    <div
                      key={cookie.id || idx}
                      className="group relative overflow-hidden rounded-2xl bg-white/90 p-2 text-xs shadow-sm ring-1 ring-rose-100 transition-all hover:-translate-y-1 hover:shadow-md hover:ring-rose-200 hover-scale"
                    >
                      <div className="relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 via-[#FEF9E7] to-white">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,114,182,0.25),transparent_60%),radial-gradient(circle_at_80%_0%,rgba(251,191,36,0.3),transparent_55%)]" />
                        {cookie.imageUrl ? (
                          <img src={cookie.imageUrl} alt={cookie.name} className="relative scale-110 opacity-80 transition-transform duration-500 group-hover:scale-125 w-full h-full object-cover" />
                        ) : (
                          <div className="text-2xl">🍬</div>
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
                  <span className="rounded-full bg-stone-900 px-3 py-1 text-[10px] font-semibold text-[#FEF9E7]">
                    Pick-up · Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MenuSection products={products as any} categories={categories as any} />

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
                  className="flex items-start gap-3 rounded-2xl bg-white/95 p-3 text-sm text-stone-700 shadow-sm ring-1 ring-rose-100 transition-all hover:shadow-md hover:ring-rose-200 hover-scale"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 sparkle" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-3xl bg-gradient-to-br from-rose-600 to-rose-700 px-5 py-6 text-white shadow-xl shadow-rose-600/50 hover-scale transition-transform">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-100">
              Behind the sweets
            </p>
            <p className="text-sm text-white/90">
              Every treat from Lynos Sweets starts with real ingredients, small batches, and a lot of care.
            </p>
            <div className="space-y-3 rounded-2xl bg-white/10 backdrop-blur-sm p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/90">Thoughtful recipes</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white">
                  Crafted in small runs
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Seasonal menus</span>
                <span className="font-semibold text-[#FEF9E7]">Curated for moments</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Carefully packed</span>
                <span className="font-semibold text-[#FEF9E7]">Ready to share</span>
              </div>
              <p className="mt-2 text-[11px] text-white/70">
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
