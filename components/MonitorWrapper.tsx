// components/MonitorWrapper.tsx
"use client";

import { MonitorProvider } from "@/context/MonitoringContext";

export default function MonitorWrapper({ children }: { children: React.ReactNode }) {
  return <MonitorProvider>{children}</MonitorProvider>;
}
