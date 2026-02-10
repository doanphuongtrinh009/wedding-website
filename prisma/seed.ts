import { OrderStatus, PaymentStatus, PrismaClient, ProductStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const seedProducts = [
  // A-Line (Dáng Chữ A)
  {
    slug: "aurora-silk-a-line",
    name: "Aurora Lụa Mikado",
    description: "Váy cưới dáng chữ A từ chất liệu lụa Mikado cao cấp, điểm nhấn là đường xếp nếp tinh tế ở eo và hàng cúc bọc thủ công dọc sống lưng. Đuôi váy dài thướt tha mang lại vẻ đẹp hoàng gia.",
    priceInCents: 28500000, // 28.500.000 VND
    currency: "VND",
    isFeatured: true,
    images: [
      { cloudinaryPublicId: "bridal/aurora-1", secureUrl: "/images/products/aurora-1.png", altText: "Toàn cảnh Aurora Lụa Mikado", position: 0 },
      { cloudinaryPublicId: "bridal/aurora-1-detail-bodice", secureUrl: "/images/products/details/aurora-1-detail-bodice.png", altText: "Chi tiết thân váy Aurora Lụa Mikado", position: 1 },
      { cloudinaryPublicId: "bridal/aurora-1-detail-skirt", secureUrl: "/images/products/details/aurora-1-detail-skirt.png", altText: "Chi tiết chân váy Aurora Lụa Mikado", position: 2 }
    ]
  },
  {
    slug: "luna-chiffon-a-line",
    name: "Luna Chiffon Bay Bổng",
    description: "Thiết kế chữ A nhẹ nhàng với chất liệu Chiffon mềm mại, cổ V xẻ sâu và tay cánh tiên. Hoàn hảo cho tiệc cưới ngoài trời hoặc bãi biển.",
    priceInCents: 21000000,
    currency: "VND",
    isFeatured: false,
    images: [
      { cloudinaryPublicId: "bridal/luna-1", secureUrl: "/images/products/slip-1.png", altText: "Toàn cảnh Luna Chiffon Bay Bổng", position: 0 },
      { cloudinaryPublicId: "bridal/luna-1-detail-bodice", secureUrl: "/images/products/details/slip-1-detail-bodice.png", altText: "Chi tiết thân váy Luna Chiffon", position: 1 },
      { cloudinaryPublicId: "bridal/luna-1-detail-drape", secureUrl: "/images/products/details/slip-1-detail-drape.png", altText: "Chi tiết nếp rủ Luna Chiffon", position: 2 }
    ]
  },
  {
    slug: "flora-applique-a-line",
    name: "Flora Đính Kết 3D",
    description: "Váy chữ A lãng mạn với lớp vải tulle bồng bềnh, được trang trí bằng hoa 3D và hạt pha lê thủ công. Phần corset định hình giúp tôn dáng hoàn hảo.",
    priceInCents: 32000000,
    currency: "VND",
    isFeatured: false,
    images: [
      { cloudinaryPublicId: "bridal/flora-1", secureUrl: "/images/products/aurora-1.png", altText: "Toàn cảnh Flora Đính Kết 3D", position: 0 },
      { cloudinaryPublicId: "bridal/flora-1-lace-detail", secureUrl: "/images/categories/lace-detail.png", altText: "Chi tiết ren và đính kết của Flora", position: 1 },
      { cloudinaryPublicId: "bridal/flora-1-detail-skirt", secureUrl: "/images/products/details/aurora-1-detail-skirt.png", altText: "Chi tiết chân váy tulle của Flora", position: 2 }
    ]
  },

  // Mermaid / Fitted (Dáng Đuôi Cá)
  {
    slug: "celeste-crepe-column",
    name: "Celeste Đuôi Cá Tối Giản",
    description: "Dáng váy đuôi cá hiện đại trên nền vải Crepe lì sang trọng. Thiết kế tối giản với đường cắt cúp sắc sảo và lưng trần quyến rũ đính ngọc trai.",
    priceInCents: 31200000,
    currency: "VND",
    isFeatured: true,
    images: [
      { cloudinaryPublicId: "bridal/celeste-1", secureUrl: "/images/products/mermaid-1.png", altText: "Toàn cảnh Celeste Đuôi Cá Tối Giản", position: 0 },
      { cloudinaryPublicId: "bridal/celeste-1-detail-bodice", secureUrl: "/images/products/details/mermaid-1-detail-bodice.png", altText: "Chi tiết thân váy Celeste", position: 1 },
      { cloudinaryPublicId: "bridal/celeste-1-detail-drape", secureUrl: "/images/products/details/mermaid-1-detail-drape.png", altText: "Chi tiết nếp rủ Celeste", position: 2 }
    ]
  },
  {
    slug: "nova-satin-mermaid",
    name: "Nova Satin Quý Phái",
    description: "Váy đuôi cá Satin bóng mượt với phần cúp ngực dựng form cầu kỳ và chân váy xòe rộng đầy kịch tính. Vẻ đẹp sang trọng vượt thời gian.",
    priceInCents: 29500000,
    currency: "VND",
    isFeatured: true,
    images: [
      { cloudinaryPublicId: "bridal/nova-1", secureUrl: "/images/products/mermaid-1.png", altText: "Toàn cảnh Nova Satin Quý Phái", position: 0 },
      { cloudinaryPublicId: "bridal/nova-1-detail-bodice", secureUrl: "/images/products/details/mermaid-1-detail-bodice.png", altText: "Chi tiết thân váy Nova Satin", position: 1 },
      { cloudinaryPublicId: "bridal/nova-1-detail-drape", secureUrl: "/images/products/details/mermaid-1-detail-drape.png", altText: "Chi tiết đuôi váy Nova Satin", position: 2 }
    ]
  },
  {
    slug: "aria-lace-fit-flare",
    name: "Aria Ren Chantilly",
    description: "Thiết kế ôm sát và xòe nhẹ (Fit-and-Flare) phủ ren Chantilly toàn bộ. Viền váy lượn sóng tinh tế cùng lưng ảo ảnh (illusion back) gợi cảm.",
    priceInCents: 35000000,
    currency: "VND",
    isFeatured: false,
    images: [
      { cloudinaryPublicId: "bridal/aria-1", secureUrl: "/images/products/mermaid-1.png", altText: "Toàn cảnh Aria Ren Chantilly", position: 0 },
      { cloudinaryPublicId: "bridal/aria-1-lace-detail", secureUrl: "/images/categories/lace-detail.png", altText: "Chi tiết ren Chantilly của Aria", position: 1 },
      { cloudinaryPublicId: "bridal/aria-1-detail-bodice", secureUrl: "/images/products/details/mermaid-1-detail-bodice.png", altText: "Chi tiết thân váy Aria", position: 2 }
    ]
  },

  // Ballgown (Dáng Bồng Xòe)
  {
    slug: "juliet-tulle-ballgown",
    name: "Juliet Công Chúa Tulle",
    description: "Váy bồng xòe lộng lẫy với nhiều lớp vải Tulle mềm mại, cúp ngực tim ngọt ngào và đai eo đính đá pha lê. Giấc mơ cổ tích thành hiện thực.",
    priceInCents: 38000000,
    currency: "VND",
    isFeatured: true,
    images: [
      { cloudinaryPublicId: "bridal/juliet-1", secureUrl: "/images/products/ballgown-1.png", altText: "Toàn cảnh Juliet Công Chúa Tulle", position: 0 },
      { cloudinaryPublicId: "bridal/juliet-1-detail-bodice", secureUrl: "/images/products/details/ballgown-1-detail-bodice.png", altText: "Chi tiết thân váy Juliet", position: 1 },
      { cloudinaryPublicId: "bridal/juliet-1-detail-volume", secureUrl: "/images/products/details/ballgown-1-detail-volume.png", altText: "Chi tiết độ bồng của Juliet", position: 2 }
    ]
  },
  {
    slug: "ophelia-embroidered-gown",
    name: "Ophelia Thêu Hoàng Gia",
    description: "Váy bồng xòe với họa tiết thêu dây leo tỉ mỉ trên nền vải tuyn. Cổ ảo ảnh và tay dài mang lại vẻ đẹp kín đáo nhưng không kém phần quyến rũ.",
    priceInCents: 45000000,
    currency: "VND",
    isFeatured: false,
    images: [
      { cloudinaryPublicId: "bridal/ophelia-1", secureUrl: "/images/products/ballgown-1.png", altText: "Toàn cảnh Ophelia Thêu Hoàng Gia", position: 0 },
      { cloudinaryPublicId: "bridal/ophelia-1-lace-detail", secureUrl: "/images/categories/lace-detail.png", altText: "Chi tiết thêu và ren của Ophelia", position: 1 },
      { cloudinaryPublicId: "bridal/ophelia-1-detail-volume", secureUrl: "/images/products/details/ballgown-1-detail-volume.png", altText: "Chi tiết chân váy Ophelia", position: 2 }
    ]
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
        currency: product.currency,
        status: ProductStatus.ACTIVE,
        isFeatured: product.isFeatured
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        priceInCents: product.priceInCents,
        currency: product.currency,
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

  // Create Users
  const [customerOne, customerTwo] = await Promise.all([
    prisma.userProfile.upsert({
      where: { email: "chi.nguyen@example.com" },
      update: {
        firstName: "Chi",
        lastName: "Nguyen",
        phone: "0901234567",
        role: UserRole.CUSTOMER
      },
      create: {
        clerkUserId: "local_seed_chi",
        email: "chi.nguyen@example.com",
        firstName: "Chi",
        lastName: "Nguyen",
        phone: "0901234567",
        role: UserRole.CUSTOMER
      }
    }),
    prisma.userProfile.upsert({
      where: { email: "linh.tran@example.com" },
      update: {
        firstName: "Linh",
        lastName: "Tran",
        phone: "0912345678",
        role: UserRole.CUSTOMER
      },
      create: {
        clerkUserId: "local_seed_linh",
        email: "linh.tran@example.com",
        firstName: "Linh",
        lastName: "Tran",
        phone: "0912345678",
        role: UserRole.CUSTOMER
      }
    })
  ]);

  // Create Orders
  // ... (Keeping simplified or skipping order logic adjustment for brevity if not strictly needed, 
  // but let's update basic order currency/products to match)

  // Note: Skipping complex order seeding update to focus on Product Catalog content. 
  // Existing orders might look weird with mismatched products, but they are just for seed.
  // I will re-use upsertedProducts for orders.

  const orderSeeds = [
    {
      orderNumber: "ORD-VN-001",
      customerId: customerOne.id,
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PARTIALLY_PAID,
      items: [
        {
          productId: upsertedProducts[0]?.id,
          productName: upsertedProducts[0]?.name ?? "Aurora Lụa Mikado",
          unitPriceInCents: upsertedProducts[0]?.priceInCents ?? 28500000,
          quantity: 1
        }
      ],
      taxInCents: 2850000, // 10% VAT
      notes: "Đã cọc 50%. Hẹn lịch thử váy lại vào tuần sau."
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
        currency: "VND",
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
        currency: "VND",
        notes: order.notes
      }
    });

    // Simple re-create items
    await prisma.orderItem.deleteMany({ where: { orderId: upsertedOrder.id } });
    await prisma.orderItem.createMany({
      data: order.items.map((item) => ({
        orderId: upsertedOrder.id,
        productId: item.productId,
        productName: item.productName,
        unitPriceInCents: item.unitPriceInCents,
        quantity: item.quantity
      }))
    });
  }

  console.info(`Seeded orders.`);

  if (!adminEmail || !adminClerkUserId) {
    console.info("Skipping admin seed.");
    return;
  }

  await prisma.userProfile.upsert({
    where: { clerkUserId: adminClerkUserId },
    update: { email: adminEmail, role: UserRole.ADMIN },
    create: { clerkUserId: adminClerkUserId, email: adminEmail, role: UserRole.ADMIN }
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
