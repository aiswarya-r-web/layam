import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
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
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
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

  // Sync box when the URL changes elsewhere (clear, back/forward nav)
  useEffect(() => {
    setSearchInput(params.search)
  }, [params.search])

  // Debounce typing → URL param → API call
  useEffect(() => {
    if (searchInput === params.search) return
    const t = setTimeout(() => setParam('search', searchInput), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const page = Number(params.page)

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10 md:px-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--ink)]">Shop all products</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{pagination.total} products for your best friend</p>
        </div>

        <div className="flex w-full gap-3 sm:w-auto">
          <div className="group relative flex-1 sm:w-80">
            <img src="/Dogne.gif" alt="" className="search-dog" />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--faint)] transition group-focus-within:text-[var(--brand)]"
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-full border border-[var(--line-2)] bg-white py-3 pl-11 pr-10 text-sm shadow-sm outline-none transition placeholder:text-[var(--faint)] hover:border-[var(--sand)] focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_var(--cream-2)]"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setParam('search', '') }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--faint)] transition hover:bg-[var(--cream)] hover:text-[var(--ink)]"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-[var(--line-2)] bg-white px-4 py-2 text-sm font-semibold lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* FILTERS */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} space-y-6 lg:block`}>
          <div>
            <h3 className="font-bold text-[var(--ink)]">Category</h3>
            <div className="mt-3 space-y-1.5">
              <button
                onClick={() => setParam('category', '')}
                className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
                  !params.category ? 'bg-[var(--brand)] font-bold text-white' : 'hover:bg-[var(--cream)]'
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setParam('category', c.slug)}
                  className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
                    params.category === c.slug ? 'bg-[var(--brand)] font-bold text-white' : 'hover:bg-[var(--cream)]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[var(--ink)]">Price range</h3>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={params.minPrice}
                onChange={(e) => setParam('minPrice', e.target.value)}
                className="w-full rounded-lg border border-[var(--line-2)] bg-white px-3 py-2 text-sm outline-none"
              />
              <span className="text-[var(--faint)]">–</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={params.maxPrice}
                onChange={(e) => setParam('maxPrice', e.target.value)}
                className="w-full rounded-lg border border-[var(--line-2)] bg-white px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[var(--ink)]">Sort by</h3>
            <select
              value={params.sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="mt-3 w-full rounded-lg border border-[var(--line-2)] bg-white px-3 py-2 text-sm outline-none"
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
            <div className="rounded-[25px] border border-[var(--line)] bg-white p-14 text-center">
              <p className="text-4xl">🐶</p>
              <p className="mt-3 font-bold text-[var(--ink)]">No products found</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Try a different search or filter.</p>
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
                          ? 'bg-[var(--brand)] text-white'
                          : 'border border-[var(--line-2)] bg-white hover:bg-[var(--cream)]'
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
