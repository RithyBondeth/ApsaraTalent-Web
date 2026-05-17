import FeedPageLoadingSkeleton from "@/components/feed/skeleton/index";

export default function FeedLoading({ isCompany }: { isCompany: boolean }) {
  return <FeedPageLoadingSkeleton isCompany={isCompany} />;
}
