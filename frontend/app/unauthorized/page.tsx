'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-destructive">403</p>
              <p className="text-muted-foreground">
                You do not have permission to access this resource.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push('/dashboard')} variant="default" className="w-full">
                Go to Dashboard
              </Button>
              <Link href="/login" passHref>
                <Button variant="outline" className="w-full bg-transparent">
                  Return to Sign In
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              If you believe this is an error, please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
