import { getTranslations } from "next-intl/server";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { catalogSortOptions, type CatalogSort } from "@/lib/shop";

type CatalogToolbarProps = {
  defaultQuery: string;
  defaultSort: CatalogSort;
};

export async function CatalogToolbar({
  defaultQuery,
  defaultSort
}: CatalogToolbarProps) {
  const [t, tSort] = await Promise.all([
    getTranslations("CatalogToolbar"),
    getTranslations("CatalogSort")
  ]);

  return (
    <form className="grid gap-3 rounded-[1.3rem] border border-border/75 bg-card/85 p-4 shadow-editorial md:grid-cols-[1fr_auto_auto]">
      <div className="relative">
        <label htmlFor="catalog-search" className="sr-only">
          {t("searchLabel")}
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="catalog-search"
          name="q"
          defaultValue={defaultQuery}
          placeholder={t("searchPlaceholder")}
          className="pl-10"
        />
      </div>

      <div>
        <label htmlFor="catalog-sort" className="sr-only">
          {t("sortLabel")}
        </label>
        <Select
          id="catalog-sort"
          name="sort"
          defaultValue={defaultSort}
          className="min-w-44"
        >
          {catalogSortOptions.map((option) => (
            <option key={option} value={option}>
              {tSort(option)}
            </option>
          ))}
        </Select>
      </div>

      <Button type="submit" className="w-full md:w-auto">
        {t("applyFilters")}
      </Button>
    </form>
  );
}
