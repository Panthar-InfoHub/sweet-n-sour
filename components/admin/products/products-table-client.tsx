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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/utils/format";
import {
  deleteProduct,
  toggleProductFeatured,
  toggleProductBestSeller,
  toggleProductSale,
} from "@/actions/admin/product.actions";
import { toast } from "sonner";

interface ProductsTableClientProps {
  products: any[];
  currentPage: number;
  totalPages: number;
}

export function ProductsTableClient({
  products,
  currentPage,
  totalPages,
}: ProductsTableClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [optimisticProducts, setOptimisticProducts] = useState(products);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handleEdit = (slug: string) => {
    router.push(`/admin/products/edit/${slug}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;

    const result = await deleteProduct(id);
    if (result.success) {
      toast.success("Product deleted");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete");
    }
  };

  const toggleFeature = async (id: string, type: "featured" | "bestseller" | "sale") => {
    const action =
      type === "featured"
        ? toggleProductFeatured
        : type === "bestseller"
        ? toggleProductBestSeller
        : toggleProductSale;

    const result = await action(id);
    if (result.success) {
      toast.success(`Product ${type} toggled`);
      router.refresh();
    } else {
      toast.error(result.error || "Failed");
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => {
                  const firstVariant = product.variants?.[0];
                  const totalStock = Array.isArray(product.variants)
                    ? product.variants.reduce(
                        (sum: number, v: any) => sum + (v.stockQuantity || 0),
                        0
                      )
                    : 0;

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Image
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category?.name || "N/A"}</TableCell>
                      <TableCell>{formatCurrency(firstVariant?.price || 0)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={totalStock === 0 ? "text-muted-foreground" : ""}
                        >
                          {totalStock} units
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {product.isFeatured && (
                            <Badge variant="outline" className="gap-1">
                              <Star className="h-3 w-3" />
                              Featured
                            </Badge>
                          )}
                          {product.isBestSeller && (
                            <Badge variant="outline" className="gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Bestseller
                            </Badge>
                          )}
                          {product.isOnSale && (
                            <Badge variant="outline" className="gap-1">
                              <Tag className="h-3 w-3" />
                              Sale
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(product.slug)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleFeature(product.id, "featured")}>
                              <Star className="h-4 w-4 mr-2" />
                              {product.isFeatured ? "Unfeature" : "Feature"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleFeature(product.id, "bestseller")}
                            >
                              <TrendingUp className="h-4 w-4 mr-2" />
                              {product.isBestSeller ? "Remove Bestseller" : "Mark Bestseller"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleFeature(product.id, "sale")}>
                              <Tag className="h-4 w-4 mr-2" />
                              {product.isOnSale ? "Remove Sale" : "Mark Sale"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(product.id, product.name)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
