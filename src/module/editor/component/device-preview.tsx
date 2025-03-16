"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

// Define device presets with their respective properties
const devicePresets = {
  "iPhone 16 Pro": {
    width: 1179,
    height: 2556,
    className: "w-72 md:w-80 max-w-full",
  },
  "Pixel 2": {
    width: 1080,
    height: 1920,
    className: "w-64 md:w-72 max-w-full",
  },
  "Pixel 9": {
    width: 1080,
    height: 2340,
    className: "w-64 md:w-72 max-w-full",
  },
  "Nothing Phone 2": {
    width: 1080,
    height: 2412,
    className: "w-64 md:w-72 max-w-full",
  },
}

type DeviceType = keyof typeof devicePresets

interface DevicePreviewProps {
  children: React.ReactNode
}

export function DevicePreview({ children }: DevicePreviewProps) {
  const [selectedDevice, setSelectedDevice] =
    useState<DeviceType>("Nothing Phone 2")
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height, className } = devicePresets[selectedDevice]

  // Calculate scale based on container height
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerHeight =
          containerRef.current.parentElement?.clientHeight || 0
        const maxHeightWithMargin = containerHeight - 80 // Reduced margin (was 120)

        if (maxHeightWithMargin <= 0) return

        // Get natural height based on selected device's aspect ratio and current width
        const deviceContainer = containerRef.current.querySelector("div")
        if (!deviceContainer) return

        const currentWidth = deviceContainer.clientWidth
        const naturalHeight = (currentWidth / width) * height

        // Only scale down if needed
        if (naturalHeight > maxHeightWithMargin) {
          const newScale = maxHeightWithMargin / naturalHeight
          setScale(Math.max(0.9, newScale)) // Don't scale below 90%
        } else {
          setScale(1)
        }
      }
    }

    // Update on window resize and device change
    updateScale()
    window.addEventListener("resize", updateScale)
    return () => window.removeEventListener("resize", updateScale)
  }, [selectedDevice, width, height])

  return (
    <div
      className="flex h-full w-full flex-col items-center gap-4"
      ref={containerRef}
    >
      <div className="mb-2 flex w-full flex-wrap items-center justify-between gap-4">
        <Select
          value={selectedDevice}
          onValueChange={(value) => setSelectedDevice(value as DeviceType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select device" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(devicePresets).map((device) => (
              <SelectItem key={device} value={device}>
                {device}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-muted-foreground text-xs">
          Resolution: {width}×{height}
          {scale < 1 && ` (Scaled: ${Math.round(scale * 100)}%)`}
        </div>
      </div>

      {/* Device container with proper bezels */}
      <div
        className="flex w-full flex-1 items-center justify-center overflow-auto"
        style={{ maxHeight: "calc(100% - 60px)" }}
      >
        <div className="border-foreground shadow-foreground rounded-4xl border-4 p-2 shadow-md">
          <div
            className={cn(
              "scrollbar-hidden relative transform-gpu overflow-y-auto shadow-lg transition-all",
              className,
            )}
            style={{
              aspectRatio: `${width} / ${height}`,
              transform: scale < 1 ? `scale(${scale})` : "none",
              transformOrigin: "center top",
              maxHeight: "100%",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
