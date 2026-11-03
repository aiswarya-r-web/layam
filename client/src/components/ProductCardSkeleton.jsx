export default function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-[25px] border border-[var(--line)] bg-white">
      <div className="aspect-square bg-[var(--cream)]" />
      <div className="flex-1 space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-[var(--cream)]" />
        <div className="h-4 w-3/4 rounded bg-[var(--cream)]" />
        <div className="h-3 w-1/2 rounded bg-[var(--cream)]" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded bg-[var(--cream)]" />
          <div className="h-9 w-9 rounded-full bg-[var(--cream)]" />
        </div>
      </div>
    </div>
  )
}
