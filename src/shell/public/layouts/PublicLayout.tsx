import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import { TopNav } from "@/shell/public/navigation/TopNav";
import { SiteFooter } from "@/shell/public/footer/SiteFooter";

export function PublicLayout(): ReactElement {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}