"use client";
import ApsaraLoadingSpinner from "@/components/utils/apsara-loading-spinner";

export default function NotificationPage() {
  return (
    <ApsaraLoadingSpinner loop={true} size={80} className="text-primary" />
  );
}
