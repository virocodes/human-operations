'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PaymentModalProps {
  isOpen: boolean
}

export function PaymentModal({ isOpen }: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    try {
      setLoading(true)
      setError(null)

      // Create Stripe Checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create checkout session')
      }

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

      {/* Modal content */}
      <div className="relative max-w-md w-full mx-6 animate-fadeIn">
        <div className="bg-card border border-border shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-medium text-foreground tracking-tight mb-2">
              Human <span className="italic font-light">Operations</span>
            </h1>
            <p className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
              Payment Required
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8"></div>

          {/* Pricing */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="text-5xl font-serif font-medium text-foreground mb-2">$19</div>
              <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                One-Time Payment
              </p>
            </div>
            <p className="text-sm text-muted-foreground font-light">
              Complete your setup to unlock full access.<br />
              Pay once, optimize forever.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8"></div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 text-sm">
              <span className="font-mono text-muted-foreground mt-0.5">[✓]</span>
              <div>
                <div className="font-medium text-foreground">Unlimited Operations</div>
                <div className="text-xs text-muted-foreground font-light">Track habits, metrics, and goals</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="font-mono text-muted-foreground mt-0.5">[✓]</span>
              <div>
                <div className="font-medium text-foreground">AI-Generated System</div>
                <div className="text-xs text-muted-foreground font-light">Personalized to your ambitions</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="font-mono text-muted-foreground mt-0.5">[✓]</span>
              <div>
                <div className="font-medium text-foreground">Lifetime Access</div>
                <div className="text-xs text-muted-foreground font-light">Pay once, optimize forever</div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 text-xs font-mono text-destructive border border-destructive/50 bg-destructive/5">
              {error}
            </div>
          )}

          {/* CTA */}
          <div className="space-y-4">
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs tracking-wide uppercase rounded-sm h-11"
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </Button>

            <p className="text-xs text-muted-foreground text-center font-light">
              Secure payment processing via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
