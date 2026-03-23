import NotificationCardSkeleton from "./skeleton";

export default function NotificationLoading() {
  return (
    <div className="w-full flex flex-col gap-3 p-5">
      {[...Array(5)].map((_, i) => (
        <NotificationCardSkeleton key={i} />
      ))}
    </div>
  );
}
