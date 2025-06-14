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
          user.data.user.role !== "Tourism Staff"
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
    <>
      <main className="flex flex-col items-center justify-start min-h-screen gap-12 bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <div className="flex w-full flex-col items-center justify-start gap-4 px-4 py-2 lg:pl-0">
          <h1 className="text-4xl font-extrabold text-center text-blue-700 tracking-tight">
            Rules
          </h1>
          <p className="mt-2 text-lg text-gray-700">
            Manage all rules in the system.
          </p>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div className="w-full max-w-[90rem]">
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
          {/* View Dialog */}
          <Dialog open={!!dialogRule} onOpenChange={() => setDialogRule(null)}>
            <DialogContent className="min-w-[300px] md:max-w-4xl lg:max-w-5xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Rule Details</DialogTitle>
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
                <DialogTitle>Edit Rule</DialogTitle>
                <DialogDescription>
                  Edit the details of the rule.
                </DialogDescription>
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
                <DialogTitle>Delete Rule</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this rule? This action cannot
                  be undone.
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
        </div>
      </main>
    </>
  );
}
