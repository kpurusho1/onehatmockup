import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Mic, 
  Users, 
  FileText, 
  Pill, 
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    id: "voice-health",
    label: "Voice Health Record",
    icon: Mic,
    path: "/voice-health",
  },
  {
    id: "patient-protocols",
    label: "Patient Protocols",
    icon: Users,
    path: "/patient-protocols",
  },
  {
    id: "protocol-templates",
    label: "Protocol Templates",
    icon: FileText,
    path: "/protocol-templates",
  },
  {
    id: "prescription",
    label: "Prescription",
    icon: Pill,
    path: "/prescription",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    path: "/profile",
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  return (
    <div
      className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">1h</span>
                </div>
                <span className="font-semibold text-lg">1hat</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Dr. Abhishant, Urologist</p>
                <p>Nishant Hospital</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )
            }
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-accent-foreground font-medium text-sm">M</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium">Dr. Mithra</p>
              <p className="text-xs text-muted-foreground">DOCTOR</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};