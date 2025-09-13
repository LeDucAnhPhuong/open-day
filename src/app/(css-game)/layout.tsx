import { Navigation } from "@/components/layout";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen">
      <Navigation />
      <div className="h-[calc(100%-80px)]">{children}</div>
    </main>
  );
};

export default Layout;
