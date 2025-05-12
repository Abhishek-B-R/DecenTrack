import { Link, Shield } from "lucide-react";

export default function Footer() {
    return <footer className="w-full border-t bg-background py-6 md:py-0 md:pl-10 lg:pl-20 xl:pl-20 2xl:pl-40">
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
};
