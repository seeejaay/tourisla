import { useState, useCallback } from 'react';
import { 
  fetchRules, 
  fetchRuleById, 
  createRule as apiCreateRule, 
  updateRule as apiUpdateRule, 
  deleteRule as apiDeleteRule 
} from '@/lib/api/rules';

export type Rule = {
  id: string;
  title: string;
  description: string;
  category: string;
  penalty?: string;
  is_active: boolean;
  effective_date?: string;
  created_at?: string;
  updated_at?: string;
};

export function useRuleManager() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRules();
      setRules(data || []);
      return data;
    } catch (err: any) {
      console.error('Error fetching rules:', err);
      setError(`Failed to fetch rules: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRuleById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      return await fetchRuleById(id);
    } catch (err: any) {
      console.error('Error fetching rule by ID:', err);
      setError(`Failed to fetch rule: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRule = useCallback(async (ruleData: Omit<Rule, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newRule = await apiCreateRule(ruleData);
      // Update the rules list with the new rule
      setRules(prevRules => [...prevRules, newRule]);
      return newRule;
    } catch (err: any) {
      console.error('Error creating rule:', err);
      setError(`Failed to create rule: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRule = useCallback(async (id: string, ruleData: Partial<Rule>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRule = await apiUpdateRule(id, ruleData);
      // Update the rules list with the updated rule
      setRules(prevRules => 
        prevRules.map(rule => 
          rule.id === id ? { ...rule, ...updatedRule } : rule
        )
      );
      return updatedRule;
    } catch (err: any) {
      console.error('Error updating rule:', err);
      setError(`Failed to update rule: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRule = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiDeleteRule(id);
      // Remove the deleted rule from the rules list
      setRules(prevRules => prevRules.filter(rule => rule.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting rule:', err);
      setError(`Failed to delete rule: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rules,
    loading,
    error,
    getRules,
    getRuleById,
    createRule,
    updateRule,
    deleteRule
  };
}

