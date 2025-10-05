import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <>
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNavigation />
    </>
  );
}
