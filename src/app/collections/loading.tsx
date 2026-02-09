export default function CollectionsLoading() {
  return (
    <section className="section-shell">
      <div className="mb-space-lg space-y-3">
        <div className="skeleton-luxe h-3 w-28 rounded" />
        <div className="skeleton-luxe h-12 w-72 rounded" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="skeleton-luxe h-[430px] rounded-2xl border border-border/60"
          />
        ))}
      </div>
    </section>
  );
}
