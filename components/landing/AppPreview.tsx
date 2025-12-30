"use client";

export function AppPreview() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Section header */}
      <div className="mb-12 space-y-4 text-center">
        <div className="inline-block px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm">
          <span className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
            The Dashboard
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-gray-900 dark:text-white">
          Know where you stand
        </h2>
        <p className="text-lg text-gray-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
          One glance tells you everything. Are you hitting your targets? The colors make it obvious.
        </p>
      </div>

      {/* Mock dashboard preview */}
      <div className="relative bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 shadow-xl rounded-sm overflow-hidden">
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

        <div className="p-6 md:p-8">
          {/* Mock header */}
          <div className="mb-6 pb-4 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono tracking-wider text-gray-900 dark:text-white uppercase">
                Today's Progress
              </h3>
              <div className="text-xs font-mono text-gray-600 dark:text-slate-400">
                MON, DEC 30
              </div>
            </div>
          </div>

          {/* Mock habits */}
          <div className="space-y-4 mb-6">
            <div className="bg-amber-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono tracking-wider text-gray-900 dark:text-white uppercase">
                  Morning Routine
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`flex-1 aspect-square ${
                      day <= 5 ? "bg-green-500 dark:bg-green-600" : "bg-gray-200 dark:bg-slate-700"
                    } border border-gray-300 dark:border-slate-600`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono tracking-wider text-gray-900 dark:text-white uppercase">
                  Exercise
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`flex-1 aspect-square ${
                      day <= 3 || day === 5 ? "bg-green-500 dark:bg-green-600" : "bg-gray-200 dark:bg-slate-700"
                    } border border-gray-300 dark:border-slate-600`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mock metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-4">
              <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-400 uppercase mb-2">
                Sleep Hours
              </div>
              <div className="text-2xl font-serif font-light text-gray-900 dark:text-white">
                7.5
              </div>
              <div className="text-xs text-green-600 dark:text-green-500 font-mono mt-1">
                TARGET: 7-8
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-4">
              <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-400 uppercase mb-2">
                Deep Work
              </div>
              <div className="text-2xl font-serif font-light text-gray-900 dark:text-white">
                3.2
              </div>
              <div className="text-xs text-green-600 dark:text-green-500 font-mono mt-1">
                TARGET: 3-4
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-4">
              <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-400 uppercase mb-2">
                Steps
              </div>
              <div className="text-2xl font-serif font-light text-gray-900 dark:text-white">
                8,432
              </div>
              <div className="text-xs text-red-600 dark:text-red-500 font-mono mt-1">
                TARGET: 10,000
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="text-center text-sm text-gray-600 dark:text-slate-400 mt-6 font-mono tracking-wide">
        Your actual dashboard will be customized to your goals
      </p>
    </section>
  );
}
