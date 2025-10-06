import { Umami } from "./env"
import Script from "next/script"

type AnalyticsScriptProps = {
  trackingId: string
}
export function LoadAnalyticsScript({ trackingId }: AnalyticsScriptProps) {
  return (
    <Script
      defer
      src={`${Umami.Url}/script.js`}
      data-website-id={trackingId}
    />
  )
}
