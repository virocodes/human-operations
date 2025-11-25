export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Animated grid pattern */}
        <div className="relative w-32 h-32">
          {/* Outer frame */}
          <div className="absolute inset-0 border-2 border-border bg-card"></div>

          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="border border-border"
                style={{
                  animation: `pulse ${1 + (i % 4) * 0.2}s ease-in-out infinite`,
                  animationDelay: `${(i % 4) * 0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-foreground animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-foreground -translate-x-1/2 -translate-y-full"></div>
              <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-foreground -translate-x-1/2 translate-y-full"></div>
              <div className="absolute left-0 top-1/2 h-0.5 w-2 bg-foreground -translate-y-1/2 -translate-x-full"></div>
              <div className="absolute right-0 top-1/2 h-0.5 w-2 bg-foreground -translate-y-1/2 translate-x-full"></div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-mono tracking-wider text-foreground uppercase">Initializing</div>
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
          <div className="text-xs font-mono tracking-wider text-muted-foreground uppercase">Human Operations</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
