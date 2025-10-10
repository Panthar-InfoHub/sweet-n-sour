import { Suspense } from "react";

import { UsersTable } from "@/components/admin/users-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">Manage customer accounts</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
