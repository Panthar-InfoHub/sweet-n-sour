"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/utils/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Calendar, ShoppingBag, DollarSign } from "lucide-react";

interface UserDetailsDialogProps {
  user?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={user.role === "admin" ? "default" : "secondary"}
                className="capitalize"
              >
                {user.role}
              </Badge>
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
                className="capitalize"
              >
                {user.status}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Joined Date</span>
              </div>
              <p className="font-semibold">{formatDate(user.joinedDate)}</p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email Status</span>
              </div>
              <p className="font-semibold">Verified</p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-sm">Total Orders</span>
              </div>
              <p className="font-semibold">{user.totalOrders}</p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Total Spent</span>
              </div>
              <p className="font-semibold">{formatCurrency(user.totalSpent)}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Recent Orders</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">ORD-001</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(new Date("2025-10-05"))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(1497)}</p>
                  <Badge variant="secondary" className="text-xs">
                    Delivered
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">ORD-002</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(new Date("2025-09-28"))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(998)}</p>
                  <Badge variant="secondary" className="text-xs">
                    Delivered
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
