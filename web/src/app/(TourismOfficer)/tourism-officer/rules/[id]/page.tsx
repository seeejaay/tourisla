"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRuleManager } from "@/hooks/useRuleManager";
import ViewRule from "@/components/custom/rules/viewRule";
import { RuleWithmeta } from "@/app/static/rules/rule";

export default function RuleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [rule, setRule] = useState<RuleWithmeta | null>(null);

  const { loggedInUser } = useAuth();
  const { viewRule, loading, error } = useRuleManager();

  useEffect(() => {
    async function getCurrentUserAndRule() {
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
      } catch (error) {
        router.replace("/");
        console.error("Error fetching user:", error);
        return;
      }

      if (!id) return;
      viewRule(id as string)
        .then((data) => {
          if (data) {
            setRule({
              ...data,
              created_at:
                "created_at" in data && typeof data.created_at === "string"
                  ? data.created_at
                  : "",
              updated_at:
                "updated_at" in data && typeof data.updated_at === "string"
                  ? data.updated_at
                  : "",
            });
          } else {
            setRule(null);
          }
        })
        .catch(() => setRule(null));
    }

    getCurrentUserAndRule();
  }, [id, router, loggedInUser, viewRule]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!rule) return <div>Rule not found.</div>;

  return <ViewRule rule={rule} />;
}
