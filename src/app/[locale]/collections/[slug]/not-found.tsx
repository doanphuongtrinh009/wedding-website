import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

export default async function ProductNotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="section-shell text-center">
      <p className="editorial-kicker">{t("kicker")}</p>
      <h1>{t("heading")}</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        {t("description")}
      </p>
      <Button asChild className="mt-6">
        <Link href="/collections">{t("backToCatalog")}</Link>
      </Button>
    </section>
  );
}
