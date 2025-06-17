"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, MapPin, User, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserInfoForm } from "@/components/user-info-form"
import { TicketDisplay } from "@/components/ticket-display"
import type { PaymentOrderRequest } from "@/types/payment-type"
import { handlePaymentRequest } from "@/lib/payment-actions"

interface TicketType {
  id: string
  name: string
  price: number
  description: string
  available: number
}

interface TicketSelection {
  [key: string]: number
}

const ticketTypes: TicketType[] = [
  {
    id: "regular",
    name: "Regular",
    price: 10000,
    description: "General admission with standard seating",
    available: 500,
  },
  {
    id: "vip",
    name: "VIP",
    price: 100000,
    description: "Premium seating, meet & greet, exclusive merchandise",
    available: 100,
  },
  {
    id: "gate",
    name: "At Gate",
    price: 15000,
    description: "Purchase at venue entrance (subject to availability)",
    available: 50,
  },
]

const concertInfo = {
  title: "Summer Music Festival 2024",
  artist: "The Electric Waves",
  date: "Saturday, July 20, 2024",
  time: "7:00 PM - 11:00 PM",
  venue: "Madison Square Garden",
  location: "New York, NY",
  description:
    "Join us for an unforgettable night of music featuring The Electric Waves with special guests. Experience the magic of live music in one of the world's most iconic venues.",
  coverImage: "/placeholder.svg?height=400&width=600",
}

export default function ConcertTicketPlatform() {
  const [selectedTickets, setSelectedTickets] = useState<TicketSelection>({})
  const [showUserForm, setShowUserForm] = useState(false)
  const [generatedTickets, setGeneratedTickets] = useState<any[]>([])
  const [showTickets, setShowTickets] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const updateTicketQuantity = (ticketId: string, change: number) => {
    setSelectedTickets((prev) => {
      const current = prev[ticketId] || 0
      const newQuantity = Math.max(0, current + change)
      if (newQuantity === 0) {
        const { [ticketId]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [ticketId]: newQuantity }
    })
  }

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = ticketTypes.find((t) => t.id === ticketId)
      return total + (ticket ? ticket.price * quantity : 0)
    }, 0)
  }

  const handleProceedToCheckout = () => {
    if (getTotalTickets() > 0) {
      setShowUserForm(true)
    }
  }

  const generateTicketDescription = () => {
    const ticketSummary = Object.entries(selectedTickets)
      .map(([ticketId, quantity]) => {
        const ticket = ticketTypes.find(t => t.id === ticketId)
        return `${quantity}x ${ticket?.name || ticketId}`
      })
      .join(', ')
    
    return `${concertInfo.title} - ${ticketSummary}`
  }

  const handleUserInfoSubmit = async (userInfo: any) => {
    console.log("okello")
    setIsProcessingPayment(true)
    setPaymentError(null)

    try {
      // Create order details for payment
      const orderDetails: PaymentOrderRequest = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        currency: "UGX",
        amount: getTotalPrice(),
        description: generateTicketDescription(),
        callback_url: `${window.location.origin}/payment/callback`, // Update with your callback URL
        notification_id: `NOTIF-${Date.now()}`,
        branch: "Concert Tickets", // You can customize this
        billing_address: {
          email_address: userInfo.email,
          phone_number: userInfo.phone,
          country_code: "UG", // Assuming Uganda since using UGX
          first_name: userInfo.name.split(' ')[0] || userInfo.name,
          last_name: userInfo.name.split(' ').slice(1).join(' ') || userInfo.name,
          line_1: userInfo.address || "Kampala, Uganda", // You might want to add address field to your form
        },
      }

      // Call the server action to process payment
      const paymentResult = await handlePaymentRequest(orderDetails)

      if (paymentResult.success && paymentResult.redirect_url) {
        // Generate tickets with payment information
        const tickets = []
        for (const [ticketId, quantity] of Object.entries(selectedTickets)) {
          const ticketType = ticketTypes.find((t) => t.id === ticketId)
          if (ticketType) {
            for (let i = 0; i < quantity; i++) {
              tickets.push({
                id: `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                orderId: orderDetails.id,
                concertTitle: concertInfo.title,
                artist: concertInfo.artist,
                date: concertInfo.date,
                time: concertInfo.time,
                venue: concertInfo.venue,
                location: concertInfo.location,
                ticketType: ticketType.name,
                price: ticketType.price,
                holderName: userInfo.name,
                holderEmail: userInfo.email,
                holderPhone: userInfo.phone,
                paymentStatus: "pending",
                paymentLink: paymentResult.redirect_url,
                qrCode: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              })
            }
          }
        }

        setGeneratedTickets(tickets)
        setShowTickets(true)
        setShowUserForm(false)
      } else {
        // Handle payment error
        setPaymentError(paymentResult.error || 'Payment processing failed')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      setPaymentError('An unexpected error occurred. Please try again.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  if (showTickets) {
    return <TicketDisplay tickets={generatedTickets} />
  }

  if (showUserForm) {
    return (
      <UserInfoForm
        onSubmit={handleUserInfoSubmit}
        onBack={() => {
          setShowUserForm(false)
          setPaymentError(null)
        }}
        selectedTickets={selectedTickets}
        ticketTypes={ticketTypes}
        totalPrice={getTotalPrice()}
        isProcessing={isProcessingPayment}
        error={paymentError}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-center">Concert Tickets</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white">
        {/* Concert Cover Image */}
        <div className="relative">
          <Image
            src={concertInfo.coverImage || "/placeholder.svg"}
            alt={concertInfo.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl font-bold mb-1">{concertInfo.title}</h2>
            <p className="text-lg opacity-90">{concertInfo.artist}</p>
          </div>
        </div>

        {/* Concert Details */}
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="font-medium text-gray-900">{concertInfo.date}</p>
                <p className="text-sm">{concertInfo.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="font-medium text-gray-900">{concertInfo.venue}</p>
                <p className="text-sm">{concertInfo.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <User className="w-5 h-5" />
              <div>
                <p className="font-medium text-gray-900">Hosted by</p>
                <p className="text-sm">Live Nation Entertainment</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-gray-600 text-sm leading-relaxed">{concertInfo.description}</p>
          </div>
        </div>

        {/* Ticket Selection */}
        <div className="p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Select Tickets</h3>

          <div className="space-y-3">
            {ticketTypes.map((ticket) => (
              <Card key={ticket.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{ticket.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {ticket.available} left
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                      <p className="text-lg font-bold text-green-600">UGX {ticket.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateTicketQuantity(ticket.id, -1)}
                        disabled={!selectedTickets[ticket.id]}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      <span className="w-8 text-center font-medium">{selectedTickets[ticket.id] || 0}</span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateTicketQuantity(ticket.id, 1)}
                        disabled={(selectedTickets[ticket.id] || 0) >= ticket.available}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {selectedTickets[ticket.id] && (
                      <p className="font-semibold text-green-600">
                        UGX {(ticket.price * selectedTickets[ticket.id]).toLocaleString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Checkout Summary */}
        {getTotalTickets() > 0 && (
          <div className="p-4 bg-white border-t">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Tickets:</span>
                <span className="font-bold">{getTotalTickets()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price:</span>
                <span className="text-xl font-bold text-green-600">
                  UGX {getTotalPrice().toLocaleString()}
                </span>
              </div>

              <Button onClick={handleProceedToCheckout} className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}