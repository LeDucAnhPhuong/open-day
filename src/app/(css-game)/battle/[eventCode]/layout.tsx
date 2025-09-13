import React from "react";
import BattleProvider from "./provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <BattleProvider>{children}</BattleProvider>;
};

export default Layout;
