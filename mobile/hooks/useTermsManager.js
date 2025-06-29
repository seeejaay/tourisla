import { useState, useCallback } from 'react';
import { 
  fetchTerms, 
  fetchTermById, 
  createTerm, 
  updateTerm, 
  deleteTerm 
} from '../lib/api/terms';

export const useTermsManager = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTerms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTerms();
      setTerms(data);
      return data;
    } catch (err) {
      console.error('Error fetching terms:', err);
      setError('Failed to load terms');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTerm = useCallback(async (id) => {
    try {
      const data = await fetchTermById(id);
      return data;
    } catch (err) {
      console.error('Error fetching term:', err);
      throw err;
    }
  }, []);

  const addTerm = useCallback(async (termData) => {
    try {
      const data = await createTerm(termData);
      // Update the local state if needed
      setTerms(prevTerms => [...prevTerms, data]);
      return data;
    } catch (err) {
      console.error('Error adding term:', err);
      throw err;
    }
  }, []);

  const editTerm = useCallback(async (id, termData) => {
    try {
      const data = await updateTerm(id, termData);
      // Update the local state if needed
      setTerms(prevTerms => 
        prevTerms.map(term => term.id.toString() === id.toString() ? data : term)
      );
      return data;
    } catch (err) {
      console.error('Error updating term:', err);
      throw err;
    }
  }, []);

  const removeTerm = useCallback(async (id) => {
    try {
      await deleteTerm(id);
      // Update the local state
      setTerms(prevTerms => 
        prevTerms.filter(term => term.id.toString() !== id.toString())
      );
      return true;
    } catch (err) {
      console.error('Error deleting term:', err);
      throw err;
    }
  }, []);

  return {
    terms,
    loading,
    error,
    getTerms,
    getTerm,
    addTerm,
    editTerm,
    removeTerm
  };
};


