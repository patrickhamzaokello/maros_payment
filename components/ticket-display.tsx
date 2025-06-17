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


  const downloadTicket = (ticket: Ticket) => {
    // Create canvas for ticket image
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size (landscape ticket format)
    canvas.width = 800
    canvas.height = 300

    // Background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Left section - Colorful graphic area (40% of width)
    const leftSectionWidth = canvas.width * 0.4

    // Dark background for left section
    ctx.fillStyle = "#2d1b4e"
    ctx.fillRect(0, 0, leftSectionWidth, canvas.height)

    // Create abstract geometric shapes for visual appeal
    // Large circles
    ctx.fillStyle = "#7c3aed"
    ctx.beginPath()
    ctx.arc(leftSectionWidth * 0.3, canvas.height * 0.25, 40, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = "#06d6a0"
    ctx.beginPath()
    ctx.arc(leftSectionWidth * 0.7, canvas.height * 0.4, 35, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = "#f72585"
    ctx.beginPath()
    ctx.arc(leftSectionWidth * 0.5, canvas.height * 0.7, 45, 0, 2 * Math.PI)
    ctx.fill()

    // Smaller accent shapes
    ctx.fillStyle = "#ffd60a"
    ctx.beginPath()
    ctx.arc(leftSectionWidth * 0.15, canvas.height * 0.6, 20, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = "#ff006e"
    ctx.beginPath()
    ctx.arc(leftSectionWidth * 0.8, canvas.height * 0.75, 25, 0, 2 * Math.PI)
    ctx.fill()

    // Add some geometric patterns
    ctx.fillStyle = "#4cc9f0"
    ctx.fillRect(leftSectionWidth * 0.1, canvas.height * 0.1, 15, 15)

    ctx.fillStyle = "#7209b7"
    ctx.fillRect(leftSectionWidth * 0.75, canvas.height * 0.15, 12, 12)

    // Artist/Event name on colored section
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.save()
    ctx.translate(leftSectionWidth * 0.5, canvas.height * 0.9)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(ticket.artist.toUpperCase(), 0, 0)
    ctx.restore()

    // Middle section - Main content area
    const middleSectionStart = leftSectionWidth + 20
    const middleSectionWidth = canvas.width * 0.45

    // Event title
    ctx.fillStyle = "#1a1a1a"
    ctx.font = "bold 24px 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(ticket.concertTitle, middleSectionStart, 50)

    // Category/Type
    ctx.fillStyle = "#666666"
    ctx.font = "12px 'Segoe UI', Arial, sans-serif"
    ctx.fillText(ticket.ticketType.toUpperCase(), middleSectionStart, 75)

    // Divider line
    ctx.strokeStyle = "#e0e0e0"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(middleSectionStart, 90)
    ctx.lineTo(middleSectionStart + middleSectionWidth - 40, 90)
    ctx.stroke()

    // Date and time section
    ctx.fillStyle = "#1a1a1a"
    ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif"
    ctx.fillText("DATE & TIME", middleSectionStart, 115)

    ctx.fillStyle = "#333333"
    ctx.font = "16px 'Segoe UI', Arial, sans-serif"
    ctx.fillText(ticket.date, middleSectionStart, 135)
    ctx.fillText(ticket.time, middleSectionStart, 155)

    // Venue section
    ctx.fillStyle = "#1a1a1a"
    ctx.font = "bold 14px 'Segoe UI', Arial, sans-serif"
    ctx.fillText("VENUE", middleSectionStart, 185)

    ctx.fillStyle = "#333333"
    ctx.font = "16px 'Segoe UI', Arial, sans-serif"
    ctx.fillText(ticket.venue, middleSectionStart, 205)
    ctx.fillText(ticket.location, middleSectionStart, 225)

    // Price and ticket info
    ctx.fillStyle = "#1a1a1a"
    ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif"
    ctx.fillText(`UGX ${ticket.price.toLocaleString()}`, middleSectionStart, 255)

    // Ticket holder
    ctx.fillStyle = "#666666"
    ctx.font = "12px 'Segoe UI', Arial, sans-serif"
    ctx.fillText(`Holder: ${ticket.holderName}`, middleSectionStart, 275)

    // Payment status indicator
    const statusColor = ticket.paymentStatus?.toLowerCase() === "completed" ||
      ticket.paymentStatus?.toLowerCase() === "paid" ? "#06d6a0" : "#ff6b35"

    ctx.fillStyle = statusColor
    ctx.beginPath()
    ctx.arc(middleSectionStart + middleSectionWidth - 50, 40, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Right section - Barcode and ticket number
    const rightSectionStart = leftSectionWidth + middleSectionWidth + 20
    const rightSectionWidth = canvas.width - rightSectionStart - 20

    // Ticket number (rotated)
    ctx.fillStyle = "#666666"
    ctx.font = "12px 'Segoe UI', Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.save()
    ctx.translate(rightSectionStart + 20, canvas.height * 0.3)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(`#${ticket.id}`, 0, 0)
    ctx.restore()

    // Barcode simulation
    ctx.fillStyle = "#000000"
    const barcodeStart = rightSectionStart + 35
    const barcodeWidth = rightSectionWidth - 50
    const barcodeHeight = 60
    const barcodeY = canvas.height * 0.4

    // Generate barcode-like pattern
    for (let i = 0; i < 25; i++) {
      const barWidth = Math.random() > 0.5 ? 2 : 1
      const barHeight = barcodeHeight * (0.7 + Math.random() * 0.3)
      const x = barcodeStart + (i * (barcodeWidth / 25))
      const y = barcodeY + (barcodeHeight - barHeight) / 2

      ctx.fillRect(x, y, barWidth, barHeight)
    }

    // Barcode number
    ctx.fillStyle = "#333333"
    ctx.font = "10px 'Courier New', monospace"
    ctx.textAlign = "center"
    ctx.fillText("1234567890123", rightSectionStart + rightSectionWidth / 2, barcodeY + barcodeHeight + 20)

    // QR code placeholder (smaller, positioned below barcode)
    const qrSize = 50
    const qrX = rightSectionStart + (rightSectionWidth - qrSize) / 2
    const qrY = barcodeY + barcodeHeight + 40

    // QR code background
    ctx.fillStyle = "#f5f5f5"
    ctx.fillRect(qrX, qrY, qrSize, qrSize)

    // QR code border
    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1
    ctx.strokeRect(qrX, qrY, qrSize, qrSize)

    // Load and draw image in QR area
    const img = new Image()
    img.onload = function () {
      ctx.drawImage(img, qrX + 2, qrY + 2, qrSize - 4, qrSize - 4)
    }
    img.src = "maros_port.jpeg"

    // Perforation line effect (dotted line separating sections)
    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])

    // Vertical perforation between left and middle sections
    ctx.beginPath()
    ctx.moveTo(leftSectionWidth + 10, 20)
    ctx.lineTo(leftSectionWidth + 10, canvas.height - 20)
    ctx.stroke()

    // Vertical perforation between middle and right sections
    ctx.beginPath()
    ctx.moveTo(rightSectionStart - 10, 20)
    ctx.lineTo(rightSectionStart - 10, canvas.height - 20)
    ctx.stroke()

    // Reset line dash
    ctx.setLineDash([])

    // Small circular perforations for authentic ticket look
    ctx.fillStyle = "#ffffff"
    const perfY = [canvas.height * 0.2, canvas.height * 0.5, canvas.height * 0.8]
    perfY.forEach(y => {
      // Left perforation line
      ctx.beginPath()
      ctx.arc(leftSectionWidth + 10, y, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Right perforation line
      ctx.beginPath()
      ctx.arc(rightSectionStart - 10, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Download with delay to ensure image loads
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
    }, 100)
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
