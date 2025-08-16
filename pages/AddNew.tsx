"use client";
import { Button } from "@/components/ui/button";
import { MonitorContext } from "@/context/MonitoringContext";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";
import { useContext, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Common country codes for phone numbers
const countryCodes = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+7", country: "Russia" },
  { code: "+55", country: "Brazil" },
  { code: "+52", country: "Mexico" },
  { code: "+27", country: "South Africa" },
  { code: "+82", country: "South Korea" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
];

export default function ListerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const websiteUrlRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [countryCode, setCountryCode] = useState("+91");
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);

  const context = useContext(MonitorContext);
  if (!context) return <div>Loading or context not found</div>;

  const { createWebsite } = context;

  const addEmail = () => {
    if (!emailRef.current?.value) {
      setError("Please enter an email address");
      return;
    }

    const email = emailRef.current.value;
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setEmails([...emails, email]);
    emailRef.current.value = "";
    setError(null);
  };

  const addPhone = () => {
    if (!phoneRef.current?.value) {
      setError("Please enter a phone number");
      return;
    }

    const phone = phoneRef.current.value;
    // Basic phone validation (numbers only)
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number should contain only digits");
      return;
    }

    setPhones([...phones, `${countryCode}${phone}`]);
    phoneRef.current.value = "";
    setError(null);
  };

  const removeEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  const removePhone = (index: number) => {
    const newPhones = [...phones];
    newPhones.splice(index, 1);
    setPhones(newPhones);
  };

  const createWebsiteFn = async (url: string) => {
    if (!url) {
      setError("Please enter a website URL");
      return;
    }

    if (emails.length === 0 && phones.length === 0) {
      setError("Please add at least one contact method (email or phone)");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    // Combine all contact information into a space-separated string
    const contactInfo = [...emails, ...phones].join(" ");

    try {
      const resp = await createWebsite(url, contactInfo);
      if (resp.status === "Error") {
        let errorMessage = "Failed to register website";
        if (typeof resp.response === "string") {
          errorMessage = resp.response;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((resp.response as any)?.reason) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errorMessage = (resp.response as any).reason;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((resp.response as any)?.message) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          errorMessage = (resp.response as any).message;
        }
        throw new Error(errorMessage);
      }
      setIsSuccess(true);
      // Reset form
      setEmails([]);
      setPhones([]);
      if (websiteUrlRef.current) websiteUrlRef.current.value = "";
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error("Error registering website:", err);
      let errorMessage = "An unexpected error occurred";
      if (err instanceof Error) {
        if (err.message.includes("Already exists")) {
          errorMessage = "This website is already registered";
        } else if (err.message.includes("execution reverted")) {
          errorMessage = err.message.split('"')[1] || "Transaction reverted";
        } else {
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30 lg:pl-40">
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-8 w-8 text-primary dark:text-cyan-700" />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Add Your Website
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Register your website for decentralized uptime monitoring and
                get notified when it goes down.
              </p>
            </div>

            <Card className="border-border/40 shadow-lg transition-all hover:shadow-xl">
              <CardHeader>
                <CardTitle>Website Registration</CardTitle>
                <CardDescription>
                  Enter your website URL and contact information for monitoring
                  alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {/* Website URL Input */}
                  <div className="grid gap-2">
                    <Label htmlFor="website-url">Website URL</Label>
                    <div className="relative flex-1">
                      <Input
                        id="website-url"
                        placeholder="https://example.com"
                        ref={websiteUrlRef}
                        className="pr-10"
                      />
                      {isSuccess && (
                        <div className="absolute right-3 top-1/2 -trancyan-y-1/2 transform">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">
                        Contact Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Add at least one contact method to receive alerts
                      </p>
                    </div>

                    {/* Email Input */}
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          ref={emailRef}
                        />
                        <Button
                          type="button"
                          onClick={addEmail}
                          variant="outline"
                          size="icon"
                          className="cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Display added emails */}
                    {emails.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {emails.map((email, index) => (
                          <Badge
                            key={`email-${index}`}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {email}
                            <button
                              onClick={() => removeEmail(index)}
                              className="ml-1 rounded-full p-0.5 hover:bg-muted cursor-pointer"
                              aria-label="Remove email"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Phone Input */}
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex gap-2">
                        <div className="flex w-full gap-2">
                          <Select
                            value={countryCode}
                            onValueChange={setCountryCode}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem
                                  key={country.code}
                                  value={country.code}
                                >
                                  {country.code} ({country.country})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="1234567890"
                            ref={phoneRef}
                            className="flex-1"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={addPhone}
                          variant="outline"
                          size="icon"
                          className="cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Display added phones */}
                    {phones.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {phones.map((phone, index) => (
                          <Badge
                            key={`phone-${index}`}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {phone}
                            <button
                              onClick={() => removePhone(index)}
                              className="ml-1 rounded-full p-0.5 hover:bg-muted cursor-pointer"
                              aria-label="Remove phone"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Error display */}
                  {error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={() =>
                      createWebsiteFn(websiteUrlRef.current?.value || "")
                    }
                    disabled={isSubmitting}
                    className="gap-2 w-full cursor-pointer"
                  >
                    {isSubmitting ? "Submitting..." : "Register Website"}
                    {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t bg-muted/50 px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  By registering your website, you agree to our terms of service
                  and privacy policy.
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
  );
}
