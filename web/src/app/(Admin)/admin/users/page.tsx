"use client";

import Sidebar from "@/components/custom/sidebar";
import { columns } from "@/components/custom/users/columns";
import { DataTable } from "@/components/custom/users/data-table";
import { useEffect, useState } from "react";
import { fetchUsers, currentUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { User } from "@/components/custom/users/columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import ViewUser from "@/components/custom/users/viewUser";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const [dialogUser, setDialogUser] = useState<User | null>(null);

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
      <main className="flex flex-col items-center justify-start min-h-screen gap-12 w-full">
        <div className="flex max-w-[100rem] w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
          <h1 className="text-4xl font-bold">Users</h1>
          <div className="w-full max-w-[90rem]">
            <DataTable columns={columns(setDialogUser)} data={users} />
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
                  <div className="mt-4">
                    {dialogUser && <ViewUser user={dialogUser} />}
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>
    </>
  );
}
