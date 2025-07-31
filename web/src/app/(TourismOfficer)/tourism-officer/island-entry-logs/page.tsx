"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useIslandEntryManager } from "@/hooks/useIslandEntryManager";
import {
  columns as islandEntryColumns,
  IslandEntry,
} from "@/app/static/island-entry/columns";
import DataTable from "@/components/custom/data-table";
// import AddIslandEntry from "@/components/custom/island-entry/addIslandEntry";
// import ViewIslandEntry from "@/components/custom/island-entry/viewIslandEntry";
// import EditIslandEntry from "@/components/custom/island-entry/editIslandEntry";
// import DeleteIslandEntry from "@/components/custom/island-entry/deleteIslandEntry";

export default function IslandEntryLogsPage() {
  const router = useRouter();

  const [islandEntries, setIslandEntries] = useState<IslandEntry[]>([]);
  const { loggedInUser } = useAuth();
  const { getAllIslandEntries, loading } = useIslandEntryManager();

  useEffect(() => {
    async function getCurrentUserAndEntries() {
      try {
        const user = await loggedInUser(router);
        if (
          !user ||
          !user.data.user.role ||
          user.data.user.role !== "Tourism Officer"
        ) {
          router.replace("/");
          return;
        }
        const islanndEntryData = await getAllIslandEntries();
        if (islanndEntryData) {
          setIslandEntries(
            islanndEntryData.map((entry: IslandEntry) => ({
              ...entry,
              full_name: `${entry.first_name} ${entry.last_name}`,
            }))
          );
        } else {
          console.error("No island entries found");
        }
      } catch (error) {
        router.replace("/");
        console.error("Error fetching island entries:", error);
      }
    }
    getCurrentUserAndEntries();
  }, [router, loggedInUser, getAllIslandEntries]);

  return (
    <>
      <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
        <div className="w-full max-w-6xl flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
              Island Entry Logs
            </h1>
            <p className="text-lg text-[#51702c] text-center">
              View and manage all island entry registrations.
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
                columns={islandEntryColumns()}
                data={islandEntries}
                searchPlaceholder="Search by name or status..."
                searchColumn={["status", "full_name"]}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
