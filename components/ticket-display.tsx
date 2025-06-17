"use client"

import { useState } from "react"
import { Download, ExternalLink, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

interface Ticket {
  id: string
  concertTitle: string
  artist: string
  date: string
  time: string
  venue: string
  location: string
  ticketType: string
  price: number
  holderName: string
  holderEmail: string
  holderPhone: string
  paymentStatus: string
  paymentLink: string
  qrCode: string
}

interface TicketDisplayProps {
  tickets: Ticket[]
}

export function TicketDisplay({ tickets }: TicketDisplayProps) {
  const [copiedTicket, setCopiedTicket] = useState<string | null>(null)

  const copyTicketNumber = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId)
    setCopiedTicket(ticketId)
    toast({
      title: "Copied!",
      description: "Ticket number copied to clipboard",
    })
    setTimeout(() => setCopiedTicket(null), 2000)
  }


  const downloadTicket = (ticket) => {
    // Create canvas for ticket image
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size (wider for better layout)
    canvas.width = 900
    canvas.height = 450

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x, y, width, height, radius) => {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
    }

    // Background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#f8fafc")
    gradient.addColorStop(1, "#ffffff")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Main ticket container with rounded corners and shadow effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 10

    drawRoundedRect(30, 30, canvas.width - 60, canvas.height - 60, 15)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    // Reset shadow
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Header section with gradient background
    const headerGradient = ctx.createLinearGradient(0, 40, 0, 140)
    headerGradient.addColorStop(0, "#1e293b")
    headerGradient.addColorStop(1, "#334155")

    drawRoundedRect(40, 40, canvas.width - 80, 100, 12)
    ctx.fillStyle = headerGradient
    ctx.fill()

    // Concert title (main heading)
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 32px 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(ticket.concertTitle, 60, 85)

    // Artist name
    ctx.fillStyle = "#e2e8f0"
    ctx.font = "20px 'Segoe UI', Arial, sans-serif"
    ctx.fillText(`by ${ticket.artist}`, 60, 115)

    // Divider line
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(60, 170)
    ctx.lineTo(canvas.width - 200, 170)
    ctx.stroke()

    // Left column - Event details
    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif"
    ctx.fillText("EVENT DETAILS", 60, 200)

    const eventDetails = [
      { label: "Date", value: ticket.date },
      { label: "Time", value: ticket.time },
      { label: "Venue", value: ticket.venue },
      { label: "Location", value: ticket.location }
    ]

    eventDetails.forEach((detail, index) => {
      const yPos = 225 + index * 30

      // Label
      ctx.fillStyle = "#64748b"
      ctx.font = "12px 'Segoe UI', Arial, sans-serif"
      ctx.fillText(detail.label.toUpperCase(), 60, yPos)

      // Value
      ctx.fillStyle = "#1e293b"
      ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif"
      ctx.fillText(detail.value, 60, yPos + 15)
    })

    // Right column - Ticket info
    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif"
    ctx.fillText("TICKET INFO", canvas.width - 320, 200)

    const ticketDetails = [
      { label: "Type", value: ticket.ticketType },
      { label: "Price", value: `UGX ${ticket.price.toLocaleString()}` },
      { label: "Holder", value: ticket.holderName },
      { label: "Ticket #", value: ticket.id }
    ]

    ticketDetails.forEach((detail, index) => {
      const yPos = 225 + index * 30

      // Label
      ctx.fillStyle = "#64748b"
      ctx.font = "12px 'Segoe UI', Arial, sans-serif"
      ctx.fillText(detail.label.toUpperCase(), canvas.width - 320, yPos)

      // Value
      ctx.fillStyle = "#1e293b"
      ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif"
      ctx.fillText(detail.value, canvas.width - 320, yPos + 15)
    })

    // QR Code/Image placeholder area
    const qrSize = 120
    const qrX = canvas.width - 160
    const qrY = 180

    // QR code background
    drawRoundedRect(qrX, qrY, qrSize, qrSize, 8)
    ctx.fillStyle = "#f1f5f9"
    ctx.fill()

    // QR code border
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 2
    ctx.stroke()

    // Load and draw image
    const img = new Image()
    img.onload = function () {
      ctx.save()
      drawRoundedRect(qrX + 5, qrY + 5, qrSize - 10, qrSize - 10, 6)
      ctx.clip()
      ctx.drawImage(img, qrX + 5, qrY + 5, qrSize - 10, qrSize - 10)
      ctx.restore()
    }
    img.src = "/maros_port.jpeg"

    // QR code label
    ctx.fillStyle = "#64748b"
    ctx.font = "12px 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("SCAN ME", qrX + qrSize / 2, qrY + qrSize + 20)

    // Payment status badge
    const statusX = 60
    const statusY = canvas.height - 90
    const statusPadding = 12

    // Determine status color
    const isPaymentComplete = ticket.paymentStatus?.toLowerCase() === "completed" ||
      ticket.paymentStatus?.toLowerCase() === "paid"
    const statusColor = isPaymentComplete ? "#059669" : "#d97706"
    const statusBgColor = isPaymentComplete ? "#d1fae5" : "#fef3c7"
    const statusText = isPaymentComplete ? "PAID" : "PENDING"

    // Status background
    ctx.font = "bold 12px 'Segoe UI', Arial, sans-serif"
    const statusWidth = ctx.measureText(statusText).width + statusPadding * 2

    drawRoundedRect(statusX, statusY - 20, statusWidth, 25, 12)
    ctx.fillStyle = statusBgColor
    ctx.fill()

    // Status text
    ctx.fillStyle = statusColor
    ctx.textAlign = "center"
    ctx.fillText(statusText, statusX + statusWidth / 2, statusY - 5)

    // Footer note
    ctx.fillStyle = "#94a3b8"
    ctx.font = "11px 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Present this ticket at the venue entrance", canvas.width / 2, canvas.height - 45)

    // Terms note
    ctx.fillText("Valid only for the specified date and time • Non-transferable", canvas.width / 2, canvas.height - 25)

    // Decorative corner elements
    ctx.fillStyle = "#e2e8f0"

    // Top corners
    ctx.beginPath()
    ctx.arc(60, 60, 3, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(canvas.width - 60, 60, 3, 0, 2 * Math.PI)
    ctx.fill()

    // Bottom corners
    ctx.beginPath()
    ctx.arc(60, canvas.height - 60, 3, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(canvas.width - 60, canvas.height - 60, 3, 0, 2 * Math.PI)
    ctx.fill()

    // Download
    setTimeout(() => {
      const link = document.createElement("a")
      link.download = `${ticket.concertTitle.replace(/\s+/g, '-')}-ticket-${ticket.id}.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()

      // Show toast notification (assuming toast function exists)
      if (typeof toast === 'function') {
        toast({
          title: "Download Complete!",
          description: "Your ticket has been saved successfully",
        })
      }
    }, 100) // Small delay to ensure image loads
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-center">Your Tickets</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white">
        {/* Success Message */}
        <div className="p-4 bg-green-50 border-b border-green-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-green-800 mb-1">Tickets Generated!</h2>
            <p className="text-sm text-green-600">Your tickets have been created. Complete payment to activate them.</p>
          </div>
        </div>

        {/* Payment Link */}
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="text-center">
            <p className="text-sm text-yellow-800 mb-3">Complete your payment to activate your tickets</p>
            <Button
              onClick={() => window.open(tickets[0]?.paymentLink, "_blank")}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Complete Payment
            </Button>
          </div>
        </div>

        {/* Tickets */}
        <div className="p-4 space-y-4">
          {tickets.map((ticket, index) => (
            <Card key={ticket.id} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ticket.concertTitle}</CardTitle>
                    <p className="text-sm text-gray-600">{ticket.artist}</p>
                  </div>
                  <Badge
                    variant={ticket.paymentStatus === "pending" ? "secondary" : "default"}
                    className={ticket.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                  >
                    {ticket.paymentStatus}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{ticket.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-medium">{ticket.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Venue</p>
                    <p className="font-medium">{ticket.venue}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Type</p>
                    <p className="font-medium">{ticket.ticketType}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ticket Holder</span>
                    <span className="font-medium">{ticket.holderName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price</span>
                    <span className="font-medium text-green-600">UGX {ticket.price}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs text-gray-600">Ticket Number</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-gray-100 p-2 rounded font-mono">{ticket.id}</code>
                    <Button variant="outline" size="sm" onClick={() => copyTicketNumber(ticket.id)} className="p-2">
                      {copiedTicket === ticket.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button variant="outline" onClick={() => downloadTicket(ticket)} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Ticket
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50">
          <div className="space-y-3">
            <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
              Buy More Tickets
            </Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/verify")} className="w-full text-sm">
              Verify a Ticket
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
