"use client";

import { useEffect, useState } from "react";
import { useArticleManager } from "@/hooks/useArticleManager";
import { Article } from "@/app/static/article/useArticleSchema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ARTICLES_PER_PAGE = 6;

export default function PublicArticlesPage() {
  const router = useRouter();
  const { articles, fetchArticles } = useArticleManager();
  const [featured, setFeatured] = useState<Article[]>([]);
  const [regular, setRegular] = useState<Article[]>([]);
  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * ARTICLES_PER_PAGE;
  const paginatedRegular = regular.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
  const hasMore = startIndex + ARTICLES_PER_PAGE < regular.length;

  useEffect(() => {
    const load = async () => {
      await fetchArticles();

      const published = articles.filter((a) => a.status === "PUBLISHED");

      setFeatured(published.filter((a) => a.is_featured));
      setRegular(published.filter((a) => !a.is_featured));
    };

    load();
  }, [articles]);

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto space-y-12">
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>

      {/* Featured Articles */}
      {featured.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">🌟 Featured Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((article) => (
              <Link href={`/articles/${article.id}`} key={article.id}>
                <Card className="p-4 hover:shadow-lg transition cursor-pointer">
                  {article.thumbnail_url && (
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="text-xl font-semibold line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600">By {article.author}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Regular Articles */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">More Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedRegular.map((article) => (
            <Link href={`/articles/${article.id}`} key={article.id}>
              <Card className="p-4 hover:shadow-lg transition cursor-pointer">
                {article.thumbnail_url && (
                  <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <h4 className="font-medium text-lg line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-500">By {article.author}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 gap-4">
          {page > 1 && (
            <Button variant="outline" onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
          )}
          {hasMore && (
            <Button onClick={() => setPage((p) => p + 1)}>Load More</Button>
          )}
        </div>
      </section>
    </main>
  );
}
