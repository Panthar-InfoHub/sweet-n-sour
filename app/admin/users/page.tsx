import { UsersTable } from "@/components/admin/users-table";
import { getUsers } from "@/actions/user.actions";

export default async function AdminUsersPage() {
  const result = await getUsers();
  const users = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">Manage customer accounts</p>
      </div>

      <UsersTable users={users || []} />
    </div>
  );
}
