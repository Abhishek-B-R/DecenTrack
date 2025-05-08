"use client"
import { Button } from "@/components/ui/button"
import { MonitorContext } from "../Context/MonitoringContext";
import { useContext, useRef } from "react";

export default function ListerPage() {
  const websiteUrlRef = useRef<HTMLInputElement>(null)
  const context = useContext(MonitorContext);
  console.log(context)
  if (!context) return <div>Loading or context not found</div>;

  const {
    // currentUser,
    // connectWallet,
    createWebsite,
    // addTick,
    // getAllWebsites,
    // deleteWebsite,
    // registerValidator,
    // getWebsite,
    // getRecentTicks,
    // getWebsiteTicks,
    // getMyWebsites,
    // myPendingPayout,
    // getMyPayouts
  } = context;

  return (
    <div className="flex min-h-screen flex-col px-30">
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Add Your Website</h1>
              <p className="text-muted-foreground md:text-xl">
                Register your website for decentralized uptime monitoring
              </p>
            </div>

            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <input type="text" placeholder="website url" className="w-[85%] h-10 border-2" ref={websiteUrlRef}/>
              <Button className="h-10 m-2" onClick={()=>{
                if(!websiteUrlRef.current?.value) {
                  alert("empty url")
                  return
                }
                createWebsite(websiteUrlRef.current?.value)
              }}>Submit</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 UptimeChain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
