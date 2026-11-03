import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import useTypewriter from '../hooks/useTypewriter'

const SEARCH_PHRASES = [
  'Search treats...',
  'Search dog food...',
  'Search toys...',
  'Search harnesses...',
  'Search grooming...',
  'Search beds...',
]

const SORTS = [
  ['newest', 'Newest'],
  ['popular', 'Most popular'],
  ['price_asc', 'Price: low to high'],
  ['price_desc', 'Price: high to low'],
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const placeholder = useTypewriter(SEARCH_PHRASES)

  const params = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || '1',
    limit: '12',
  }

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data.categories)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString()
    api
      .get(`/products?${qs}`)
      .then((r) => {
        setProducts(r.data.products)
        setPagination(r.data.pagination)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const page = Number(params.page)

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10 md:px-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#5d3a1a]">Shop all products</h1>
          <p className="mt-1 text-sm text-[#8a6a4a]">{pagination.total} products for your best friend</p>
        </div>

        <div className="flex w-full gap-3 sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a08b74]" />
            <input
              value={params.search}
              onChange={(e) => setParam('search', e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-full border border-[#e5d3b3] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#8a5a2b]"
            />
          </div>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-[#e5d3b3] bg-white px-4 py-2 text-sm font-semibold lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* FILTERS */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} space-y-6 lg:block`}>
          <div>
            <h3 className="font-bold text-[#5d3a1a]">Category</h3>
            <div className="mt-3 space-y-1.5">
              <button
                onClick={() => setParam('category', '')}
                className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
                  !params.category ? 'bg-[#7a4a21] font-bold text-white' : 'hover:bg-[#f1e6d2]'
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setParam('category', c.slug)}
                  className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
                    params.category === c.slug ? 'bg-[#7a4a21] font-bold text-white' : 'hover:bg-[#f1e6d2]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#5d3a1a]">Price range</h3>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={params.minPrice}
                onChange={(e) => setParam('minPrice', e.target.value)}
                className="w-full rounded-lg border border-[#e5d3b3] bg-white px-3 py-2 text-sm outline-none"
              />
              <span className="text-[#a08b74]">–</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={params.maxPrice}
                onChange={(e) => setParam('maxPrice', e.target.value)}
                className="w-full rounded-lg border border-[#e5d3b3] bg-white px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#5d3a1a]">Sort by</h3>
            <select
              value={params.sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="mt-3 w-full rounded-lg border border-[#e5d3b3] bg-white px-3 py-2 text-sm outline-none"
            >
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* GRID */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[25px] border border-[#e8dcc8] bg-white p-14 text-center">
              <p className="text-4xl">🐶</p>
              <p className="mt-3 font-bold text-[#5d3a1a]">No products found</p>
              <p className="mt-1 text-sm text-[#8a6a4a]">Try a different search or filter.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setParam('page', String(n))}
                      className={`h-10 w-10 rounded-full text-sm font-bold transition ${
                        n === page
                          ? 'bg-[#7a4a21] text-white'
                          : 'border border-[#e5d3b3] bg-white hover:bg-[#f1e6d2]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
