/**
 * Mirrors the API's `RecentViewerDTO`. A hidden viewer, a signed-out
 * viewer and a deleted viewer all surface as a row whose identity fields
 * are null — the recipient renders "Someone" plus the timestamp.
 */
export interface IRecentViewer {
  viewerId: string | null;
  viewerName: string | null;
  viewerAvatar: string | null;
  viewerRole: "employee" | "company" | null;
  viewedAt: string;
}

export interface IProfileAnalytics {
  profileViews7d: number;
  profileViews30d: number;
  searchAppearances30d: number;
  recentViewers: IRecentViewer[];
  browsePrivately: boolean;
}

export interface IUpdatePrivacyPayload {
  browsePrivately: boolean;
}
