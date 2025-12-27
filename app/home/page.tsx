"use client";

import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Home, Target, BarChart3, Calendar, Moon, Sun, User, UserCircle, LogOut, Mail } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/LoadingScreen";

// Page Components - Dashboard loads immediately
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { HabitsHistoryView } from "./components/history/HabitsHistoryView";
import { MetricsHistoryView } from "./components/history/MetricsHistoryView";
import MobileTabBar from "./components/navigation/MobileTabBar";
import { PageSkeleton } from "./components/PageSkeleton";
import { PaymentModal } from "./components/shared/PaymentModal";
import { TourOverlay } from "./components/tour/TourOverlay";

// Lazy load other pages
const GoalsPage = lazy(() => import("./components/goals/GoalsPage").then(mod => ({ default: mod.GoalsPage })));
const MetricsPage = lazy(() => import("./components/metrics/MetricsPage").then(mod => ({ default: mod.MetricsPage })));
const OperationsPage = lazy(() => import("./components/operations/OperationsPage").then(mod => ({ default: mod.OperationsPage })));

// Custom Hooks
import { useHomeData } from "./hooks/useHomeData";
import { useHabits } from "./hooks/useHabits";
import { useMetrics } from "./hooks/useMetrics";
import { useGoals } from "./hooks/useGoals";
import { useTasks } from "./hooks/useTasks";
import { useTodos } from "./hooks/useTodos";
import { useOperations } from "./hooks/useOperations";
import { useTourState } from "./hooks/useTourState";

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

  // State for page navigation (2D grid for desktop, tab for mobile)
  const [currentPageX, setCurrentPageX] = useState(1); // Start on Dashboard (X: 1)
  const [currentPageY, setCurrentPageY] = useState(0); // Start on top row (Y: 0)
  const [currentTab, setCurrentTab] = useState<"dashboard" | "goals" | "metrics" | "operations">("dashboard"); // Mobile tab navigation
  const [showAddHabitColumn, setShowAddHabitColumn] = useState(false);

  // State for history views
  const [showHabitsHistory, setShowHabitsHistory] = useState(false);
  const [showMetricsHistory, setShowMetricsHistory] = useState(false);

  // State for contact modal
  const [showContactModal, setShowContactModal] = useState(false);

  // State for payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Tour state
  const { tourActive, setTourActive, currentStep, nextStep, steps, completeTour } = useTourState();

  // 2D page grid structure: pageGrid[y][x]
  // Row 0: Goals, Dashboard, Metrics
  // Row 1: null, Todo, null
  const pageGrid = [
    [
      { id: 'goals', label: 'Goals', icon: Target },
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    ],
    [
      null,
      { id: 'operations', label: 'Todo', icon: Calendar },
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
  // Check tour and payment status on mount and when window gains focus
  useEffect(() => {
    const checkPaymentAndTour = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('tour_completed, has_paid')
        .eq('id', user.id)
        .single();

      if (userData) {
        const hasPaid = userData.has_paid === true;
        const hasCompletedTour = userData.tour_completed === true;

        if (hasPaid) {
          // Paid users skip tour and payment modal
          setShowPaymentModal(false);
          setTourActive(false);
        } else if (!hasCompletedTour) {
          // Show tour for unpaid users who haven't completed it
          setTourActive(true);
          setShowPaymentModal(false);
        } else if (hasCompletedTour && !hasPaid) {
          // Completed tour but not paid → show payment modal
          setShowPaymentModal(true);
          setTourActive(false);
        }
      }
    };

    // Check on mount
    checkPaymentAndTour();

    // Re-check when window gains focus (e.g., returning from Stripe checkout)
    window.addEventListener('focus', checkPaymentAndTour);
    return () => window.removeEventListener('focus', checkPaymentAndTour);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block navigation during tour (except Step 3 which allows it)
      if (tourActive && !steps[currentStep]?.allowedInteractions?.includes('keyboard-nav')) {
        return;
      }

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
  }, [navigatePage, tourActive, currentStep, steps]);

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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-medium text-foreground tracking-tight">
                Human <span className="italic font-light">Operations</span>
              </h1>
              <p className="text-xs font-mono tracking-wider text-muted-foreground mt-1 uppercase hidden md:block">Daily Operations Log</p>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-10 w-10 rounded-full hover:bg-accent transition-colors cursor-pointer"
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
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
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
                  <DropdownMenuItem onClick={() => setShowContactModal(true)} className="font-mono text-xs cursor-pointer">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </DropdownMenuItem>
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

      {/* Main Content */}
      <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 89px)' }}>
        {/* Desktop: 2D Grid Navigation */}
        <div
          className="hidden md:block transition-transform duration-500 ease-out"
          style={{
            transform: gridTransform,
            height: gridHeight,
            width: '300vw'
          }}
        >
          {/* Row 0, Col 0: Goals & Operations */}
          <div className="absolute h-full overflow-y-auto custom-scrollbar" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '0', top: '0' }}>
            <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
              {!homeData.dataLoaded.goals || !homeData.dataLoaded.operations ? (
                <PageSkeleton />
              ) : (
                <Suspense fallback={<PageSkeleton />}>
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
                </Suspense>
              )}
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
                onShowHabitsHistory={() => setShowHabitsHistory(true)}
              />
            </div>
          </div>

          {/* Row 0, Col 2: Metrics */}
          <div className="absolute h-full overflow-y-auto custom-scrollbar" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '200vw', top: '0' }}>
            <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
              {!homeData.dataLoaded.categories || !homeData.dataLoaded.trackedMetrics ? (
                <PageSkeleton />
              ) : (
                <Suspense fallback={<PageSkeleton />}>
                  <MetricsPage
                    days={homeData.days}
                    metricsHook={metricsHook}
                    entries={homeData.entries}
                    setEntries={homeData.setEntries}
                    categories={homeData.categories}
                    loadEntries={homeData.loadEntries}
                    onShowMetricsHistory={() => setShowMetricsHistory(true)}
                  />
                </Suspense>
              )}
            </div>
          </div>

          {/* Row 1, Col 1: Todos & Schedule Page */}
          <div className="absolute h-full overflow-y-auto custom-scrollbar" style={{ width: '100vw', height: 'calc(100vh - 89px)', left: '100vw', top: 'calc(100vh - 89px)' }}>
            <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
              {!homeData.dataLoaded.todos || !homeData.dataLoaded.tasks ? (
                <PageSkeleton />
              ) : (
                <Suspense fallback={<PageSkeleton />}>
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
                </Suspense>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Tab-based Navigation */}
        <div className="block md:hidden h-full overflow-y-auto custom-scrollbar pb-20">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {currentTab === "dashboard" && (
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
                onShowHabitsHistory={() => setShowHabitsHistory(true)}
              />
            )}
            {currentTab === "goals" && (
              <>
                {!homeData.dataLoaded.goals || !homeData.dataLoaded.operations ? (
                  <PageSkeleton />
                ) : (
                  <Suspense fallback={<PageSkeleton />}>
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
                  </Suspense>
                )}
              </>
            )}
            {currentTab === "metrics" && (
              <>
                {!homeData.dataLoaded.categories || !homeData.dataLoaded.trackedMetrics ? (
                  <PageSkeleton />
                ) : (
                  <Suspense fallback={<PageSkeleton />}>
                    <MetricsPage
                      days={homeData.days}
                      metricsHook={metricsHook}
                      entries={homeData.entries}
                      setEntries={homeData.setEntries}
                      categories={homeData.categories}
                      loadEntries={homeData.loadEntries}
                      onShowMetricsHistory={() => setShowMetricsHistory(true)}
                    />
                  </Suspense>
                )}
              </>
            )}
            {currentTab === "operations" && (
              <>
                {!homeData.dataLoaded.todos || !homeData.dataLoaded.tasks ? (
                  <PageSkeleton />
                ) : (
                  <Suspense fallback={<PageSkeleton />}>
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
                  </Suspense>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Desktop: Bottom Chip Navigation - T-shaped Grid */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-20 flex-col items-center">
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
                  p-2.5 transition-all duration-200 cursor-pointer
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
                  p-2.5 transition-all duration-200 cursor-pointer
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

      {/* History View Overlays */}
      {showHabitsHistory && (
        <HabitsHistoryView
          habits={homeData.habits}
          entries={homeData.entries}
          onClose={() => setShowHabitsHistory(false)}
        />
      )}
      {showMetricsHistory && (
        <MetricsHistoryView
          metrics={homeData.trackedMetrics}
          entries={homeData.entries}
          onClose={() => setShowMetricsHistory(false)}
        />
      )}

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="md:max-w-[425px] rounded-none md:rounded-sm bg-card md:border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Contact</DialogTitle>
            <DialogDescription className="text-sm font-light">
              Get in touch for requests, bug reports, or feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-accent/50 border border-border rounded-sm">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-mono text-muted-foreground uppercase mb-1">Email</p>
                <a
                  href="mailto:dbellan1291@gmail.com"
                  className="text-sm font-mono text-foreground hover:text-primary transition-colors"
                >
                  dbellan1291@gmail.com
                </a>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-light">
              Feel free to reach out for any requests, bug fixes, feature suggestions, or general feedback.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal - unclosable */}
      <PaymentModal isOpen={showPaymentModal} />

      {/* Tour Overlay - mandatory */}
      <TourOverlay
        isOpen={tourActive}
        currentStep={currentStep}
        steps={steps}
        onNext={nextStep}
        onComplete={() => {
          completeTour();
          setShowPaymentModal(true);
        }}
      />

    </div>
  );
}
