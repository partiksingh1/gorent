"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, Heart, MessageSquare, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { isAuthenticatedAtom, userAtom } from "@/state/auth";
import { useAtom } from "jotai";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [, setUser] = useAtom(userAtom); // Set the user state atom
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { label: "Home", href: "/", icon: Home },
        { label: "Properties", href: "/properties", icon: Home },
        { label: "Favorites", href: "/favorites", icon: Heart },
        { label: "Messages", href: "/chat", icon: MessageSquare },
    ];

    // Check if the user is logged in (e.g., token in localStorage)
    useEffect(() => {
        // Assuming the token is stored in localStorage
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user"); // You may replace this with user context if using context
        setIsLoggedIn(!!token && !!user); // Check both token and user
    }, []);

     const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null) // Clear user state
        setIsAuthenticated(false) // Clear authentication state
        window.location.reload();
      };
      

    return (
        <nav className="top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-blue-900">Go-Rent.ie</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-emerald-600
                  ${isActive(item.href) ? "text-emerald-600" : "text-gray-600"}`}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!isLoggedIn ? (
                            <>
                                <Button variant="outline" asChild>
                                    <Link href="/login">Log In</Link>
                                </Button>
                                <Button className="bg-blue-900 hover:bg-blue-900" asChild>
                                    <Link href="/signup">Sign Up</Link>
                                </Button>
                            </>
                        ) : (
                            // User Menu - When logged in
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>My Properties</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={handleLogout}>Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4">
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-emerald-600
                    ${isActive(item.href) ? "text-emerald-600" : "text-gray-600"}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                            <hr className="my-2" />
                            {!isLoggedIn ? (
                                <>
                                    <Link
                                        href="/login"
                                        className="block text-sm font-medium text-gray-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="block text-sm font-medium text-emerald-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/profile"
                                    className="block text-sm font-medium text-gray-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
