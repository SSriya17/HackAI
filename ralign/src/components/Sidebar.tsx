"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Mic, User, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Discovery", href: "/discovery", icon: Search },
    { label: "Interview Prep", href: "/prep", icon: Mic },
    { label: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-background border-r border-white/10 flex flex-col h-screen sticky top-0">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-comet-orange to-galaxy-green rounded-xl flex items-center justify-center">
                    <Zap className="text-white w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tighter">RAlign</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-white/5 text-comet-orange border border-white/10"
                                    : "text-foreground/60 hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-comet-orange" : "group-hover:text-galaxy-green"
                            )} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </Link>

                <div className="mt-4 p-4 glass-card flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-galaxy-green/20 flex items-center justify-center text-galaxy-green font-bold">
                        AJ
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Alex Johnson</span>
                        <span className="text-xs text-foreground/40">UTD Student</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
