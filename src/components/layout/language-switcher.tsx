"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function onSelectChange(nextLocale: string) {
        router.replace(pathname, { locale: nextLocale });
        setIsOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full border border-transparent p-0 hover:border-border/50"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Switch language"
            >
                <span className="text-xl leading-none">
                    {locale === "vi" ? "🇻🇳" : "🇺🇸"}
                </span>
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                    <button
                        onClick={() => onSelectChange("vi")}
                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                        <span className="text-lg leading-none">🇻🇳</span>
                        <span className="text-xs font-medium uppercase tracking-wider">
                            Tiếng Việt
                        </span>
                    </button>
                    <button
                        onClick={() => onSelectChange("en")}
                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                        <span className="text-lg leading-none">🇺🇸</span>
                        <span className="text-xs font-medium uppercase tracking-wider">
                            English
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
