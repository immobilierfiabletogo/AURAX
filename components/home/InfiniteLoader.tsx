'use client'

interface InfiniteLoaderProps {
  loading: boolean
  hasMore: boolean
}

export default function InfiniteLoader({
  loading,
  hasMore,
}: InfiniteLoaderProps) {
  if (!hasMore) {
    return (
      <div className="py-8 text-center text-xs font-medium text-slate-400">
        Vous avez vu tous les biens disponibles.
      </div>
    )
  }

  return (
    <div className="flex h-16 items-center justify-center">
      {loading && (
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-500" />
          Chargement...
        </div>
      )}
    </div>
  )
}