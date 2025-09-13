"use client";
import React from "react";
import { Toaster } from "sonner";
import { AppProgressBar } from "next-nprogress-bar";
import { CookiesProvider } from "react-cookie";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CookiesProvider>
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
    </CookiesProvider>
  );
};

export default Provider;
