export default function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-line bg-white">
      <div className="aspect-4/3 bg-wine-50" />
      <div className="flex flex-col gap-2.5 p-5">
        <div className="h-2.5 w-16 rounded-full bg-line" />
        <div className="h-4 w-2/3 rounded-full bg-line" />
        <div className="h-3 w-full rounded-full bg-line/70" />
        <div className="mt-2 h-5 w-24 rounded-full bg-line" />
      </div>
    </div>
  )
}
