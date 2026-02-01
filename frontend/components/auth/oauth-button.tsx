'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface OAuthButtonProps {
  provider: 'google' | 'github'
  onClick: () => Promise<void>
}

export function OAuthButton({ provider, onClick }: OAuthButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setError(null)
    setLoading(true)
    try {
      await onClick()
    } catch (err) {
      setError(err instanceof Error ? err.message : `${provider} login failed`)
      setLoading(false)
    }
  }

  const label = provider.charAt(0).toUpperCase() + provider.slice(1)

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="w-full bg-transparent"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? <Spinner className="w-4 h-4 mr-2" /> : null}
        {`Continue with ${label}`}
      </Button>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  )
}
