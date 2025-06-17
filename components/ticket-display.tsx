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

    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    };
    // Create canvas for ticket image
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 400

    // Background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

    // Header background
    ctx.fillStyle = "#1f2937"
    ctx.fillRect(20, 20, canvas.width - 40, 80)

    // Title
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 24px Arial"
    ctx.fillText(ticket.concertTitle, 40, 55)

    // Artist
    ctx.font = "18px Arial"
    ctx.fillText(ticket.artist, 40, 80)

    // Ticket details
    ctx.fillStyle = "#374151"
    ctx.font = "16px Arial"

    const details = [
      `Date: ${ticket.date}`,
      `Time: ${ticket.time}`,
      `Venue: ${ticket.venue}`,
      `Location: ${ticket.location}`,
      `Type: ${ticket.ticketType}`,
      `Price: UGX ${ticket.price}`,
      `Holder: ${ticket.holderName}`,
      `Ticket #: ${ticket.id}`,
    ]

    details.forEach((detail, index) => {
      ctx.fillText(detail, 40, 140 + index * 25)
    })

    // Payment status
    ctx.fillStyle = ticket.paymentStatus === "pending" ? "#f59e0b" : "#10b981"
    ctx.font = "bold 16px Arial"
    ctx.fillText(`Status: ${ticket.paymentStatus.toUpperCase()}`, 40, 360)

    // Image Code placeholder  
    const img = await loadImage("/maros_port.jpeg");
    ctx.drawImage(img, canvas.width - 150, 120, 120, 120);

    // Download
    const link = document.createElement("a")
    link.download = `ticket-${ticket.id}.png`
    link.href = canvas.toDataURL()
    link.click()

    toast({
      title: "Downloaded!",
      description: "Ticket image has been downloaded",
    })
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
