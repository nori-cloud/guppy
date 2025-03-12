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

const containerClassName =
  "rounded-4xl border-4 border-foreground shadow-md shadow-foreground p-2"

// Define device presets with their respective properties
const devicePresets = {
  "iPhone 16 Pro": {
    width: 1179,
    height: 2556,
    className: "w-72 md:w-80 max-w-full",
    containerClassName,
    contentClassName: "rounded-[26px]",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  "Pixel 2": {
    width: 1080,
    height: 1920,
    className: "w-64 md:w-72 max-w-full",
    containerClassName,
    contentClassName: "rounded-[18px]",
    userAgent:
      "Mozilla/5.0 (Linux; Android 11; Pixel 2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
  },
  "Pixel 9": {
    width: 1080,
    height: 2340,
    className: "w-64 md:w-72 max-w-full",
    containerClassName,
    contentClassName: "rounded-[20px]",
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  },
  "Nothing Phone 2": {
    width: 1080,
    height: 2412,
    className: "w-64 md:w-72 max-w-full",
    containerClassName,
    contentClassName: "rounded-[24px]",
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; Nothing Phone 2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36",
  },
}

type DeviceType = keyof typeof devicePresets

interface DevicePreviewProps {
  profileName: string
}

export function DevicePreview({ profileName }: DevicePreviewProps) {
  const [selectedDevice, setSelectedDevice] =
    useState<DeviceType>("Nothing Phone 2")
  const [iframeUrl, setIframeUrl] = useState<string>("")
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, height, className, containerClassName, contentClassName } =
    devicePresets[selectedDevice]

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIframeUrl(`${window.location.origin}/${profileName}`)
    }
  }, [profileName])

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
        <div
          className={cn(
            "relative transform-gpu overflow-hidden shadow-lg transition-all",
            className,
            containerClassName,
          )}
          style={{
            aspectRatio: `${width} / ${height}`,
            transform: scale < 1 ? `scale(${scale})` : "none",
            transformOrigin: "center top",
            maxHeight: "100%",
          }}
        >
          {/* Status bar for mobile devices */}
          {selectedDevice.includes("iPhone") ||
          selectedDevice.includes("Pixel") ||
          selectedDevice.includes("Nothing") ? (
            <div className="absolute top-0 right-0 left-0 z-10 flex h-6 items-center justify-between px-5">
              <div className="absolute top-0 left-1/2 h-4 w-16 -translate-x-1/2 rounded-b-xl bg-black"></div>
            </div>
          ) : null}

          {/* Actual content container */}
          <div
            className={cn(
              "bg-background h-full w-full overflow-hidden",
              contentClassName,
            )}
          >
            {iframeUrl && (
              <iframe
                src={iframeUrl}
                className="h-full w-full border-0"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                title={`${selectedDevice} preview`}
                sandbox="allow-same-origin allow-scripts allow-forms"
                referrerPolicy="same-origin"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
