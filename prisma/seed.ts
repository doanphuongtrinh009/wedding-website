import { OrderStatus, PaymentStatus, PrismaClient, ProductStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const seedProducts = [
  // A-Line
  {
    slug: "aurora-silk-a-line",
    name: "Aurora Silk A-Line",
    description: "A silk mikado A-line gown with sculpted waist draping, hand-covered buttons, and a cathedral-length train.",
    priceInCents: 285000,
    isFeatured: true,
    images: [{ cloudinaryPublicId: "bridal/aurora-1", secureUrl: "/images/products/aurora-1.png", altText: "Aurora silk A-line bridal gown", position: 0 }]
  },
  {
    slug: "luna-chiffon-a-line",
    name: "Luna Chiffon A-Line",
    description: "Soft chiffon A-line with a deep V-neckline and flutter sleeves. Perfect for a garden or beach ceremony.",
    priceInCents: 210000,
    isFeatured: false,
    images: [{ cloudinaryPublicId: "bridal/aurora-1", secureUrl: "/images/products/aurora-1.png", altText: "Luna chiffon A-line gown", position: 0 }]
  },
  {
    slug: "flora-applique-a-line",
    name: "Flora Applique A-Line",
    description: "Romantic tulle A-line gown adorned with 3D floral appliqués and beads. Features a corset bodice.",
    priceInCents: 320000,
    isFeatured: false,
    images: [{ cloudinaryPublicId: "bridal/aurora-1", secureUrl: "/images/products/aurora-1.png", altText: "Flora applique A-line gown", position: 0 }]
  },

  // Mermaid / Fitted
  {
    slug: "celeste-crepe-column",
    name: "Celeste Crepe Column",
    description: "Minimalist crepe column silhouette with precise corsetry lines and pearl-finished back detailing.",
    priceInCents: 312000,
    isFeatured: true,
    images: [{ cloudinaryPublicId: "bridal/celeste-1", secureUrl: "/images/products/mermaid-1.png", altText: "Celeste crepe column gown", position: 0 }]
  },
  {
    slug: "nova-satin-mermaid",
    name: "Nova Satin Mermaid",
    description: "Sleek satin mermaid gown with a structured bodice and a dramatic flared skirt. Modern and sophisticated.",
    priceInCents: 295000,
    isFeatured: true,
    images: [{ cloudinaryPublicId: "bridal/mermaid-1", secureUrl: "/images/products/mermaid-1.png", altText: "Nova satin mermaid gown", position: 0 }]
  },
  {
    slug: "aria-lace-fit-flare",
    name: "Aria Lace Fit-and-Flare",
    description: "All-over Chantilly lace fit-and-flare gown with a scalloped hem and illusion back.",
    priceInCents: 350000,
    isFeatured: false,
    images: [{ cloudinaryPublicId: "bridal/mermaid-1", secureUrl: "/images/products/mermaid-1.png", altText: "Aria lace fit-and-flare gown", position: 0 }]
  },

  // Slip / Minimal
  {
    slug: "seraphina-satin-wrap",
    name: "Seraphina Satin Wrap",
    description: "Lustrous satin fit-and-flare gown with wrapped neckline and tailored contour seams for a modern romantic profile.",
    priceInCents: 348000,
    isFeatured: false,
    images: [{ cloudinaryPublicId: "bridal/slip-1", secureUrl: "/images/products/slip-1.png", altText: "Seraphina satin wrap gown", position: 0 }]
  },
  {
    slug: "camila-cowl-slip",
    name: "Camila Cowl Slip",
    description: "Effortless silk charmeuse slip dress with a cowl neckline and low back. Ideal for reception or minimalist brides.",
    priceInCents: 185000,
    isFeatured: false,
    images: [{ cloudinaryPublicId: "bridal/slip-1", secureUrl: "/images/products/slip-1.png", altText: "Camila cowl neck slip dress", position: 0 }]
  },
  {
    slug: "iris-crepe-sheath",
    name: "Iris Crepe Sheath",
    description: "Matte crepe sheath gown with a high boat neck and long sleeves. Clean lines and understated elegance.",
    priceInCents: 240000,
    isFeatured: false,
    images: [{ cloudinaryPublicId: "bridal/slip-1", secureUrl: "/images/products/slip-1.png", altText: "Iris crepe sheath gown", position: 0 }]
  },

  // Corset / Romantic
  {
    slug: "elysian-lace-corset",
    name: "Elysian Lace Corset",
    description: "French lace corset bodice layered with soft tulle volume and detachable lace sleeves for ceremony-to-reception styling.",
    priceInCents: 425000,
    isFeatured: true,
    images: [{ cloudinaryPublicId: "bridal/elysian-1", secureUrl: "/images/products/aurora-1.png", altText: "Elysian lace corset gown", position: 0 }]
  },
  {
    slug: "juliet-tulle-ballgown",
    name: "Juliet Tulle Ballgown",
    description: "Voluminous tulle ballgown with a sweetheart neckline and delicate beaded belt. A fairytale classic.",
    priceInCents: 380000,
    isFeatured: false,
    images: [{ cloudinaryPublicId: "bridal/aurora-1", secureUrl: "/images/products/aurora-1.png", altText: "Juliet tulle ballgown", position: 0 }]
  },
  {
    slug: "ophelia-embroidered-gown",
    name: "Ophelia Embroidered Gown",
    description: "Intricately embroidered tulle gown with vine motifs. Features an illusion neckline and soft A-line skirt.",
    priceInCents: 450000,
    isFeatured: false,
    images: [{ cloudinaryPublicId: "bridal/aurora-1", secureUrl: "/images/products/aurora-1.png", altText: "Ophelia embroidered gown", position: 0 }]
  }
] as const;

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminClerkUserId = process.env.SEED_ADMIN_CLERK_USER_ID;
  const upsertedProducts: Array<{ id: string; name: string; priceInCents: number }> = [];

  for (const product of seedProducts) {
    const upserted = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        priceInCents: product.priceInCents,
        status: ProductStatus.ACTIVE,
        isFeatured: product.isFeatured
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        priceInCents: product.priceInCents,
        status: ProductStatus.ACTIVE,
        isFeatured: product.isFeatured
      }
    });

    await prisma.productImage.deleteMany({
      where: { productId: upserted.id }
    });

    await prisma.productImage.createMany({
      data: product.images.map((image) => ({
        productId: upserted.id,
        cloudinaryPublicId: image.cloudinaryPublicId,
        secureUrl: image.secureUrl,
        altText: image.altText,
        position: image.position
      }))
    });

    upsertedProducts.push({
      id: upserted.id,
      name: upserted.name,
      priceInCents: upserted.priceInCents
    });
  }

  console.info(`Seeded ${seedProducts.length} products.`);

  const [customerOne, customerTwo] = await Promise.all([
    prisma.userProfile.upsert({
      where: { email: "anna@example.com" },
      update: {
        firstName: "Anna",
        lastName: "Sullivan",
        phone: "+1-555-100-1010",
        role: UserRole.CUSTOMER
      },
      create: {
        clerkUserId: "local_seed_anna",
        email: "anna@example.com",
        firstName: "Anna",
        lastName: "Sullivan",
        phone: "+1-555-100-1010",
        role: UserRole.CUSTOMER
      }
    }),
    prisma.userProfile.upsert({
      where: { email: "mia@example.com" },
      update: {
        firstName: "Mia",
        lastName: "Tran",
        phone: "+1-555-100-2020",
        role: UserRole.CUSTOMER
      },
      create: {
        clerkUserId: "local_seed_mia",
        email: "mia@example.com",
        firstName: "Mia",
        lastName: "Tran",
        phone: "+1-555-100-2020",
        role: UserRole.CUSTOMER
      }
    })
  ]);

  const orderSeeds = [
    {
      orderNumber: "ORD-SEED-001",
      customerId: customerOne.id,
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PARTIALLY_PAID,
      items: [
        {
          productId: upsertedProducts[0]?.id,
          productName: upsertedProducts[0]?.name ?? "Aurora Silk A-Line",
          unitPriceInCents: upsertedProducts[0]?.priceInCents ?? 285000,
          quantity: 1
        }
      ],
      taxInCents: 17100,
      notes: "Deposit paid. Alteration fitting to be scheduled."
    },
    {
      orderNumber: "ORD-SEED-002",
      customerId: customerTwo.id,
      status: OrderStatus.PAID,
      paymentStatus: PaymentStatus.PAID,
      items: [
        {
          productId: upsertedProducts[1]?.id,
          productName: upsertedProducts[1]?.name ?? "Celeste Crepe Column",
          unitPriceInCents: upsertedProducts[1]?.priceInCents ?? 312000,
          quantity: 1
        },
        {
          productId: null,
          productName: "Veil Styling Package",
          unitPriceInCents: 18000,
          quantity: 1
        }
      ],
      taxInCents: 19800,
      notes: "Ready for pickup confirmation."
    }
  ] as const;

  for (const order of orderSeeds) {
    const subtotalInCents = order.items.reduce((total, item) => total + item.unitPriceInCents * item.quantity, 0);
    const totalInCents = subtotalInCents + order.taxInCents;

    const upsertedOrder = await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: {
        customerId: order.customerId,
        status: order.status,
        paymentStatus: order.paymentStatus,
        subtotalInCents,
        taxInCents: order.taxInCents,
        totalInCents,
        notes: order.notes
      },
      create: {
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        status: order.status,
        paymentStatus: order.paymentStatus,
        subtotalInCents,
        taxInCents: order.taxInCents,
        totalInCents,
        notes: order.notes
      }
    });

    await prisma.orderItem.deleteMany({
      where: { orderId: upsertedOrder.id }
    });

    await prisma.orderItem.createMany({
      data: order.items.map((item) => ({
        orderId: upsertedOrder.id,
        productId: item.productId ?? undefined,
        productName: item.productName,
        unitPriceInCents: item.unitPriceInCents,
        quantity: item.quantity
      }))
    });
  }

  console.info(`Seeded ${orderSeeds.length} orders.`);

  if (!adminEmail || !adminClerkUserId) {
    console.info("Skipping admin seed. Set SEED_ADMIN_EMAIL and SEED_ADMIN_CLERK_USER_ID to seed an admin user.");
    return;
  }

  await prisma.userProfile.upsert({
    where: { clerkUserId: adminClerkUserId },
    update: {
      email: adminEmail,
      role: UserRole.ADMIN
    },
    create: {
      clerkUserId: adminClerkUserId,
      email: adminEmail,
      role: UserRole.ADMIN
    }
  });

  console.info(`Admin user seeded: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
