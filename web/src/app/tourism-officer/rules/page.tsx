"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRuleManager } from "@/hooks/useRuleManager";
import { columns as ruleColumns } from "@/components/custom/rules/columns";
import DataTable from "@/components/custom/data-table";
import AddRule from "@/components/custom/rules/addRule";
import ViewRule from "@/components/custom/rules/viewRule";
import EditRule from "@/components/custom/rules/editRule";
import DeleteRule from "@/components/custom/rules/deleteRule";
import type { Rule } from "@/app/static/rules/useRuleManagerSchema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function RulesPage() {
  const router = useRouter();
  const [dialogRule, setDialogRule] = useState<Rule | null>(null);
  const [editDialogRule, setEditDialogRule] = useState<Rule | null>(null);
  const [deleteDialogRule, setDeleteDialogRule] = useState<Rule | null>(null);

  const { loggedInUser } = useAuth();
  const { rules, fetchRules, updateRule, deleteRule, loading, error } =
    useRuleManager();

  // Refresh rules after add/edit/delete
  const refreshRules = async () => {
    await fetchRules();
  };

  useEffect(() => {
    async function getCurrentUserAndRules() {
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
        await fetchRules();
      } catch (error) {
        router.replace("/");
        console.error("Error fetching rules:", error);
      }
    }
    getCurrentUserAndRules();
  }, [router, loggedInUser, fetchRules]);

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
            Rules
          </h1>
          <p className="text-lg text-[#51702c] text-center">
            Manage all rules in the system.
          </p>
        </div>
        <div className="w-full flex flex-col items-center">
          {loading && (
            <div className="flex items-center gap-2 py-4">
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3e979f]"></span>
              <span className="text-[#3e979f] font-medium">Loading...</span>
            </div>
          )}
          {error && (
            <div className="text-[#c0392b] bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-center w-full max-w-lg">
              {error}
            </div>
          )}
          <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-4 md:p-8">
            <DataTable
              columns={ruleColumns(
                setDialogRule,
                setEditDialogRule,
                setDeleteDialogRule
              )}
              data={rules}
              addDialogTitle="Add Rule"
              AddDialogComponent={<AddRule onSuccess={refreshRules} />}
              searchPlaceholder="Search rules..."
              searchColumn="title"
            />
          </div>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={!!dialogRule} onOpenChange={() => setDialogRule(null)}>
        <DialogContent className="min-w-[300px] md:max-w-4xl lg:max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1c5461]">
              Rule Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about the rule
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 overflow-y-auto max-h-[80vh]">
            {dialogRule && <ViewRule rule={dialogRule} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editDialogRule}
        onOpenChange={() => setEditDialogRule(null)}
      >
        <DialogContent className="min-w-[300px] md:max-w-3xl lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-[#1c5461]">Edit Rule</DialogTitle>
            <DialogDescription>Edit the details of the rule.</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[80vh]">
            {editDialogRule && (
              <EditRule
                rule={editDialogRule}
                onSave={async (updatedRule) => {
                  if (!updatedRule.id) return;
                  await updateRule(updatedRule.id.toString(), updatedRule);
                  await refreshRules();
                  setEditDialogRule(null);
                }}
                onCancel={() => setEditDialogRule(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={!!deleteDialogRule}
        onOpenChange={() => setDeleteDialogRule(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#c0392b]">Delete Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rule? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {deleteDialogRule && (
              <DeleteRule
                rule={deleteDialogRule}
                onDelete={async (ruleId) => {
                  if (!ruleId) return;
                  await deleteRule(ruleId);
                  await refreshRules();
                  setDeleteDialogRule(null);
                }}
                onCancel={() => setDeleteDialogRule(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
