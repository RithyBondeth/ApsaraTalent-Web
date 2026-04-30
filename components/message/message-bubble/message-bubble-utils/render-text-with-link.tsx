import { WEB_URL_REGEX } from "@/utils/constants/chat.constant";
import React from "react";

export default function renderTextWithLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  WEB_URL_REGEX.lastIndex = 0;

  while ((match = WEB_URL_REGEX.exec(text)) !== null) {
    const url = match[0];
    const start = match.index;
    if (start > lastIndex) parts.push(text.slice(lastIndex, start));
    const href = url.startsWith("www.") ? `https://${url}` : url;
    parts.push(
      <a
        key={start}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 break-all hover:opacity-80"
        onClick={(e) => e.stopPropagation()}
      >
        {url}
      </a>,
    );
    lastIndex = start + url.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : [text];
}
