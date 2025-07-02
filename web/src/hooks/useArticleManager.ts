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
      console.log("Fetched articles:", data);
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
    async (id: number, articleData: ArticleSchema): Promise<Article | null> => {
      setLoading(true);
      setError("");
      try {
        console.log("Editing article with ID:", id, "Data:", articleData);
        let dataToSend: ArticleSchema | FormData = articleData;

        // Convert to FormData if a new image file is present
        if (
          typeof FormData !== "undefined" &&
          Object.prototype.hasOwnProperty.call(articleData, "images") &&
          Array.isArray(articleData.images) &&
          articleData.images[0] instanceof File
        ) {
          const formData = new FormData();
          Object.entries(articleData).forEach(([key, value]) => {
            if (
              key === "images" &&
              Array.isArray(value) &&
              value[0] instanceof File
            ) {
              formData.append("images", value[0]);
            } else if (typeof value === "boolean") {
              formData.append(key, value ? "true" : "false");
            } else if (typeof value === "number") {
              formData.append(key, value.toString());
            } else if (typeof value === "string") {
              formData.append(key, value);
            }
          });
          dataToSend = formData;
        }

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
      console.log("Viewed article:", result);
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
