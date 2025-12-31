import { Skeleton } from "@/components/ui/skeleton";

export function PasswordListSkeleton() {
  return (
    <div className="p-2 space-y-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-transparent">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
