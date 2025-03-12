"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QrCode, Share2 } from "lucide-react"
import { useEffect, useState } from "react"

interface ShareButtonProps {
  url: string
  title?: string
  text?: string
  className?: string
}

export function ShareButton({
  url,
  title = "Check this out!",
  text = "I thought you might find this interesting",
  className,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isWebShareAvailable, setIsWebShareAvailable] = useState(true)

  // Check if web share API is available when component mounts
  useEffect(() => {
    setIsWebShareAvailable(
      typeof navigator !== "undefined" && !!navigator.share,
    )
  }, [])

  // Generate QR code when URL changes
  useEffect(() => {
    if (url) {
      // Using a free QR code API service to generate QR code
      const encodedUrl = encodeURIComponent(window.location.origin + url)
      setQrCodeUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`,
      )
    }
  }, [url])

  const handleShare = async () => {
    // If Web Share API is not available, show the QR code dialog
    if (!isWebShareAvailable) {
      setDialogOpen(true)
      return
    }

    try {
      setIsSharing(true)
      await navigator.share({
        title,
        text,
        url,
      })
      console.log("URL shared successfully")
    } catch (error) {
      if (error instanceof Error) {
        if (error.toString().includes("AbortError")) {
          console.warn("Sharing cancelled:", error)
          return
        }
      }

      throw error
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  return (
    <>
      <Button
        onClick={handleShare}
        className={className}
        size="sm"
        disabled={isSharing}
      >
        <Share2 className="size-4" />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share via QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            {qrCodeUrl && (
              <div className="relative size-52 rounded-lg bg-white p-2 shadow-sm">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="h-auto w-full"
                />
              </div>
            )}
            <div className="text-muted-foreground text-center text-sm">
              Scan this QR code or use the button below
            </div>
            <Button
              onClick={handleCopyToClipboard}
              className="w-full"
              variant="outline"
            >
              <QrCode className="mr-2 size-4" /> Copy Link to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
