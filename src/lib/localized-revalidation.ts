import { revalidatePath } from "next/cache";

import {
  getAllLocalizedPaths,
  type LocalizedHref
} from "@/lib/localized-paths";

export function revalidateLocalizedPath(href: LocalizedHref) {
  for (const pathname of getAllLocalizedPaths(href)) {
    revalidatePath(pathname);
  }
}

export function revalidateLocalizedPaths(hrefs: LocalizedHref[]) {
  const pathnames = new Set<string>();

  for (const href of hrefs) {
    for (const pathname of getAllLocalizedPaths(href)) {
      pathnames.add(pathname);
    }
  }

  for (const pathname of pathnames) {
    revalidatePath(pathname);
  }
}
