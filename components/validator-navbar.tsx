"use client"
import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { MonitorContext } from "@/Context/MonitoringContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, Coins, CreditCard } from "lucide-react"
import Link from "next/link"
import DarkModeToggle from "./DarkModeToggle"
import SignInOut from "./SignInOut"

export default function ValidatorNavbar() {
  const context = useContext(MonitorContext)
  const [pendingPayout, setPendingPayout] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [claimSuccess, setClaimSuccess] = useState(false)

  const handleCheckEarnings = async () => {
    if (!context) return

    try {
      setIsLoading(true)
      setError(null)
      const payoutTemp = await context.myPendingPayout()
      const payout=payoutTemp.data
      setPendingPayout(payout)
    } catch (err) {
      setError(`Failed to fetch earnings: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimRewards = async () => {
    if (!context) return

    try {
      setIsLoading(true)
      setError(null)
      await context.getMyPayouts()
      setClaimSuccess(true)
      // Reset pending payout after successful claim
      setPendingPayout("0")
    } catch (err) {
      setError(`Failed to claim rewards: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <ArrowLeft className="h-4 w-4" suppressHydrationWarning/>
            <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleCheckEarnings}>
                <Coins className="mr-2 h-4 w-4 cursor-pointer" />
                Check Earnings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your Validator Earnings</DialogTitle>
                <DialogDescription>Current pending rewards that you can claim</DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Pending Rewards</p>
                      <p className="text-3xl font-bold">{pendingPayout || "0"} ETH</p>
                    </div>
                  </div>

                  {claimSuccess ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded-md">
                      Rewards successfully claimed! Your wallet will be credited shortly.
                    </div>
                  ) : (
                    <Button
                      className="w-full cursor-pointer"
                      onClick={handleClaimRewards}
                      disabled={isLoading || !pendingPayout || pendingPayout === "0"}
                    >
                      <CreditCard className="mr-2 h-4 w-4 cursor-pointer" />
                      Claim Rewards
                    </Button>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
          <DarkModeToggle/>
          <SignInOut/>
        </div>
      </div>
    </header>
  )
}
