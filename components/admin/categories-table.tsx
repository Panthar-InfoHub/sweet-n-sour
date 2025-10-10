"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import { CategoryDialog } from "./category-dialog"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

const MOCK_CATEGORIES = [
  {
    id: "1",
    name: "Pickles",
    slug: "pickles",
    image: "/pickle-jar.jpg",
    productCount: 12,
    isActive: true,
  },
  {
    id: "2",
    name: "Red Chilli",
    slug: "red-chilli",
    image: "/red-chilli.jpg",
    productCount: 8,
    isActive: true,
  },
  {
    id: "3",
    name: "Mango",
    slug: "mango",
    image: "/ripe-mango.png",
    productCount: 15,
    isActive: true,
  },
  {
    id: "4",
    name: "Green Chilli",
    slug: "green-chilli",
    image: "/green-chilli.jpg",
    productCount: 6,
    isActive: false,
  },
]

export function CategoriesTable() {
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null)

  const handleEdit = (category: any) => {
    setSelectedCategory(category)
    setIsEditOpen(true)
  }

  const handleDelete = (category: any) => {
    setCategoryToDelete(category)
    setIsDeleteOpen(true)
  }

  const confirmDelete = () => {
    console.log("[v0] Deleting category:", categoryToDelete)
    // Backend logic will go here
    setIsDeleteOpen(false)
    setCategoryToDelete(null)
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CATEGORIES.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="relative h-12 w-12 rounded-md overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell>{category.productCount} products</TableCell>
                <TableCell>
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(category)} className="text-destructive">
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

      <CategoryDialog category={selectedCategory} open={isEditOpen} onOpenChange={setIsEditOpen} />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This will affect ${categoryToDelete?.productCount} products.`}
      />
    </>
  )
}
