import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen overflow-clip">
      <header className="flex items-center h-20 justify-between px-6 py-4 bg-gray-800">
        <h1 className="text-xl font-bold text-white">FPT Battle</h1>
      </header>
      <div className="h-[calc(100%-80px)]">{children}</div>
    </main>
  );
};

export default Layout;
