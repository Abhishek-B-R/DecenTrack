"use client"
import dynamic from 'next/dynamic';
const ValidatorPage = dynamic(() => import('@/components/ValidatorContent'), {
  ssr: false,
});

export default function ValidatorWrapper() {
    return (
      <ValidatorPage/>
    )
};
