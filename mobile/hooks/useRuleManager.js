import { useState, useCallback } from 'react';
import { createRule, getAllRules, getRuleById, updateRule, deleteRule } from '@/lib/api/rules';

export function useRuleManager() {
  const [rules, setRules] = useState([]);
  const [currentRule, setCurrentRule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('Loading rules...');
    
    try {
      const data = await getAllRules();
      setRules(data);
      return data;
    } catch (err) {
      console.error('Error fetching rules:', err);
      setError(err.message || 'Failed to fetch rules');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRuleById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getRuleById(id);
      setCurrentRule(data);
      return data;
    } catch (err) {
      console.error(`Error fetching rule ${id}:`, err);
      setError(err.message || 'Failed to fetch rule');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addRule = useCallback(async (ruleData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add a retry mechanism with unique titles
      let attempts = 0;
      const maxAttempts = 3;
      let result = null;
      
      while (attempts < maxAttempts && !result) {
        try {
          // Add a unique suffix to the title on each retry
          const modifiedData = {
            ...ruleData,
            title: attempts > 0 
              ? `${ruleData.title} (${attempts})` 
              : ruleData.title
          };
          
          result = await createRule(modifiedData);
          return result;
        } catch (err) {
          attempts++;
          if (attempts >= maxAttempts) throw err;
          
          // Only retry for duplicate key errors
          if (!err.response?.data?.error?.includes('duplicate key') && 
              !err.response?.data?.error?.includes('already exists')) {
            throw err;
          }
          
          console.log(`Retry attempt ${attempts} for creating rule`);
        }
      }
      
      return result;
    } catch (err) {
      console.error('Error creating rule:', err);
      setError(err.message || 'Failed to create rule');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editRule = useCallback(async (id, ruleData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await updateRule(id, ruleData);
      return data;
    } catch (err) {
      console.error(`Error updating rule ${id}:`, err);
      setError(err.message || 'Failed to update rule');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeRule = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteRule(id);
      return true;
    } catch (err) {
      console.error(`Error deleting rule ${id}:`, err);
      setError(err.message || 'Failed to delete rule');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rules,
    currentRule,
    loading,
    error,
    fetchRules,
    fetchRuleById,
    createRule: addRule,
    updateRule: editRule,
    deleteRule: removeRule,
  };
}