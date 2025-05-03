import umami from "@umami/node"
import { Env } from "./env"

function init({ profileId }: { profileId: string }) {
  console.debug("Initializing umami tracking for profile", profileId)
  try {
    umami.init({
      websiteId: profileId,
      hostUrl: "http://localhost:4000",
    })
  } catch (error) {
    console.error("Error initializing umami tracking", error)
  }
}

export const AnalyticsClient = {
  umami,
  initTracking: init,
}
