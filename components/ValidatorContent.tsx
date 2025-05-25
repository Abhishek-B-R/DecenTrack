"use client"
import { useEffect, useState, useContext } from "react"
import { SignInButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react"
import { MonitorContext } from "@/context/MonitoringContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Steps, Step } from "@/components/steps"

export default function ValidatorPage() {
  const context = useContext(MonitorContext)
  const { user, isLoaded: isUserLoaded } = useUser()
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const checkAndRegisterValidator = async () => {
      if (!context || !isUserLoaded || !user) return

      try {
        setIsLoading(true)
        const publicAddress = user.primaryWeb3Wallet?.web3Wallet || user.id
        const isAuthenticated = await context.isValidatorAuthenticated(publicAddress)

        if (!isAuthenticated) {
          const location = prompt(
            "To register as a validator, please enter your city or location. This helps us distribute validators geographically. We will not spam or store this info."
          )

          if (!location || location.trim() === "") {
            setError("Location is required to register as a validator.")
            return
          }

          await context.registerValidator(publicAddress, location.trim())
          setSuccess("Successfully registered as a validator")
        }

        setIsRegistered(true)
      } catch (err) {
        setError(`Failed to register validator: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setIsLoading(false)
      }
    }

    checkAndRegisterValidator()
  }, [context, isUserLoaded, user])

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess("Copied to clipboard!")
  }

  if (!context) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="container py-12">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl space-y-8">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Validate & Earn ETH</h1>
              <p className="text-muted-foreground md:text-xl">Run our validator code and earn Ethereum rewards</p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-1/3 mx-auto" />
                <Alert>
                  <AlertTitle>Tips:</AlertTitle>
                  <AlertDescription>
                    <h1>If this loading doesn&apos;t stop then,</h1>
                    <h2>Please SignIn if not done yet</h2>
                    <h2>Make sure your metamask wallet has SepoliaETH as default network</h2>
                  </AlertDescription>
                </Alert>
              </div>
            ) : !isUserLoaded ? (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Sign In Required</CardTitle>
                  <CardDescription>Please sign in to start validating websites and earning ETH.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button size="lg" asChild>
                    <SignInButton />
                  </Button>
                </CardContent>
              </Card>
            ) : isRegistered ? (
              <Card>
                <CardHeader>
                  <CardTitle>Validator Setup Instructions</CardTitle>
                  <CardDescription>
                    Follow these simple steps to set up and run the validator on your computer. The longer you keep it
                    running, the more ETH you&apos;ll earn!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-medium text-green-600 mb-2">You&apos;re registered as a validator! 🎉</p>
                    <p>Check the button in the navbar to track your ETH earnings at any time.</p>
                  </div>

                  <Steps>
                    <Step title="Clone the Repository">
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded text-sm flex-1">
                          git clone https://github.com/Abhishek-B-R/DecenTrack-Validator.git
                          cd DecenTrack-Validator
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() =>
                            copyToClipboard("git clone https://github.com/Abhishek-B-R/DecenTrack-Validator.git \n cd DecenTrack-Validator")
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This downloads the validator code to your computer. Open your terminal or command prompt and
                        paste this command.
                      </p>
                    </Step>

                    <Step title="Install Dependencies">
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded text-sm flex-1">npm install</code>
                        <Button
                          variant="outline"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => copyToClipboard("npm install")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This installs all the necessary packages. This might take a few minutes.
                      </p>
                    </Step>

                    <Step title="Start the Validator">
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="bg-muted p-2 rounded text-sm flex-1">npm run dev</code>
                        <Button
                          variant="outline"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => copyToClipboard("npm run dev")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This starts the validator. Keep this running to earn ETH!
                      </p>
                    </Step>
                  </Steps>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Important Notes:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700">
                      <li>Your computer must stay on with the validator running to earn ETH</li>
                      <li>The longer you keep the validator running, the more ETH you&apos;ll earn</li>
                      <li>Check your earnings anytime using the tracking button in the navbar</li>
                      <li>For technical support, please contact our team via Discord</li>
                    </ul>
                  </div>

                  <div className="flex justify-center">
                    <Button className="w-full md:w-auto" asChild>
                      <a
                        href="https://github.com/Abhishek-B-R/DecenTrack-Validator"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Repository
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Registration Required</CardTitle>
                  <CardDescription>We need to register you as a validator before you can proceed.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={async () => {
                      if (!context || !user) return
                      try {
                        setIsLoading(true)
                        const publicAddress = user.primaryWeb3Wallet?.web3Wallet || user.id
                        const location = prompt(
                          "To register as a validator, please enter your city or location. This helps us distribute validators geographically. We will not spam or store this info."
                        )

                        if (!location || location.trim() === "") {
                          setError("Location is required to register as a validator.")
                          return
                        }

                        await context.registerValidator(publicAddress, location.trim())
                        setIsRegistered(true)
                        setSuccess("Successfully registered as a validator")
                      } catch (err) {
                        setError(`Failed to register: ${err instanceof Error ? err.message : String(err)}`)
                      } finally {
                        setIsLoading(false)
                      }
                    }}
                  >
                    Register as Validator
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
