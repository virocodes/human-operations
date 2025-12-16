"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function TerminalPage() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(-1); // -1 means new line
  const [draftLine, setDraftLine] = useState(""); // Preserve unsaved new line
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router, supabase.auth]);

  useEffect(() => {
    // Auto-focus input on mount and when line index changes
    inputRef.current?.focus();
  }, [currentLineIndex]);

  useEffect(() => {
    // Auto-scroll to bottom when new lines are added
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (currentLineIndex === -1) {
        // Adding a new line
        setLines([...lines, currentInput]);
        setDraftLine(""); // Clear draft after committing
      } else {
        // Editing an existing line
        const newLines = [...lines];
        newLines[currentLineIndex] = currentInput;
        setLines(newLines);
      }
      setCurrentInput("");
      setCurrentLineIndex(-1); // Reset to new line mode
    } else if (e.key === "Backspace" && currentInput === "") {
      e.preventDefault();

      if (currentLineIndex === -1 && lines.length > 0) {
        // On new line, go to last existing line
        setCurrentLineIndex(lines.length - 1);
        setCurrentInput(lines[lines.length - 1]);
      } else if (currentLineIndex !== -1 && lines.length > 0) {
        // Delete current empty line and go to previous line
        const newLines = [...lines];
        newLines.splice(currentLineIndex, 1);
        setLines(newLines);

        if (currentLineIndex > 0) {
          // Go to previous line
          const targetIndex = currentLineIndex - 1;
          setCurrentLineIndex(targetIndex);
          setCurrentInput(newLines[targetIndex]);
        } else if (newLines.length === 0) {
          // No lines left, go to new line mode
          setCurrentLineIndex(-1);
          setCurrentInput("");
        } else {
          // Was on first line, stay on first line (which is now a different line)
          setCurrentLineIndex(0);
          setCurrentInput(newLines[0]);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentLineIndex === -1 && lines.length > 0) {
        // Save current draft before moving to last line
        setDraftLine(currentInput);
        setCurrentLineIndex(lines.length - 1);
        setCurrentInput(lines[lines.length - 1]);
      } else if (currentLineIndex > 0) {
        // Move up (line already updated in real-time via onChange)
        const targetIndex = currentLineIndex - 1;
        setCurrentLineIndex(targetIndex);
        setCurrentInput(lines[targetIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (currentLineIndex !== -1 && currentLineIndex < lines.length - 1) {
        // Move down (line already updated in real-time via onChange)
        const targetIndex = currentLineIndex + 1;
        setCurrentLineIndex(targetIndex);
        setCurrentInput(lines[targetIndex]);
      } else if (currentLineIndex === lines.length - 1) {
        // Move to new line mode
        setCurrentLineIndex(-1);
        setCurrentInput(draftLine);
      }
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  if (isLoading) {
    return null;
  }

  return (
    <div
      className="min-h-screen cursor-text relative"
      onClick={handleContainerClick}
      style={{
        backgroundColor: '#f5ebe0',
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.01) 0px,
            transparent 1px,
            transparent 2px,
            rgba(0, 0, 0, 0.01) 3px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.01) 0px,
            transparent 1px,
            transparent 2px,
            rgba(0, 0, 0, 0.01) 3px
          ),
          radial-gradient(
            circle at 20% 30%,
            rgba(139, 69, 19, 0.03) 0%,
            transparent 50%
          ),
          radial-gradient(
            circle at 80% 70%,
            rgba(160, 82, 45, 0.02) 0%,
            transparent 50%
          )
        `
      }}
    >
      <div className="relative p-8">
        <div
          ref={containerRef}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8 border-b border-gray-300 pb-4">
            <div className="text-xs font-mono tracking-wider text-gray-600 uppercase">
              Terminal / Notes
            </div>
            <div className="text-[10px] font-mono text-gray-500 mt-2">
              Type and press ENTER. Click anywhere to focus.
            </div>
          </div>

          {/* Lines container */}
          <div className="space-y-1">
            {/* All lines */}
            {lines.map((line, index) => {
              const isEditing = currentLineIndex === index;
              return (
                <div key={index} className="flex gap-3 group">
                  <span className="text-gray-900 font-mono text-sm select-none opacity-40 group-hover:opacity-60 transition-opacity">
                    &gt;
                  </span>
                  {isEditing ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setCurrentInput(newValue);
                        const newLines = [...lines];
                        newLines[currentLineIndex] = newValue;
                        setLines(newLines);
                      }}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent border-none outline-none font-serif text-gray-900 leading-normal p-0 m-0"
                      style={{ caretColor: '#6b7280' }}
                      spellCheck={false}
                      autoComplete="off"
                    />
                  ) : (
                    <div className="flex-1">
                      <span className="whitespace-pre-wrap break-words font-serif text-gray-900 leading-normal">
                        {line || '\u00A0'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Draft line (shown when editing an existing line but have unsaved new line) */}
            {currentLineIndex !== -1 && draftLine && (
              <div className="flex gap-3 group">
                <span className="text-gray-900 font-mono text-sm select-none opacity-40 group-hover:opacity-60 transition-opacity">
                  &gt;
                </span>
                <div className="flex-1">
                  <span className="whitespace-pre-wrap break-words font-serif text-gray-900 leading-normal">
                    {draftLine}
                  </span>
                </div>
              </div>
            )}

            {/* New line input */}
            {currentLineIndex === -1 && (
              <div className="flex gap-3">
                <span className="text-gray-900 font-mono text-sm select-none opacity-60">
                  &gt;
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none font-serif text-gray-900 leading-normal p-0 m-0"
                  style={{ caretColor: '#6b7280' }}
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
