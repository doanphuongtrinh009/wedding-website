export default function ProductLoading() {
  return (
    <section className="section-shell">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="skeleton-luxe aspect-4/5 rounded-2xl border border-border/60" />
        <div className="space-y-4">
          <div className="skeleton-luxe h-3 w-28 rounded" />
          <div className="skeleton-luxe h-16 w-full rounded" />
          <div className="skeleton-luxe h-12 w-36 rounded" />
          <div className="skeleton-luxe h-32 w-full rounded" />
        </div>
      </div>
    </section>
  );
}
