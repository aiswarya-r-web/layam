export default function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-[25px] border border-[#e8dcc8] bg-white">
      <div className="h-52 bg-[#f1e6d2]" />
      <div className="flex-1 space-y-3 p-4">
        <div className="h-3 w-1/3 rounded bg-[#f1e6d2]" />
        <div className="h-4 w-3/4 rounded bg-[#f1e6d2]" />
        <div className="h-3 w-1/2 rounded bg-[#f1e6d2]" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 rounded bg-[#f1e6d2]" />
          <div className="h-9 w-9 rounded-full bg-[#f1e6d2]" />
        </div>
      </div>
    </div>
  )
}
