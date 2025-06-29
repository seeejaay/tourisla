"use client";

import {
  User,
  columns as userColumns,
} from "@/components/custom/users/columns";
import DataTable from "@/components/custom/data-table";
import SignUp from "@/components/custom/signup";
import { useEffect, useState } from "react";
import { fetchUsers, editUser, deleteUser } from "@/lib/api/users";
import { currentUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import ViewUser from "@/components/custom/users/viewUser";
import EditUser from "@/components/custom/users/editUser";
import DeleteUser from "@/components/custom/users/deleteUser";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [dialogUser, setDialogUser] = useState<User | null>(null);
  const [editDialogUser, setEditDialogUser] = useState<User | null>(null);
  const [deleteDialogUser, setDeleteDialogUser] = useState<User | null>(null);

  useEffect(() => {
    async function getCurrentUserAndUsers() {
      try {
        const user = await currentUser();
        if (!user || !user.data.user.role || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        router.replace("/");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    getCurrentUserAndUsers();
  }, [router]);

  return (
    <>
      <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
        <div className="w-full max-w-6xl flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
              Users
            </h1>
            <p className="text-lg text-[#51702c] text-center">
              Manage all users in the system.
            </p>
          </div>
          <div className="w-full flex flex-col items-center">
            {loading && (
              <div className="flex items-center gap-2 py-4">
                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3e979f]"></span>
                <span className="text-[#3e979f] font-medium">Loading...</span>
              </div>
            )}
            <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-4 md:p-8">
              <DataTable
                columns={userColumns(
                  setDialogUser,
                  setEditDialogUser,
                  setDeleteDialogUser
                )}
                data={users}
                addDialogTitle="Add User"
                AddDialogComponent={<SignUp />}
                searchPlaceholder="Search users..."
                searchColumn="name"
              />
            </div>
          </div>
        </div>

        {/* View Dialog */}
        <Dialog open={!!dialogUser} onOpenChange={() => setDialogUser(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#1c5461]">User Details</DialogTitle>
              <DialogDescription>
                Here are the details of the user.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {dialogUser && <ViewUser user={dialogUser} />}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={!!editDialogUser}
          onOpenChange={() => setEditDialogUser(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#1c5461]">Edit User</DialogTitle>
              <DialogDescription>
                Edit the details of the user.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {editDialogUser && (
                <EditUser
                  user={editDialogUser}
                  onSave={async (updatedUser) => {
                    await editUser(updatedUser);
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.user_id === updatedUser.user_id ? updatedUser : u
                      )
                    );
                    setEditDialogUser(null);
                  }}
                  onCancel={() => setEditDialogUser(null)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={!!deleteDialogUser}
          onOpenChange={() => setDeleteDialogUser(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#c0392b]">Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {deleteDialogUser && (
                <DeleteUser
                  user={deleteDialogUser}
                  onDelete={async (userId) => {
                    await deleteUser(userId);
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.user_id === userId ? { ...u, status: "Inactive" } : u
                      )
                    );
                    setDeleteDialogUser(null);
                  }}
                  onCancel={() => setDeleteDialogUser(null)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
