export default function WorkoutExercisesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/3 p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex items-start gap-4 flex-1 w-full">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex-shrink-0 mt-1" />
            <div className="space-y-2 flex-1">
              <div className="flex gap-2">
                <div className="h-4 bg-white/10 rounded w-20" />
                <div className="h-4 bg-white/10 rounded w-12" />
              </div>
              <div className="h-5 bg-white/10 rounded w-48" />
              <div className="flex gap-4 pt-1">
                <div className="h-3 bg-white/10 rounded w-12" />
                <div className="h-3 bg-white/10 rounded w-16" />
                <div className="h-3 bg-white/10 rounded w-20" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto self-stretch md:self-auto justify-end border-t border-white/5 md:border-t-0 pt-3 md:pt-0">
            <div className="h-8 bg-white/10 rounded-xl w-24" />
            <div className="h-8 bg-white/10 rounded-xl w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
