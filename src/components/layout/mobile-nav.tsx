"use client";

import { useAuth } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navKeys = ["collections", "bookTryOn", "wishlist", "account"] as const;
const navHrefs = ["/collections", "/book", "/wishlist", "/account"] as const;

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { isSignedIn } = useAuth();
    const t = useTranslations("Nav");

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label={t("openMenu")}
                >
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="px-1 text-left">
                    <SheetTitle className="font-display text-2xl">{t("menu")}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 py-6">
                    {navKeys.map((key, index) => {
                        const href = navHrefs[index];
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "text-lg font-medium transition-colors hover:text-primary",
                                    pathname === href
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {t(key)}
                            </Link>
                        );
                    })}

                    <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-border/70">
                        {!isSignedIn ? (
                            <Button asChild variant="secondary" onClick={() => setOpen(false)}>
                                <Link href="/sign-in">{t("signIn")}</Link>
                            </Button>
                        ) : (
                            <Button asChild variant="secondary" onClick={() => setOpen(false)}>
                                <Link href="/account">{t("myAccount")}</Link>
                            </Button>
                        )}
                        <Button asChild onClick={() => setOpen(false)}>
                            <Link href="/book">{t("reserveFitting")}</Link>
                        </Button>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
