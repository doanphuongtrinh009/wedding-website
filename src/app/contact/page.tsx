export default function ContactPage() {
  return (
    <section className="container py-16 md:py-24">
      <h1 className="text-4xl leading-tight">Contact Maison Etoile</h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">
        For appointments, order support, or styling questions, contact our team
        at
        <a
          href="mailto:concierge@maisonetoile.com"
          className="ml-1 underline-offset-4 hover:underline"
        >
          concierge@maisonetoile.com
        </a>
        .
      </p>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        Showroom hours: Tuesday to Sunday, 10:00 AM to 6:00 PM.
      </p>
    </section>
  );
}
