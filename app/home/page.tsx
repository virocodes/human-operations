"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Home, Target, BarChart3, Calendar, Moon, Sun, User, UserCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/LoadingScreen";

// Page Components
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { GoalsPage } from "./components/goals/GoalsPage";
import { MetricsPage } from "./components/metrics/MetricsPage";
import { OperationsPage } from "./components/operations/OperationsPage";

// Custom Hooks
import { useHomeData } from "./hooks/useHomeData";
import { useHabits } from "./hooks/useHabits";
import { useMetrics } from "./hooks/useMetrics";
import { useGoals } from "./hooks/useGoals";
import { useTasks } from "./hooks/useTasks";
import { useTodos } from "./hooks/useTodos";
import { useOperations } from "./hooks/useOperations";

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  // Main data hook
  const homeData = useHomeData();

  // Initialize custom hooks with data from homeData
  const habitsHook = useHabits({
    habits: homeData.habits,
    setHabits: homeData.setHabits,
    entries: homeData.entries,
    setEntries: homeData.setEntries,
  });

  const metricsHook = useMetrics({
    trackedMetrics: homeData.trackedMetrics,
    setTrackedMetrics: homeData.setTrackedMetrics,
    categories: homeData.categories,
    setCategories: homeData.setCategories,
    entries: homeData.entries,
    setEntries: homeData.setEntries,
  });

  const goalsHook = useGoals({
    goals: homeData.goals,
    setGoals: homeData.setGoals,
  });

  const tasksHook = useTasks({
    tasks: homeData.tasks,
    setTasks: homeData.setTasks,
    wakeHour: homeData.wakeHour,
    sleepHour: homeData.sleepHour,
  });

  const todosHook = useTodos({
    todos: homeData.todos,
    setTodos: homeData.setTodos,
    loadTodos: homeData.loadTodos,
  });

  const operationsHook = useOperations({
    operations: homeData.operations,
    setOperations: homeData.setOperations,
  });

  // State for page navigation (2D grid)
  const [currentPageX, setCurrentPageX] = useState(1); // Start on Dashboard (X: 1)
  const [currentPageY, setCurrentPageY] = useState(0); // Start on top row (Y: 0)
  const [showAddHabitColumn, setShowAddHabitColumn] = useState(false);

  // 2D page grid structure: pageGrid[y][x]
  // Row 0: Goals, Dashboard, Metrics
  // Row 1: null, Operations, null
  const pageGrid = [
    [
      { id: 'goals', label: 'Goals', icon: Target },
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    ],
    [
      null,
      { id: 'operations', label: 'Operations', icon: Calendar },
      null,
    ]
  ];

  const navigatePage = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    let newX = currentPageX;
    let newY = currentPageY;

    if (direction === 'left') newX = currentPageX - 1;
    else if (direction === 'right') newX = currentPageX + 1;
    else if (direction === 'up') newY = currentPageY - 1;
    else if (direction === 'down') newY = currentPageY + 1;

    // Check bounds and if page exists
    if (newY >= 0 && newY < pageGrid.length && newX >= 0 && newX < pageGrid[newY].length) {
      if (pageGrid[newY][newX] !== null) {
        setCurrentPageX(newX);
        setCurrentPageY(newY);
      }
    }
  }, [currentPageX, currentPageY]);

  // Keyboard navigation (2D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore arrow keys if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') navigatePage('left');
      else if (e.key === 'ArrowRight') navigatePage('right');
      else if (e.key === 'ArrowUp') navigatePage('up');
      else if (e.key === 'ArrowDown') navigatePage('down');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigatePage]);

  const goToPage = (x: number, y: number) => {
    if (y >= 0 && y < pageGrid.length && x >= 0 && x < pageGrid[y].length && pageGrid[y][x] !== null) {
      setCurrentPageX(x);
      setCurrentPageY(y);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (homeData.loading) {
    return <LoadingScreen />;
  }

  const gridTransform = `translate(-${currentPageX * 100}vw, -${currentPageY * 100}vh)`;
  const gridHeight = `${pageGrid.length * 100}vh`;

  return (
    <div className="h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-medium text-foreground tracking-tight">
                Human <span className="italic font-light">Operations</span>
              </h1>
              <p className="text-xs font-mono tracking-wider text-muted-foreground mt-1 uppercase">Daily Operations Log</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-10 w-10 rounded-full hover:bg-accent transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-foreground" />
                ) : (
                  <Moon className="h-5 w-5 text-foreground" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={homeData.profile?.avatar_url || homeData.user?.user_metadata?.avatar_url} alt={homeData.profile?.username || 'User'} />
                      <AvatarFallback className="bg-gray-200 dark:bg-[#2d2d2d]">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-sm border-border bg-card">
                  <Link href="/profile">
                    <DropdownMenuItem className="font-mono text-xs cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleSignOut} className="font-mono text-xs cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2D Paging */}
      <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 89px)' }}>
        {/* Pages Container - 2D Grid */}
        <div
          className="transition-transform duration-500 ease-out"
          style={{
            transform: gridTransform,
            height: gridHeight,
            width: '300vw'
          }}
        >
          {/* Row 0, Col 0: Todos & Schedule */}
          <div className="absolute h-full overflow-y-auto custom-scrollbar" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '0', top: '0' }}>
            <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
              <GoalsPage
                goals={homeData.goals}
                trackedMetrics={homeData.trackedMetrics}
                entries={homeData.entries}
                operations={homeData.operations}
                todosHook={todosHook}
                goalsHook={goalsHook}
                tasks={homeData.tasks}
                currentTime={homeData.currentTime}
                wakeHour={homeData.wakeHour}
                sleepHour={homeData.sleepHour}
                tasksHook={tasksHook}
                updateWakeHour={homeData.updateWakeHour}
                updateSleepHour={homeData.updateSleepHour}
              />
            </div>
          </div>

          {/* Row 0, Col 1: Dashboard (Welcome + Habits) */}
          <div className="absolute h-full overflow-y-auto custom-scrollbar" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '100vw', top: '0' }}>
            <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
              <DashboardPage
                user={homeData.user}
                profile={homeData.profile}
                habits={homeData.habits}
                entries={homeData.entries}
                currentTime={homeData.currentTime}
                todayStats={homeData.todayStats}
                days={homeData.days}
                showAddHabitColumn={showAddHabitColumn}
                setShowAddHabitColumn={setShowAddHabitColumn}
                habitsHook={habitsHook}
                updateEntry={homeData.updateEntry}
              />
            </div>
          </div>

          {/* Row 0, Col 2: Metrics */}
          <div className="absolute h-full overflow-y-auto custom-scrollbar" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '200vw', top: '0' }}>
            <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
              <MetricsPage
                days={homeData.days}
                metricsHook={metricsHook}
                entries={homeData.entries}
                setEntries={homeData.setEntries}
                categories={homeData.categories}
                loadEntries={homeData.loadEntries}
              />
            </div>
          </div>

          {/* Row 1, Col 1: Goals & Operations Page */}
          <div className="absolute h-full overflow-y-auto custom-scrollbar" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '100vw', top: 'calc(100vh - 89px)' }}>
            <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
              <OperationsPage
                goals={homeData.goals}
                trackedMetrics={homeData.trackedMetrics}
                entries={homeData.entries}
                operations={homeData.operations}
                setOperations={homeData.setOperations}
                goalsHook={goalsHook}
                operationsHook={operationsHook}
                habits={homeData.habits}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Chip Navigation - T-shaped Grid */}
      <div className="fixed bottom-6 right-6 z-20 flex flex-col items-center">
        {/* Top row - all 3 pages */}
        <div className="flex items-center gap-2 bg-card border-2 border-border shadow-lg p-1">
          {pageGrid[0].map((page, colIndex) => {
            if (!page) return null;
            const Icon = page.icon;
            const isActive = currentPageX === colIndex && currentPageY === 0;
            return (
              <button
                key={page.id}
                onClick={() => goToPage(colIndex, 0)}
                className={`
                  p-2.5 transition-all duration-200
                  ${isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground'}
                `}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
        {/* Bottom row - only center button */}
        {pageGrid[1][1] && (() => {
          const page = pageGrid[1][1];
          const Icon = page.icon;
          const isActive = currentPageX === 1 && currentPageY === 1;
          return (
            <div className="bg-card border-2 border-t-0 border-border shadow-lg p-1 -mt-0.5">
              <button
                key={page.id}
                onClick={() => goToPage(1, 1)}
                className={`
                  p-2.5 transition-all duration-200
                  ${isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground'}
                `}
              >
                <Icon className="h-4 w-4" />
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
