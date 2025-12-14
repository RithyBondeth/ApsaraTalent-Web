"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useImageCache } from "@/hooks/use-cached-image";
import { LucideTrash2, LucideRefreshCw } from "lucide-react";

export function ImageCacheManager() {
  const { clearCache, getStats } = useImageCache();
  const [stats, setStats] = useState({
    count: 0,
    totalSize: "0 MB",
    maxSize: 100,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    setIsVisible(process.env.NODE_ENV === "development");
    updateStats();
  }, []);

  const updateStats = () => {
    const currentStats = getStats();
    setStats(currentStats);
  };

  const handleClearCache = () => {
    clearCache();
    updateStats();
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          Image Cache Manager
          <Button
            variant="ghost"
            size="sm"
            onClick={updateStats}
            className="h-6 w-6 p-0"
          >
            <LucideRefreshCw className="h-3 w-3" />
          </Button>
        </CardTitle>
        <CardDescription className="text-xs">
          Development tool for monitoring image cache
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <TypographySmall className="text-xs">
              Cached Images:
            </TypographySmall>
            <TypographySmall className="text-xs font-mono">
              {stats.count} / {stats.maxSize}
            </TypographySmall>
          </div>
          <div className="flex justify-between">
            <TypographySmall className="text-xs">Total Size:</TypographySmall>
            <TypographySmall className="text-xs font-mono">
              {stats.totalSize}
            </TypographySmall>
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleClearCache}
          className="w-full h-8 text-xs"
        >
          <LucideTrash2 className="h-3 w-3 mr-2" />
          Clear Cache
        </Button>
      </CardContent>
    </Card>
  );
}

export default ImageCacheManager;
