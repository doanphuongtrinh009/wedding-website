"use client";

import { useAuth } from "@clerk/nextjs";
import { Camera, ChevronDown, LayoutGrid, Menu, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
    { key: "collections", href: "/collections" },
    { key: "bookTryOn", href: "/book" },
    { key: "wishlist", href: "/wishlist" },
    { key: "account", href: "/account" }
] as const;

const serviceItems = [
    {
        key: "servicesOverview",
        hintKey: "servicesOverviewHint",
        href: "/services",
        icon: LayoutGrid
    },
    {
        key: "makeupService",
        hintKey: "makeupServiceHint",
        href: "/services/makeup",
        icon: Sparkles
    },
    {
        key: "photoService",
        hintKey: "photoServiceHint",
        href: "/services/photo",
        icon: Camera
    }
] as const;

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { isSignedIn } = useAuth();
    const t = useTranslations("Nav");
    const isServicesRoute = useMemo(
        () => pathname === "/services" || pathname.startsWith("/services/"),
        [pathname]
    );
    const [serviceGroupOpen, setServiceGroupOpen] = useState(isServicesRoute);

    useEffect(() => {
        if (isServicesRoute) {
            setServiceGroupOpen(true);
        }
    }, [isServicesRoute]);

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
                    <Link
                        href="/collections"
                        onClick={() => setOpen(false)}
                        className={cn(
                            "text-lg font-medium transition-colors hover:text-primary",
                            pathname === "/collections"
                                ? "text-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                        {t("collections")}
                    </Link>

                    <div className="rounded-xl border border-border/70 bg-background/75 p-3">
                        <button
                            type="button"
                            onClick={() => setServiceGroupOpen((current) => !current)}
                            className={cn(
                                "flex w-full items-center justify-between text-left text-lg font-medium transition-colors hover:text-primary",
                                isServicesRoute
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <span>{t("services")}</span>
                            <ChevronDown
                                className={cn(
                                    "size-4 transition-transform",
                                    serviceGroupOpen ? "rotate-180" : "rotate-0"
                                )}
                            />
                        </button>

                        {serviceGroupOpen ? (
                            <div className="mt-3 border-l border-border/70 pl-3">
                                <div className="space-y-2">
                                    {serviceItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "flex items-start gap-2 rounded-lg px-2 py-2 text-sm transition",
                                                pathname === item.href
                                                    ? "bg-secondary/55 text-foreground"
                                                    : "text-muted-foreground hover:bg-secondary/45 hover:text-foreground"
                                            )}
                                        >
                                            <item.icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                                            <div className="min-w-0">
                                                <p className="font-medium text-foreground">{t(item.key)}</p>
                                                <p className="text-xs text-muted-foreground">{t(item.hintKey)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {navItems.slice(1).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "text-lg font-medium transition-colors hover:text-primary",
                                pathname === item.href
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {t(item.key)}
                        </Link>
                    ))}

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
