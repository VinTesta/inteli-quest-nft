import { Home, QrCode, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 shadow-lg">
      <div className="container mx-auto flex justify-around items-center h-16">
        <NavLink to="/" className="flex flex-col items-center text-foreground/60 hover:text-foreground">
          <Home className="h-6 w-6" />
          <span className="text-xs">Início</span>
        </NavLink>
        <NavLink to="/capture" className="flex flex-col items-center -mt-8">
          <div className="bg-primary rounded-full p-4 shadow-lg">
            <QrCode className="h-8 w-8 text-primary-foreground" />
          </div>
          <span className="text-xs mt-1">Capturar</span>
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center text-foreground/60 hover:text-foreground">
          <User className="h-6 w-6" />
          <span className="text-xs">Coleção</span>
        </NavLink>
      </div>
    </div>
  );
}
