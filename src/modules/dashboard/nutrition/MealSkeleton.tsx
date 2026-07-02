export default function MealSkeleton() {
  return (
    <div className="space-y-2 w-full animate-pulse">
      <div className="flex justify-between items-center bg-white/5 border border-white/5 px-3 py-2 rounded-xl h-11">
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 bg-white/10 rounded-md w-1/2" />
          <div className="h-2.5 bg-white/5 rounded-md w-1/3" />
        </div>
        <div className="h-4 bg-white/10 rounded-md w-12" />
      </div>

      <div className="flex justify-between items-center bg-white/5 border border-white/5 px-3 py-2 rounded-xl h-11">
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 bg-white/10 rounded-md w-2/5" />
          <div className="h-2.5 bg-white/5 rounded-md w-1/4" />
        </div>
        <div className="h-4 bg-white/10 rounded-md w-10" />
      </div>
    </div>
  );
}
