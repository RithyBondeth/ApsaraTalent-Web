import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LucideInfo, LucideShieldCheck } from "lucide-react";
import { SettingWrapper } from "../setting-wrapper/setting-wrapper";
import { SettingRow } from "../setting-row";

export function AboutSection() {
  return (
    <SettingWrapper
      icon={<LucideInfo />}
      title="About"
      description="App information"
    >
      <SettingRow
        icon={<LucideInfo />}
        label="Version"
        value={
          <Badge variant="secondary" className="text-[10px] font-mono">
            v1.0.0
          </Badge>
        }
      />
      <SettingRow
        icon={<LucideShieldCheck />}
        label="Privacy Policy"
        value={
          <Link
            href="/privacy"
            className="text-xs text-primary hover:underline"
          >
            View →
          </Link>
        }
      />
      <SettingRow
        icon={<LucideInfo />}
        label="Terms of Service"
        value={
          <Link href="/terms" className="text-xs text-primary hover:underline">
            View →
          </Link>
        }
        last
      />
    </SettingWrapper>
  );
}
