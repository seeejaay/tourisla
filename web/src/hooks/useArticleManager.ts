"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchArticles,
  viewArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/api/articles";

import type {
  Article,
  ArticleSchema,
} from "@/app/static/article/useArticleSchema";

export const useArticleManager = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchAll = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      setError("Error fetching articles: " + err);
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(
    async (articleData: ArticleSchema): Promise<Article | null> => {
      setLoading(true);
      setError("");
      try {
        const response = await createArticle(articleData);
        setArticles((prev) => [...prev, response]);
        return response;
      } catch (err) {
        setError("Error adding article: " + err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const edit = useCallback(
    async (
      id: number,
      articleData: ArticleSchema | FormData
    ): Promise<Article | null> => {
      setLoading(true);
      setError("");
      try {
        // If articleData contains a file, use FormData
        let dataToSend: ArticleSchema | FormData = articleData;
        // If not already FormData, check for a file property and convert if needed
        if (
          typeof FormData !== "undefined" &&
          !(articleData instanceof FormData) &&
          typeof (articleData as ArticleSchema).thumbnail !== "undefined" &&
          (articleData as ArticleSchema).thumbnail instanceof File
        ) {
          const formData = new FormData();
          Object.entries(articleData as ArticleSchema).forEach(
            ([key, value]) => {
              if (key === "thumbnail" && value instanceof File) {
                formData.append("thumbnail", value);
              } else if (typeof value === "boolean") {
                formData.append(key, value ? "true" : "false");
              } else if (typeof value === "number") {
                formData.append(key, value.toString());
              } else if (typeof value === "string") {
                formData.append(key, value);
              } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
              }
            }
          );
          dataToSend = formData;
        }
        console.log("Data to send:", dataToSend);
        const response = await updateArticle(id, dataToSend);
        setArticles((prev) => prev.map((a) => (a.id === id ? response : a)));
        return response;
      } catch (err) {
        setError("Error updating article: " + err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const remove = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err) {
      setError("Error deleting article: " + err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const view = useCallback(async (id: number): Promise<Article | null> => {
    setLoading(true);
    setError("");
    try {
      const result = await viewArticle(id);
      return result;
    } catch (err) {
      setError("Error viewing article: " + err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    articles,
    loading,
    error,
    fetchArticles: fetchAll,
    add,
    edit,
    remove,
    view,
  };
};
