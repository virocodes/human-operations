"use client";

import { Home, Target, BarChart3, Calendar } from "lucide-react";

type Tab = "dashboard" | "goals" | "metrics" | "operations";

interface MobileTabBarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function MobileTabBar({ currentTab, onTabChange }: MobileTabBarProps) {
  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: Home },
    { id: "goals" as Tab, label: "Goals", icon: Target },
    { id: "metrics" as Tab, label: "Metrics", icon: BarChart3 },
    { id: "operations" as Tab, label: "Todo", icon: Calendar },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg md:hidden">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center gap-1 relative
                transition-colors duration-150
                ${isActive
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "text-muted-foreground hover:text-foreground"}
              `}
            >
              {/* Corner brackets for active tab */}
              {isActive && (
                <>
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white dark:border-gray-900"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white dark:border-gray-900"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white dark:border-gray-900"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white dark:border-gray-900"></div>
                </>
              )}

              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-mono uppercase tracking-wider">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
