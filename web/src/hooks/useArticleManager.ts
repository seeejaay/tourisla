"use client";

import { useState, useEffect } from "react";
import {
  fetchArticles,
  viewArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/api/articles";

import type { Article, ArticleSchema } from "@/app/static/article/useArticleSchema";

export const useArticleManager = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchAll = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (err: any) {
      setError("Error fetching articles: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const add = async (articleData: ArticleSchema): Promise<Article | null> => {
    setLoading(true);
    setError("");
    try {
      const response = await createArticle(articleData);
      setArticles((prev) => [...prev, response]);
      return response;
    } catch (err: any) {
      setError("Error adding article: " + (err.message || "Unknown error"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const edit = async (id: number, articleData: ArticleSchema): Promise<Article | null> => {
    setLoading(true);
    setError("");
    try {
      const response = await updateArticle(id, articleData);
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? response : a))
      );
      return response;
    } catch (err: any) {
      setError("Error updating article: " + (err.message || "Unknown error"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err: any) {
      setError("Error deleting article: " + (err.message || "Unknown error"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const view = async (id: number): Promise<Article | null> => {
    setLoading(true);
    setError("");
    try {
      const result = await viewArticle(id);
      return result;
    } catch (err: any) {
      setError("Error viewing article: " + (err.message || "Unknown error"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

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
