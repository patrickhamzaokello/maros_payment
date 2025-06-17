"use client"

import type React from "react"

import { useState } from "react"
import { Search, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface VerificationResult {
  valid: boolean
  ticket?: {
    id: string
    concertTitle: string
    artist: string
    date: string
    venue: string
    ticketType: string
    holderName: string
    paymentStatus: string
  }
  message: string
}

export default function TicketVerification() {
  const [ticketNumber, setTicketNumber] = useState("")
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const verifyTicket = async () => {
    if (!ticketNumber.trim()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock verification logic
      const isValidFormat = ticketNumber.startsWith("TKT-")

      if (isValidFormat) {
        setVerificationResult({
          valid: true,
          ticket: {
            id: ticketNumber,
            concertTitle: "Summer Music Festival 2024",
            artist: "The Electric Waves",
            date: "Saturday, July 20, 2024",
            venue: "Madison Square Garden",
            ticketType: "VIP",
            holderName: "John Doe",
            paymentStatus: "confirmed",
          },
          message: "Ticket is valid and confirmed",
        })
      } else {
        setVerificationResult({
          valid: false,
          message: "Invalid ticket number format or ticket not found",
        })
      }

      setIsLoading(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verifyTicket()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Verify Ticket</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white">
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Ticket Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketNumber">Ticket Number</Label>
                  <Input
                    id="ticketNumber"
                    type="text"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    placeholder="Enter ticket number (e.g., TKT-123456789)"
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500">Enter the ticket number found on your ticket</p>
                </div>

                <Button type="submit" className="w-full" disabled={!ticketNumber.trim() || isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Verify Ticket
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Verification Result */}
          {verificationResult && (
            <Card
              className={`mt-4 border-2 ${verificationResult.valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {verificationResult.valid ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  )}

                  <div className="flex-1">
                    <h3
                      className={`font-semibold mb-2 ${verificationResult.valid ? "text-green-800" : "text-red-800"}`}
                    >
                      {verificationResult.valid ? "Valid Ticket" : "Invalid Ticket"}
                    </h3>

                    <p className={`text-sm mb-3 ${verificationResult.valid ? "text-green-700" : "text-red-700"}`}>
                      {verificationResult.message}
                    </p>

                    {verificationResult.valid && verificationResult.ticket && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-600">Event</p>
                            <p className="font-medium">{verificationResult.ticket.concertTitle}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Artist</p>
                            <p className="font-medium">{verificationResult.ticket.artist}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-medium">{verificationResult.ticket.date}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Venue</p>
                            <p className="font-medium">{verificationResult.ticket.venue}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Type</p>
                            <p className="font-medium">{verificationResult.ticket.ticketType}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Holder</p>
                            <p className="font-medium">{verificationResult.ticket.holderName}</p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Badge
                            variant={verificationResult.ticket.paymentStatus === "confirmed" ? "default" : "secondary"}
                            className={
                              verificationResult.ticket.paymentStatus === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            Payment {verificationResult.ticket.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">How to verify a ticket:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Enter the ticket number exactly as shown on the ticket</li>
                <li>• Ticket numbers start with "TKT-" followed by numbers and letters</li>
                <li>• Valid tickets will show event details and payment status</li>
                <li>• Contact support if you have issues with verification</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
