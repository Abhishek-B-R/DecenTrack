"use client"
import { ClerkProvider } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
const ValidatorPage = dynamic(() => import('@/pages/Validator'), {
  ssr: false,
});

export default function ValidatorWrapper() {
    return (
      <ClerkProvider>
        <ValidatorPage/>
      </ClerkProvider>
    )

};
