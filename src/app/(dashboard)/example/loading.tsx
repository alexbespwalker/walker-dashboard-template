export default function ExampleLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="h-8 w-48 shimmer-skeleton rounded-lg mb-1" />
      <div className="h-4 w-72 shimmer-skeleton rounded mb-6" />

      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex gap-4">
          <div className="h-9 w-[130px] shimmer-skeleton rounded-md" />
          <div className="h-9 w-[155px] shimmer-skeleton rounded-md" />
          <div className="h-9 w-[155px] shimmer-skeleton rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-6">
            <div className="h-3 w-20 shimmer-skeleton rounded mb-3" />
            <div className="h-8 w-16 shimmer-skeleton rounded" />
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5 mb-8">
        <div className="h-4 w-40 shimmer-skeleton rounded mb-4" />
        <div className="h-[350px] shimmer-skeleton rounded-lg" />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="h-10 shimmer-skeleton" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 shimmer-skeleton border-t border-white/[0.03]" />
        ))}
      </div>
    </div>
  )
}
