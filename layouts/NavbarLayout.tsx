import React from "react";
import Navbar from "../components/Navbar";

export default function NavBarLayout({ children }) {
  return (
    <div className="flex flex-col h-screen items-center">
      <Navbar />
      <div className="flex w-full h-auto max-w-7xl px-2">{children}</div>
    </div>
  );
}
