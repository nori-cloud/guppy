import PublicProfilePage from "@/app/(public)/[name]/page"

interface DevicePreviewProps {
  profileName: string
}

export function DevicePreview({ profileName }: DevicePreviewProps) {
  const params = (async () => ({
    name: profileName,
  }))()

  return (
    <div className="shadow-foreground/80 border-foreground relative flex aspect-[9/19] w-[300px] flex-col rounded-3xl border-4 shadow-md">
      <PublicProfilePage params={params} />
    </div>
  )
}
