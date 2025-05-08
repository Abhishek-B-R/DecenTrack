import { Button } from "@/components/ui/button"

export default function ValidatorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Validate & Earn ETH</h1>
              <p className="text-muted-foreground md:text-xl">
                Check website status and earn Ethereum rewards for correct validations
              </p>
            </div>

            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <p className="mb-8 text-center text-muted-foreground">
                This is a placeholder for the website validation interface. Here you would validate if websites are up
                or down and submit your findings to earn ETH.
              </p>
              <div className="flex justify-center">
                <Button size="lg">Connect Wallet to Start Validating</Button>
              </div>
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
