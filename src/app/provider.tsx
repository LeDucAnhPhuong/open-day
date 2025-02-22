"use client";
import React from "react";
import { Toaster } from "sonner";
import { AppProgressBar } from "next-nprogress-bar";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense>
      <Toaster position="top-right" />
      {children}
      <AppProgressBar
        shallowRouting
        color="#75A815"
        height="4px"
        options={{ showSpinner: false }}
      />
    </React.Suspense>
  );
};

export default Provider;
