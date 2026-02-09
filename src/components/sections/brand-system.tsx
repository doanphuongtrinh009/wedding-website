import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  brandPalette,
  spacingScale,
  typographyScale
} from "@/config/design-system";

export function BrandSystem() {
  return (
    <section className="section-shell pt-0">
      <div className="mb-space-lg max-w-2xl space-y-4">
        <p className="editorial-kicker">UI System</p>
        <h2>Minimal luxury direction with editorial rhythm.</h2>
        <p className="text-muted-foreground">
          Tokens are designed for soft feminine contrast: warm neutrals, couture
          typography hierarchy, and deliberate vertical spacing.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card variant="editorial" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Color palette</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {brandPalette.map((color) => (
                <div
                  key={color.name}
                  className="space-y-2 rounded-xl border border-border/70 p-3"
                >
                  <div
                    className={`h-16 rounded-lg border border-border/40 ${color.swatchClass}`}
                  />
                  <p className="font-medium">{color.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {color.token}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="editorial">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="editorial-kicker">Display</p>
              <p className="font-display text-4xl leading-tight">
                Editorial headline
              </p>
            </div>
            <div>
              <p className="editorial-kicker">Body</p>
              <p className="text-body text-muted-foreground">
                Elegant utility copy for booking and shopping interactions.
              </p>
            </div>
            <div>
              <p className="editorial-kicker">Overline</p>
              <p className="text-overline text-muted-foreground">
                Context labels and section metadata.
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/65 p-3 text-xs text-muted-foreground">
              {typographyScale.map((item) => (
                <p key={item.token} className="pb-1 last:pb-0">
                  <span className="font-semibold text-foreground">
                    {item.label}:
                  </span>{" "}
                  {item.token}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card variant="editorial" className="mt-6">
        <CardHeader>
          <CardTitle>Spacing scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {spacingScale.map((item) => (
              <div
                key={item.token}
                className="rounded-xl border border-border/70 bg-background/65 p-3"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="font-medium">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.token}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
