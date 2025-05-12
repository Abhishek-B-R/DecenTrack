// components/MonitorWrapper.tsx
"use client";

import { MonitorProvider } from "@/Context/MonitoringContext";

export default function MonitorWrapper({ children }: { children: React.ReactNode }) {
  return <MonitorProvider>{children}</MonitorProvider>;
}
