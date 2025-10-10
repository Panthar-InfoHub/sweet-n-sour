"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/format";
import { PageEditorDialog } from "./page-editor-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

const MOCK_PAGES = [
  {
    id: "1",
    title: "Terms & Conditions",
    slug: "terms-and-conditions",
    status: "published",
    lastUpdated: new Date("2025-10-01"),
  },
  {
    id: "2",
    title: "Privacy Policy",
    slug: "privacy-policy",
    status: "published",
    lastUpdated: new Date("2025-09-28"),
  },
  {
    id: "3",
    title: "Shipping Policy",
    slug: "shipping-policy",
    status: "published",
    lastUpdated: new Date("2025-09-25"),
  },
  {
    id: "4",
    title: "Return & Refund Policy",
    slug: "return-refund-policy",
    status: "published",
    lastUpdated: new Date("2025-09-20"),
  },
  {
    id: "5",
    title: "About Us",
    slug: "about-us",
    status: "draft",
    lastUpdated: new Date("2025-10-05"),
  },
];

export function PagesTable() {
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<any>(null);

  const handleEdit = (page: any) => {
    setSelectedPage(page);
    setIsEditOpen(true);
  };

  const handleDelete = (page: any) => {
    setPageToDelete(page);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    console.log("[v0] Deleting page:", pageToDelete);
    // Backend logic will go here
    setIsDeleteOpen(false);
    setPageToDelete(null);
  };

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PAGES.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                <TableCell>
                  <Badge
                    variant={page.status === "published" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {page.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(page.lastUpdated)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(page)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(page)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PageEditorDialog page={selectedPage} open={isEditOpen} onOpenChange={setIsEditOpen} />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        title="Delete Page"
        description={`Are you sure you want to delete "${pageToDelete?.title}"? This action cannot be undone.`}
      />
    </>
  );
}
