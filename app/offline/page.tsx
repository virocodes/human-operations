export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-medium text-foreground tracking-tight mb-2">
              You're <span className="italic font-light">Offline</span>
            </h1>
            <p className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
              Connection Required
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8"></div>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <p className="text-sm text-foreground text-center">
              Human Operations requires an internet connection for some features.
            </p>
            <p className="text-xs text-muted-foreground text-center font-light">
              Your cached data is still available once you're back online.
            </p>
          </div>

          {/* Retry Button */}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs tracking-wide uppercase rounded-sm h-11"
          >
            Try Again
          </button>

          {/* Footer */}
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase text-center mt-8">
            Reconnect to Continue
          </p>
        </div>
      </div>
    </div>
  );
}
