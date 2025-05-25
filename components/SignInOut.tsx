import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"

export default function SignInOut() {
    return (
        <div className='mt-1'>
            <SignedOut>
                <Button asChild><SignInButton /></Button>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    )
};
