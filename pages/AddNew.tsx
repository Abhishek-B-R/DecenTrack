/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button } from "@/components/ui/button"
import { MonitorContext } from "@/Context/MonitoringContext";
import { AlertCircle, ArrowRight, CheckCircle, Globe } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ListerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const websiteUrlRef = useRef<HTMLInputElement>(null)
  const context = useContext(MonitorContext);
  if (!context) return <div>Loading or context not found</div>;

  const { createWebsite } = context;
  const createWebsiteFn = async (url: string) => {
    if (!url) {
      setError("Please enter a website URL");
      return;
    }
    setError(null);
    setIsSubmitting(true);
  
    try {
      const resp = await createWebsite(url);
      if (resp.status === "Error") {
        let errorMessage = "Failed to register website";
        if (typeof resp.response === "string") {
          errorMessage = resp.response;
        } else if ((resp.response as any)?.reason) {
          errorMessage = (resp.response as any).reason;
        } else if ((resp.response as any)?.message) {
          errorMessage = (resp.response as any).message;
        }
        throw new Error(errorMessage);
      }
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error("Error registering website:", err);      
      let errorMessage = "An unexpected error occurred";
      if (err instanceof Error) {
        if (err.message.includes("Already exists")) {
          errorMessage = "This website is already registered";
        }
        else if (err.message.includes("execution reverted")) {
          errorMessage = err.message.split('"')[1] || "Transaction reverted";
        }
        else {
          errorMessage = err.message.substring(0, 200);
          if (err.message.length > 200) errorMessage += "...";
        }
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30 pl-40">
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-8 w-8 text-primary dark:text-violet-700" />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Add Your Website</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Register your website for decentralized uptime monitoring and get notified when it goes down.
              </p>
            </div>

            <Card className="border-border/40 shadow-lg transition-all hover:shadow-xl">
              <CardHeader>
                <CardTitle>Website Registration</CardTitle>
                <CardDescription>Enter your website URL to start monitoring its uptime</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="website-url">Website URL</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="website-url"
                          placeholder="https://example.com"
                          ref={websiteUrlRef}
                          className="pr-10"
                        />
                        {isSuccess && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => createWebsiteFn(websiteUrlRef.current?.value || "")}
                        disabled={isSubmitting}
                        className="gap-2"
                      >
                        {isSubmitting ? "Submitting..." : "Register"}
                        {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                      </Button>
                    </div>
                    {error && (
                      <Alert variant="destructive" className="mt-2 max-w-80">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t bg-muted/50 px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  By registering your website, you agree to our terms of service and privacy policy.
                </p>
              </CardFooter>
            </Card>

            <div className="mx-auto grid max-w-md grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 text-center">
                <div className="rounded-full bg-primary/10 p-2">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="font-medium">24/7 Monitoring</h3>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 text-center">
                <div className="rounded-full bg-primary/10 p-2">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 12h10" />
                    <path d="m9 7 5 5-5 5" />
                    <path d="M22 7v10" />
                  </svg>
                </div>
                <h3 className="font-medium">Instant Alerts</h3>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-4 text-center">
                <div className="rounded-full bg-primary/10 p-2">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-medium">Detailed Reports</h3>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
