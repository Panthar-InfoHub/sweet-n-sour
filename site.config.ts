export const siteConfig = {
  // Basic Site Information
  title: "Sweet and Sour",
  name: "Sweet and Sour",
  description:
    "Crafting authentic, handmade pickles with traditional recipes passed down through generations.",
  domain: "https://sweetnsour.in",
  // Logo
  logo: {
    path: "/placeholder-logo.svg",
    alt: "Sweet and Sour Logo",
  },

  // Contact Information
  contact: {
    email: "hello@sweetnsour.in",
    phone: "+91 8299319032",
    whatsapp: "+918299319032", // Format: country code + number (no spaces or special characters)
    address: "Rise incubation, Nagar nigam premises elite square, civil lines, jhansi(up) 284001",
  },

  // Social Media Links
  social: {
    instagram: "https://www.instagram.com/sweetandsour.co7",
    youtube: "https://www.youtube.com/@pranviiarora",
    // facebook: "https://facebook.com/sweetandsour",
    // twitter: "https://twitter.com/sweetandsour",
    // linkedin: "https://linkedin.com/company/sweetandsour",
  },

  // Admin Panel
  admin: {
    title: "Sweet and Sour",
    subtitle: "Admin Panel",
  },
} as const;

export type SiteConfig = typeof siteConfig;
