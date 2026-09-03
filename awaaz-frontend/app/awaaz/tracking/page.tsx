import { Suspense } from "react"
import { WarmTracking } from "../../components/awaaz/warm-tracking"

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-awaaz-cream" />}>
      <WarmTracking />
    </Suspense>
  )
}