"use client";

import { useAuth } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { navigationLinks } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { isSignedIn } = useAuth();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="px-1 text-left">
                    <SheetTitle className="font-display text-2xl">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 py-6">
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "text-lg font-medium transition-colors hover:text-primary",
                                pathname === link.href
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-border/70">
                        {!isSignedIn ? (
                            <Button asChild variant="secondary" onClick={() => setOpen(false)}>
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                        ) : (
                            <Button asChild variant="secondary" onClick={() => setOpen(false)}>
                                <Link href="/account">My Account</Link>
                            </Button>
                        )}
                        <Button asChild onClick={() => setOpen(false)}>
                            <Link href="/book">Reserve fitting</Link>
                        </Button>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
