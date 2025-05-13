"use client"
import { useContext, useEffect, useState } from "react"
import { MonitorContext } from "@/Context/MonitoringContext"
import { RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { ethers } from "ethers"
import DeleteWebsite from "@/components/DeleteWebsite"
import Website from "@/interfaces/Website"
import AddBalance from "@/components/AddBalance"

export default function AllWebsites() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const sampleData = {
    id: "asd",
    timestamp: "asd",
    status: 2,
    location:"asd"
  }

  const context = useContext(MonitorContext)

  const [hasContext, setHasContext] = useState(!!context)

  useEffect(() => {
    setHasContext(!!context)
  }, [context])

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasContext])

  if (!context) return <div>Loading context...</div>

  if (!hasContext) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Monitor context not found</CardDescription>
          </CardHeader>
          <CardContent>
            <p>The monitoring context is not available. Please check your context provider.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { getWebsite, getRecentTicks, getMyWebsites, getWebsiteBalance } = context

  const fetchAllData = async () => {
    try {
      setRefreshing(true)
      // Step 1: Get all website IDs
      const websiteIdsTemp = await getMyWebsites()
      const websiteIds=websiteIdsTemp.data
      
      // Step 2: For each ID, get website details and ticks
      const websitePromises = websiteIds.map(async (id: string) => {
        const websiteDetailsTemp = await getWebsite(id)
        const websiteDetails=websiteDetailsTemp.data
        const recentTicksTemp = await getRecentTicks(id)
        const recentTicks=recentTicksTemp.data
        // Get website balance
        const balance = await getWebsiteBalance(id)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ticks = recentTicks.map((e: { validator: string; createdAt: any; status: number; latency: number }) => {
          let ts
          try {
            const raw = typeof e.createdAt === "bigint" ? Number(e.createdAt) : e.createdAt
            ts = typeof raw === "number" ? raw : Number.parseInt(raw)
          } catch {
            ts = e.createdAt
          }
          return {
            id: e.validator,
            timestamp: ts,
            status: e.status,
            latency: e.latency,
          }
        })
        console.log({
          id,
          name: websiteDetails[0],
          disabled: websiteDetails[2],
        })
        return {
          id,
          name: websiteDetails[0],
          disabled: websiteDetails[2],
          balance: balance ? ethers.formatEther(balance.data) : ethers.formatEther("0"),
          ...websiteDetails,
          ticks,
        }
      })
      // Wait for all promises to resolve
      const websiteData = await Promise.all(websitePromises)
      setWebsites(websiteData)
    } catch (error) {
      console.error("Error fetching website data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Function to format timestamp
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(Number(timestamp) * 1000)
      if (isNaN(date.getTime())) throw new Error("Invalid date")
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`
    } catch (e) {
      return "" + e
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Website Monitoring</h1>
          <Skeleton className="h-10 w-24" />
        </div>

        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Website Monitoring</h1>
        <Button onClick={fetchAllData} disabled={refreshing} className="flex items-center gap-2 cursor-pointer">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {websites.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Websites Found</CardTitle>
            <CardDescription>You don&apos;t have any websites configured for monitoring.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        websites.map((website) => (
          <Card key={website.id} className="w-full bg-gray-200 dark:bg-slate-900">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl">
                  <Link href={`/websites/${website.id}`}>{website.name || "Unnamed Website"}</Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">ID: {website.id}</CardDescription>
              </div>
              <div className="flex items-center gap-2 -ml-40 md:-ml-0">
                <Badge className={website.disabled ? "bg-red-500" : "bg-green-500"}>
                  {website.disabled ? "Inactive" : "Active"}
                </Badge>
                <Badge variant="outline" className="bg-amber-300 dark:bg-amber-900">
                  Balance: {website.balance} ETH
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-3">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground min-w-[100px]">Latest Status:</span>
                  <div className="flex items-center gap-3">
                    <TooltipProvider>
                      {!website.ticks || website.ticks.length === 0
                        ? // Show 5 grey circles if no ticks
                          Array(10)
                            .fill(0)
                            .map((_, index) => (
                              <Tooltip key={index}>
                                <TooltipTrigger>
                                  <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>No data available</p>
                                </TooltipContent>
                              </Tooltip>
                            ))
                        : // Sort ticks by timestamp (newest first) and take the first 5
                          [...website.ticks]
                            .concat([
                              sampleData,
                              sampleData,
                              sampleData,
                              sampleData,
                              sampleData,
                              sampleData,
                              sampleData,
                              sampleData,
                              sampleData,
                              sampleData,
                            ])
                            .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                            .slice(0, 10)
                            .map((tick, index) => (
                              <Tooltip key={index}>
                                <TooltipTrigger>
                                  <div
                                    className={`w-4 h-4 rounded-full ${
                                      tick.status == 0
                                        ? "bg-green-500"
                                        : tick.status == 2
                                          ? "bg-gray-400"
                                          : "bg-red-500"
                                    }`}
                                  ></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-xs">
                                    <p>Status: {tick.status == 0 ? "Good" : "Bad"}</p>
                                    <p>Time: {formatTime(tick.timestamp)}</p>
                                    <p>Latency: {tick.latency ? `${tick.latency}ms` : "N/A"}</p>
                                    <p>Validator: {tick.id}</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <AddBalance website={website} fetchAllData={fetchAllData}/>
              <DeleteWebsite website={website} fetchAllData={fetchAllData}/>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}
