"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-300 shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-medium text-gray-900 tracking-tight mb-2">
              Human <span className="italic font-light">Operations</span>
            </h1>
            <p className="text-xs font-mono tracking-wider text-gray-600 uppercase">
              Authentication Required
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300 my-8"></div>

          {/* Sign in button */}
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-mono text-xs tracking-wide uppercase rounded-sm h-11 cursor-pointer"
            >
              {loading ? "Connecting..." : "Sign in with Google"}
            </Button>

            <p className="text-xs text-gray-600 text-center font-light">
              Secure authentication via Google OAuth
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs font-mono tracking-widest text-gray-500 uppercase text-center mt-8">
          Optimizing Human Performance Since 2025
        </p>
      </div>
    </div>
  );
}
