"use client";

import Sidebar from "@/components/custom/sidebar";
import {
  User,
  columns as userColumns,
} from "@/components/custom/users/columns";
import DataTable from "@/components/custom/data-table";
import SignUp from "@/components/custom/signup";
import { useEffect, useState } from "react";
import { fetchUsers, editUser, deleteUser } from "@/lib/api/users";
import { currentUser } from "@/lib/api/auth"; // Import the currentUser function
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
  const [authChecked, setAuthChecked] = useState(false);
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
        setAuthChecked(true);
      }
    }
    getCurrentUserAndUsers();
  }, [router]);

  if (!authChecked || loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Sidebar />
      <main className="flex flex-col items-center justify-start min-h-screen gap-12 w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <div className="flex max-w-[100rem] w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">
            Users
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            Manage all users in the system.
          </p>
          <div className="w-full max-w-[90rem]">
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
            <Dialog
              open={!!dialogUser}
              onOpenChange={() => setDialogUser(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>User Details</DialogTitle>
                  <DialogDescription>
                    Here are the details of the user.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {dialogUser && <ViewUser user={dialogUser} />}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={!!editDialogUser}
              onOpenChange={() => setEditDialogUser(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
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

            <Dialog
              open={!!deleteDialogUser}
              onOpenChange={() => setDeleteDialogUser(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete User</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this user? This action
                    cannot be undone.
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
                            u.user_id === userId
                              ? { ...u, status: "Inactive" }
                              : u
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
          </div>
        </div>
      </main>
    </>
  );
}
