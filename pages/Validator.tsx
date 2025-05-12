"use client"
import { useEffect, useState, useContext } from "react"
import { SignInButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { MonitorContext } from "@/Context/MonitoringContext"

export default function ValidatorPage() {
  const context = useContext(MonitorContext)
  const { user, isLoaded: isUserLoaded } = useUser()
  const [websites, setWebsites] = useState<{ url: string; id:string; status?: number; latency?: number }[]>([])
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [websiteIds,setWebsiteIds]=useState<string[]>([])

  useEffect(() => {
    // Register validator when user is loaded
    const registerValidatorFn = async () => {
      if (!context || !isUserLoaded || !user) return
      try {
        setIsLoading(true)
        // Use the user's public address from Clerk
        const publicAddress = user.primaryWeb3Wallet?.web3Wallet || user.id
        if(!(await context.isValidatorAuthenticated(publicAddress))){
          await context.registerValidator(publicAddress,"hubli")
        }
        setIsRegistered(true)
        setSuccess("Successfully registered as a validator")
        // Fetch websites after registration
        fetchWebsites()
      } catch (err) {
        setError(`Failed to register validator: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setIsLoading(false)
      }
    }

    registerValidatorFn()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, isUserLoaded, user])

  // Fetch all websites
  const fetchWebsites = async () => {
    if (!context) return
    try {
      setIsLoading(true)
      const [allIds,sites] = await context.getAllWebsites()
      setWebsiteIds(allIds)
      setWebsites(sites)
    } catch (err) {
      setError(`Failed to fetch websites: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Set up interval to validate websites every 5 minutes
  useEffect(() => {
    if (!isRegistered || !context) return
    const validateWebsites = async () => {
      try {
        const sites = await context.getAllWebsites()
        setWebsites(sites)
        // Validate each website
        for (let i=0;i<sites.length;i++) {
          const website=sites[i]
          try {
            // Check website status and measure latency
            const { status, latency } = await checkWebsiteStatus(website.name)
            // Call addTick with all three parameters
            console.log(website[i])
            console.log(websiteIds[i])
            // await context.addTick(websiteIds[i], status, latency)
            setSuccess(
              `Successfully validated ${website.url} (Status: ${status == 0 ? "Up" : "Down"}, Latency: ${latency}ms)`,
            )
          } catch (err) {
            setError(`Failed to validate ${website.url}: ${err instanceof Error ? err.message : String(err)}`)
          }
        }
      } catch (err) {
        setError(`Failed to fetch websites: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    // Function to check website status and measure latency
    const checkWebsiteStatus = async (url: string): Promise<{ status: number; latency: number }> => {
      const startTime = performance.now()
      let status = 1 // Default to down (1)
      try {
        // Add protocol if missing
        const fullUrl = url.startsWith("http") ? url : `https://${url}`
        // Fetch with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        const response = await fetch(fullUrl, {
          method: "GET",
          signal: controller.signal,
          mode: "no-cors", // To handle CORS issues
        })
        clearTimeout(timeoutId)

        // Status 0 means website is up (HTTP 200)
        status = response.status == 200 ? 0 : 1
        console.log(fullUrl,response.status)
        console.log(status)
      } catch (error) {
        // Any error means the website is down
        status = 1
        console.error(`Error checking ${url}:`, error)
      } finally {
        // Calculate latency
        const latency = Math.round(performance.now() - startTime)
        return { status, latency }
      }
    }
    // Initial validation
    validateWebsites()
    // Set interval for every 5 minutes (300000 ms)
    const intervalId = setInterval(validateWebsites, 300000)
    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [isRegistered, context, websiteIds])

  // Clear alerts after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

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
              <p className="text-muted-foreground md:text-xl">
                Check website status and earn Ethereum rewards for correct validations
              </p>
            </div>

            <div className="rounded-lg border bg-card p-8 shadow-sm">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-12 w-1/3 mx-auto" />
                </div>
              ) : !isUserLoaded ? (
                <div className="text-center">
                  <p className="mb-8 text-muted-foreground">
                    Please sign in to start validating websites and earning ETH.
                  </p>
                  <Button size="lg" asChild><SignInButton/></Button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-4">Active Websites for Validation</h2>
                  {websites.length > 0 ? (
                    <div className="space-y-4">
                      {websites.map((website, index) => (
                        <div key={index} className="p-4 border rounded-md">
                          <p className="font-medium">{website.url}</p>
                          <div className="flex justify-between mt-2">
                            <p className="text-sm text-muted-foreground">
                              Status:{" "}
                              {website.status == 0 ? (
                                <span className="text-green-600 font-medium">Online</span>
                              ) : (
                                <span className="text-red-600 font-medium">Offline</span>
                              )}
                            </p>
                            {website.latency && (
                              <p className="text-sm text-muted-foreground">
                                Latency: <span className="font-medium">{website.latency}ms</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      <p className="mt-4 text-sm text-muted-foreground">
                        Websites are automatically validated every 5 minutes. Your last validation was at{" "}
                        {new Date().toLocaleTimeString()}.
                      </p>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No websites available for validation at the moment. Check back later.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
