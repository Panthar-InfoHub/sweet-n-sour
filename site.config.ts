export const siteConfig = {
  // Basic Site Information
  title: "Sweet and Sour",
  name: "Sweet and Sour",
  description:
    "Crafting authentic, handmade pickles with traditional recipes passed down through generations.",
  domain: "https://sweetandsour.com",
  // Logo
  logo: {
    path: "/placeholder-logo.svg",
    alt: "Sweet and Sour Logo",
  },

  // Contact Information
  contact: {
    email: "hello@sweetandsour.com",
    phone: "+91 98765 43210",
    whatsapp: "919876543210", // Format: country code + number (no spaces or special characters)
    address: "123 Pickle Street, Food District, Mumbai 400001",
  },

  // Social Media Links
  social: {
    facebook: "https://facebook.com/sweetandsour",
    instagram: "https://instagram.com/sweetandsour",
    twitter: "https://twitter.com/sweetandsour",
    youtube: "https://youtube.com/@sweetandsour",
    linkedin: "https://linkedin.com/company/sweetandsour",
  },

  // Admin Panel
  admin: {
    title: "Sweet and Sour",
    subtitle: "Admin Panel",
  },
} as const;

export type SiteConfig = typeof siteConfig;
