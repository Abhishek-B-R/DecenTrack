import { Shield } from "lucide-react";

export default function Footer() {
    return (
      <footer className="w-full border-t bg-background py-6 md:py-0 md:pl-10 lg:pl-[400px] xl-[400px] 2xl:pl-[600px]">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="block md:flex items-center gap-2">
            <div className="flex">
              <Shield className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">© 2025 DecenTrack. All rights reserved.</p>
            </div>
            <p className="text-sm text-muted-foreground">Made by <span className="text-sky-500">Abhishek BR, Vibhu Revadi and Chandanagouda</span></p>
          </div>
        </div>
      </footer>
    )
};
