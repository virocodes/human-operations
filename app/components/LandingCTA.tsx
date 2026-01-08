"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export function LandingCTA() {
  return (
    <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', {})}>
      <Button
        size="lg"
        className="group mt-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-6 h-11 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
      >
        Start Building Your System
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </Link>
  );
}
