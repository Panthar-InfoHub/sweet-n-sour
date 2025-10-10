"use server";

import { CMSPageFormData, cmsPageSchema } from "@/lib/zod-schema";
import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation Schema

// Get all CMS pages
export async function getCMSPages(filters?: { isPublished?: boolean; search?: string }) {
  try {
    const where: any = {};

    if (filters?.isPublished !== undefined) {
      where.isPublished = filters.isPublished;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
        { content: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const pages = await prisma.cMSPage.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return { success: true, data: pages };
  } catch (error) {
    console.error("Error fetching CMS pages:", error);
    return { success: false, error: "Failed to fetch CMS pages" };
  }
}

// Get single CMS page by ID
export async function getCMSPage(id: string) {
  try {
    const page = await prisma.cMSPage.findUnique({
      where: { id },
    });

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    return { success: true, data: page };
  } catch (error) {
    console.error("Error fetching CMS page:", error);
    return { success: false, error: "Failed to fetch CMS page" };
  }
}

// Get single CMS page by slug (for public viewing)
export async function getCMSPageBySlug(slug: string) {
  try {
    const page = await prisma.cMSPage.findUnique({
      where: { slug, isPublished: true },
    });

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    return { success: true, data: page };
  } catch (error) {
    console.error("Error fetching CMS page:", error);
    return { success: false, error: "Failed to fetch CMS page" };
  }
}

// Create CMS page
export async function createCMSPage(data: CMSPageFormData) {
  try {
    // Validate data
    const validatedData = cmsPageSchema.parse(data);

    // Check if slug already exists
    const existing = await prisma.cMSPage.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return { success: false, error: "Page with this slug already exists" };
    }

    const page = await prisma.cMSPage.create({
      data: validatedData,
    });

    revalidatePath("/admin/pages");
    return { success: true, data: page };
  } catch (error) {
    console.error("Error creating CMS page:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to create CMS page" };
  }
}

// Update CMS page
export async function updateCMSPage(id: string, data: CMSPageFormData) {
  try {
    // Validate data
    const validatedData = cmsPageSchema.parse(data);

    // Check if slug is taken by another page
    const existing = await prisma.cMSPage.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing && existing.id !== id) {
      return { success: false, error: "Page with this slug already exists" };
    }

    const page = await prisma.cMSPage.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);
    return { success: true, data: page };
  } catch (error) {
    console.error("Error updating CMS page:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Failed to update CMS page" };
  }
}

// Delete CMS page
export async function deleteCMSPage(id: string) {
  try {
    const page = await prisma.cMSPage.findUnique({
      where: { id },
    });

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    await prisma.cMSPage.delete({
      where: { id },
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);
    return { success: true, message: "Page deleted successfully" };
  } catch (error) {
    console.error("Error deleting CMS page:", error);
    return { success: false, error: "Failed to delete CMS page" };
  }
}

// Toggle page published status
export async function toggleCMSPageStatus(id: string) {
  try {
    const page = await prisma.cMSPage.findUnique({
      where: { id },
    });

    if (!page) {
      return { success: false, error: "Page not found" };
    }

    const updated = await prisma.cMSPage.update({
      where: { id },
      data: { isPublished: !page.isPublished },
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error toggling page status:", error);
    return { success: false, error: "Failed to update page status" };
  }
}
