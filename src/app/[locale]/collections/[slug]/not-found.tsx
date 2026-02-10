import { Link } from "@/i18n/routing";

import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <section className="section-shell text-center">
      <p className="editorial-kicker">Product</p>
      <h1>Gown not found</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        This product may have been archived or renamed. Browse available
        collections for current inventory.
      </p>
      <Button asChild className="mt-6">
        <Link href="/collections">Back to catalog</Link>
      </Button>
    </section>
  );
}
