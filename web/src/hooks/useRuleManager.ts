import { useState, useCallback } from "react";

import type { RuleSchema, Rule } from "@/app/static/rules/useRuleManagerSchema";

import {
  createRule as apiCreateRule,
  fetchRules as apiFetchRules,
  fetchRuleById as apiViewRule,
  editRule as apiUpdateRule,
  deleteRule as apiDeleteRule,
} from "@/lib/api/rules";

export const useRuleManager = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchRules = useCallback(async (): Promise<Rule[] | null> => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchRules();
      setRules(data);
      return data;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRule = useCallback(
    async (ruleData: RuleSchema): Promise<Rule | null> => {
      setLoading(true);
      setError("");
      try {
        const response: Rule & { error?: string } = await apiCreateRule(
          ruleData
        );
        if (response.error) {
          setError(response.error);
          return null;
        }
        setRules((prev) => [...prev, response]);
        return response;
      } catch (error) {
        setError(
          "An error occurred while creating the rule." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const viewRule = useCallback(async (id: string): Promise<Rule | null> => {
    setLoading(true);
    setError("");
    try {
      const data = await apiViewRule(id);
      return data;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRule = useCallback(
    async (id: string, ruleData: RuleSchema): Promise<Rule | null> => {
      setLoading(true);
      setError("");
      try {
        const response: Rule & { error?: string } = await apiUpdateRule(
          id,
          ruleData
        );
        if (response.error) {
          setError(response.error);
          return null;
        }
        setRules((prev) =>
          prev.map((rule) => (rule.id === Number(id) ? response : rule))
        );
        return response;
      } catch (error) {
        setError(
          "An error occurred while updating the rule." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteRule = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      const response = await apiDeleteRule(id);
      if (response.error) {
        setError(response.error);
        return false;
      }
      setRules((prev) => prev.filter((rule) => rule.id !== Number(id)));
      return true;
    } catch (error) {
      setError(
        "An error occurred while deleting the rule." +
          (error instanceof Error ? error.message : String(error))
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    rules,
    loading,
    error,
    fetchRules,
    createRule,
    viewRule,
    updateRule,
    deleteRule,
  };
};
