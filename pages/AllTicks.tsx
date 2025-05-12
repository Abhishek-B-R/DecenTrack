"use client"
import { MonitorContext } from "@/Context/MonitoringContext"
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowDownAZ, ArrowUpAZ, SortDesc } from "lucide-react"

interface Website {
  id: string
  name: string
  url?: string
  disabled?: string
  ticks?: Tick[]
}

interface Tick {
  validator: string
  createdAt: string
  status: number
  latency?: number
  location: string
}

export default function AllTicks() {
  const params = useParams()
  const context = useContext(MonitorContext)
  const websiteId = params?.websiteId
  const [website, setWebsite] = useState<Website>()
  const [ticks, setTicks] = useState<Tick[]>([])
  const [sortedTicks, setSortedTicks] = useState<Tick[]>([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest")

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websiteId]) // Add websiteId as dependency

  useEffect(() => {
    // Apply sorting whenever ticks or sortOrder changes
    sortTicks(sortOrder)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticks, sortOrder])

  if (!context) return <div>Context loading...</div>
  const { getWebsiteTicks, getWebsite } = context

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch website data
      const websiteData = await getWebsite(websiteId as string)
      setWebsite(websiteData)

      // Fetch ticks data
      const ticksData = await getWebsiteTicks(websiteId as string)
      setTicks(ticksData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to parse timestamp from tick
  const parseTimestamp = (tick: Tick): number => {
    let ts
    try {
      const raw = typeof tick.createdAt === "bigint" ? Number(tick.createdAt) : tick.createdAt
      ts = typeof raw === "number" ? raw : Number.parseInt(raw)
    } catch {
      ts = 0 // Default to 0 if parsing fails
    }
    return Number(ts)
  }

  // Function to sort ticks based on current sort order
  const sortTicks = (order: "latest" | "oldest") => {
    if (!ticks.length) {
      setSortedTicks([])
      return
    }

    const sorted = [...ticks].sort((a, b) => {
      const timestampA = parseTimestamp(a)
      const timestampB = parseTimestamp(b)

      return order === "latest"
        ? timestampB - timestampA // Latest first (descending)
        : timestampA - timestampB // Oldest first (ascending)
    })

    setSortedTicks(sorted)
  }

  // Function to toggle sort order
  const handleSortChange = (order: "latest" | "oldest") => {
    setSortOrder(order)
  }

  // Format timestamp for display
  const formatTimestamp = (tick: Tick) => {
    let ts
    try {
      const raw = typeof tick.createdAt === "bigint" ? Number(tick.createdAt) : tick.createdAt
      ts = typeof raw === "number" ? raw : Number.parseInt(raw)
    } catch {
      ts = tick.createdAt
    }
    const date = new Date(Number(ts) * 1000)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`
  }

  if (loading) {
    return (
      <div className="h-screen p-20">
        <div className="mb-6">
          <div className="h-8 w-48 bg-slate-900 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-96 bg-slate-900 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-72 bg-slate-900 rounded animate-pulse"></div>
        </div>

        <div className="overflow-x-auto">
          <div className="h-7 w-40 bg-slate-900 rounded animate-pulse mb-4"></div>
          <div className="w-full border border-slate-900 shadow-sm rounded-lg overflow-hidden">
            <div className="h-12 bg-slate-900 w-full"></div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 w-full border-b border-gray-800 flex items-center px-4">
                <div className="h-4 w-1/5 bg-gray-800 rounded animate-pulse mx-2"></div>
                <div className="h-6 w-20 bg-gray-800 rounded animate-pulse mx-2"></div>
                <div className="h-4 w-1/5 bg-gray-800 rounded animate-pulse mx-2"></div>
                <div className="h-4 w-16 bg-gray-800 rounded animate-pulse mx-2"></div>
                <div className="h-4 w-1/5 bg-gray-800 rounded animate-pulse mx-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen p-20">
      {website && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Website Details</h1>
          <p className="text-lg">
            <span className="font-semibold">URL:</span> {website.url}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Website ID:</span> {websiteId}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Monitoring Ticks</h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SortDesc className="h-4 w-4" />
                Sort by: {sortOrder === "latest" ? "Latest First" : "Oldest First"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleSortChange("latest")}
                className={sortOrder === "latest" ? "bg-slate-100 dark:bg-slate-800" : ""}
              >
                <ArrowDownAZ className="mr-2 h-4 w-4" />
                Latest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("oldest")}
                className={sortOrder === "oldest" ? "bg-slate-100 dark:bg-slate-800" : ""}
              >
                <ArrowUpAZ className="mr-2 h-4 w-4" />
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {sortedTicks.length > 0 ? (
          <table className="min-w-full dark:bg-slate-900 bg-slate-100 border border-gray-300 dark:border-gray-700 shadow-sm rounded-lg overflow-hidden">
            <thead className="dark:bg-gray-800 bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left border-b border-r border-gray-300 dark:border-gray-700">Tick ID</th>
                <th className="py-3 px-4 text-left border-b border-r border-gray-300 dark:border-gray-700">Location</th>
                <th className="py-3 px-4 text-left border-b border-r border-gray-300 dark:border-gray-700">Status</th>
                <th className="py-3 px-4 text-left border-b border-r border-gray-300 dark:border-gray-700">
                  Timestamp
                </th>
                <th className="py-3 px-4 text-left border-b border-gray-300 dark:border-gray-700">Response Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
              {sortedTicks.map((tick, index) => (
                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 border-r border-gray-300 dark:border-gray-700">{tick.validator}</td>
                  <td className="py-3 px-4 border-r border-gray-300 dark:border-gray-700">{tick.location}</td>
                  <td className="py-3 px-4 border-r border-gray-300 dark:border-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tick.status == 0 ? "text-green-100 bg-green-700" : "text-red-100 bg-red-700"
                      }`}
                    >
                      {tick.status == 0 ? "Good" : "Bad"}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300 dark:border-gray-700">{formatTimestamp(tick)}</td>
                  <td className="py-3 px-4">{tick.latency}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 text-center rounded-lg border border-gray-300 dark:border-gray-700">
            <p className="text-gray-500">No monitoring data available for this website.</p>
          </div>
        )}
      </div>
    </div>
  )
}
