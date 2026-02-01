'use client'

import { Alert } from '@/components/ui/alert'

interface ErrorBannerProps {
  message: string | null
  onDismiss?: () => void
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null

  return (
    <Alert className="border-destructive bg-destructive/10 text-destructive mb-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-destructive hover:text-destructive/80 ml-2"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </Alert>
  )
}
