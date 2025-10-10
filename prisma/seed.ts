import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create Categories
  console.log("Creating categories...");
  const picklesCategory = await prisma.category.create({
    data: {
      name: "Pickles",
      slug: "pickles",
      description: "Traditional homemade pickles",
      image: "/pickle-jar.jpg",
      order: 1,
      isActive: true,
    },
  });

  const chiliCategory = await prisma.category.create({
    data: {
      name: "Red Chilli",
      slug: "red-chilli",
      description: "Spicy red chilli products",
      image: "/red-chilli.jpg",
      order: 2,
      isActive: true,
    },
  });

  const mangoCategory = await prisma.category.create({
    data: {
      name: "Mango",
      slug: "mango",
      description: "Delicious mango products",
      image: "/ripe-mango.png",
      order: 3,
      isActive: true,
    },
  });

  console.log("✅ Categories created");

  // Create Products
  console.log("Creating products...");
  await prisma.product.create({
    data: {
      name: "Traditional Mango Pickle",
      slug: "traditional-mango-pickle",
      description: "Authentic homemade mango pickle made with love and traditional spices",
      images: ["/mango-pickle.jpg", "/mango-pickle-jar.png"],
      categoryId: picklesCategory.id,
      variants: [
        { weight: "250g", price: 7.99, compareAtPrice: 9.99, stockQuantity: 50, inStock: true },
        { weight: "500g", price: 14.99, compareAtPrice: 17.99, stockQuantity: 30, inStock: true },
        { weight: "1kg", price: 27.99, compareAtPrice: 32.99, stockQuantity: 20, inStock: true },
      ],
      isFeatured: true,
      isBestSeller: true,
      isOnSale: true,
      tags: ["spicy", "traditional", "homemade"],
    },
  });

  await prisma.product.create({
    data: {
      name: "Mixed Vegetable Pickle",
      slug: "mixed-vegetable-pickle",
      description: "A delightful mix of seasonal vegetables pickled to perfection",
      images: ["/mixed-pickle.jpg"],
      categoryId: picklesCategory.id,
      variants: [
        { weight: "250g", price: 6.99, compareAtPrice: 8.99, stockQuantity: 40, inStock: true },
        { weight: "500g", price: 12.99, compareAtPrice: 15.99, stockQuantity: 35, inStock: true },
      ],
      isFeatured: false,
      isBestSeller: true,
      isOnSale: false,
      tags: ["healthy", "mixed", "vegetables"],
    },
  });

  await prisma.product.create({
    data: {
      name: "Garlic Pickle",
      slug: "garlic-pickle",
      description: "Tangy garlic pickle with aromatic spices",
      images: ["/garlic-pickle.jpg"],
      categoryId: picklesCategory.id,
      variants: [
        { weight: "250g", price: 7.99, compareAtPrice: null, stockQuantity: 25, inStock: true },
        { weight: "500g", price: 14.99, compareAtPrice: null, stockQuantity: 25, inStock: true },
      ],
      isFeatured: false,
      isBestSeller: false,
      isOnSale: false,
      tags: ["garlic", "tangy"],
    },
  });

  await prisma.product.create({
    data: {
      name: "Green Chilli Pickle",
      slug: "green-chilli-pickle",
      description: "Fiery green chilli pickle for spice lovers",
      images: ["/green-chilli.jpg"],
      categoryId: chiliCategory.id,
      variants: [
        { weight: "200g", price: 5.99, compareAtPrice: 7.99, stockQuantity: 30, inStock: true },
        { weight: "400g", price: 10.99, compareAtPrice: 13.99, stockQuantity: 30, inStock: true },
      ],
      isFeatured: true,
      isBestSeller: false,
      isOnSale: true,
      tags: ["spicy", "hot", "chilli"],
    },
  });

  await prisma.product.create({
    data: {
      name: "Red Chilli Powder",
      slug: "red-chilli-powder",
      description: "Premium quality red chilli powder",
      images: ["/red-chilli.jpg"],
      categoryId: chiliCategory.id,
      variants: [
        { weight: "100g", price: 3.99, compareAtPrice: null, stockQuantity: 50, inStock: true },
        { weight: "250g", price: 8.99, compareAtPrice: null, stockQuantity: 40, inStock: true },
        { weight: "500g", price: 16.99, compareAtPrice: null, stockQuantity: 30, inStock: true },
      ],
      isFeatured: false,
      isBestSeller: true,
      isOnSale: false,
      tags: ["spice", "powder"],
    },
  });

  console.log("✅ Products created");

  // Create CMS Pages
  console.log("Creating CMS pages...");
  await prisma.cMSPage.createMany({
    data: [
      {
        slug: "about-us",
        title: "About Us",
        content:
          "We are a family-owned business dedicated to bringing authentic homemade pickles to your table...",
        metaTitle: "About Us | Sweet and Sour",
        metaDescription: "Learn about our story and commitment to quality",
        isPublished: true,
      },
      {
        slug: "shipping-policy",
        title: "Shipping Policy",
        content: "We ship nationwide with care to ensure your products arrive fresh...",
        metaTitle: "Shipping Policy | Sweet and Sour",
        metaDescription: "Learn about our shipping methods and delivery times",
        isPublished: true,
      },
      {
        slug: "return-policy",
        title: "Return & Refund Policy",
        content: "Customer satisfaction is our priority. If you're not satisfied...",
        metaTitle: "Return Policy | Sweet and Sour",
        metaDescription: "Our return and refund policy details",
        isPublished: true,
      },
    ],
  });

  console.log("✅ CMS pages created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
