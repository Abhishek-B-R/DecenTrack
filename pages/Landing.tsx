import Link from "next/link"
import { ArrowRight, CheckCircle, Globe, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 xl:pl-46">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Decentralized Website Uptime Monitoring
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Monitor website uptime with the power of blockchain. Add your sites or validate others and earn
                    Ethereum rewards.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/lister">
                    <Button size="lg" className="w-full min-[400px]:w-auto dark:bg-violet-700">
                      Add Your Website
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/validator">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Validate & Earn ETH
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-full bg-gradient-to-b from-primary/20 to-primary/5 p-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="h-32 w-32 text-primary dark:text-violet-700" />
                  </div>
                  <div className="absolute top-10 right-10 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="absolute bottom-20 left-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <Zap className="h-6 w-6 text-primary dark:text-violet-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full bg-muted/50 py-12 md:py-24 lg:py-32 xl:pl-40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Our decentralized platform connects website owners with validators in a trustless ecosystem
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-8 w-8 text-primary dark:text-violet-700" />
                </div>
                <h3 className="text-xl font-bold">Website Owners</h3>
                <p className="text-muted-foreground">
                  Add your websites to our decentralized monitoring network. Get reliable uptime data verified by
                  multiple independent validators.
                </p>
                <Link href="/lister" className="w-full">
                  <Button className="w-full dark:bg-violet-700">
                    Add Your Website
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-8 w-8 text-primary dark:text-violet-700" />
                </div>
                <h3 className="text-xl font-bold">Validators</h3>
                <p className="text-muted-foreground">
                  Check if websites are up or down. Submit your validation to the blockchain and earn Ethereum rewards
                  for correct assessments.
                </p>
                <Link href="/validator" className="w-full">
                  <Button className="w-full dark:bg-violet-700">
                    Start Validating
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:pl-40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Why choose our decentralized uptime monitoring solution
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Decentralized",
                  description: "No single point of failure. Monitoring is distributed across the network.",
                  icon: <Globe className="h-10 w-10 text-primary dark:text-violet-700" />,
                },
                {
                  title: "Incentivized",
                  description: "Validators earn Ethereum for correctly identifying website status.",
                  icon: <Zap className="h-10 w-10 text-primary dark:text-violet-700" />,
                },
                {
                  title: "Transparent",
                  description: "All monitoring data is stored on the blockchain for complete transparency.",
                  icon: <Shield className="h-10 w-10 text-primary dark:text-violet-700" />,
                },
                {
                  title: "Reliable",
                  description: "Multiple independent validators ensure accurate uptime reporting.",
                  icon: <CheckCircle className="h-10 w-10 text-primary dark:text-violet-700" />,
                },
                {
                  title: "Global",
                  description: "Validators from around the world provide diverse network perspectives.",
                  icon: <Globe className="h-10 w-10 text-primary dark:text-violet-700" />,
                },
                {
                  title: "Rewarding",
                  description: "Participate in the network and earn cryptocurrency rewards.",
                  icon: <Zap className="h-10 w-10 text-primary dark:text-violet-700" />,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 text-center shadow-sm"
                >
                  {feature.icon}
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full dark:bg-violet-700 bg-primary text-primary-foreground py-12 md:py-24 lg:py-32 xl:pl-40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="mx-auto max-w-[700px] md:text-xl">
                  Join our decentralized network today and revolutionize website monitoring
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/lister">
                  <Button size="lg" variant="secondary" className="w-full min-[400px]:w-auto">
                    Add Your Website
                  </Button>
                </Link>
                <Link href="/validator">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full min-[400px]:w-auto bg-slate-900 border-primary-foreground text-primary-foreground hover:bg-slate-700 hover:text-white"
                  >
                    Validate & Earn ETH
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2025 DecenTrack. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}