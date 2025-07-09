"use client";
import { SignIn } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex justify-center items-center py-12">
        <SignIn
          path="/sign-in"
          routing="path"
          appearance={{
            baseTheme: neobrutalism,
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
