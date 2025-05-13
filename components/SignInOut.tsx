import {
    SignInButton,
    SignUpButton,
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
                <Button asChild variant={"secondary"}><SignUpButton /></Button>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    )
};
