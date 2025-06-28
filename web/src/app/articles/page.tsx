"use client";

import { useEffect, useState } from "react";
import { useArticleManager } from "@/hooks/useArticleManager";
import { Article } from "@/app/static/article/useArticleSchema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Header from "@/components/custom/header";
import {} from "lucide-react";
const ARTICLES_PER_PAGE = 6;

export default function PublicArticlesPage() {
  const router = useRouter();
  const { articles, fetchArticles } = useArticleManager();
  const [featured, setFeatured] = useState<Article[]>([]);
  const [regular, setRegular] = useState<Article[]>([]);
  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * ARTICLES_PER_PAGE;
  const paginatedRegular = regular.slice(
    startIndex,
    startIndex + ARTICLES_PER_PAGE
  );
  const hasMore = startIndex + ARTICLES_PER_PAGE < regular.length;

  useEffect(() => {
    const load = async () => {
      await fetchArticles();

      const published = articles.filter((a) => a.status === "PUBLISHED");

      setFeatured(published.filter((a) => a.is_featured));
      setRegular(published.filter((a) => !a.is_featured));
    };

    load();
  }, [articles, fetchArticles]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b to-[#b6e0e4] via-[#f0f0f0] from-[#e6f7fa]">
        <main className="px-4 pt-28 py-10 max-w-7xl mx-auto space-y-14">
          {/* Featured Articles */}
          {featured.length > 0 && (
            <section>
              <h2 className="text-3xl font-extrabold text-[#1c5461] mb-6 flex items-center gap-2">
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featured.map((article) => (
                  <Card
                    key={article.id}
                    className="group p-0 overflow-hidden rounded-2xl shadow border border-[#e6f7fa] hover:shadow-md transition bg-white flex flex-col"
                  >
                    {article.thumbnail_url && (
                      <img
                        src={article.thumbnail_url}
                        alt={article.title}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="p-5 flex flex-col gap-2 flex-1">
                      <h3 className="text-xl font-bold text-[#1c5461] line-clamp-2 group-hover:text-[#3e979f] transition">
                        {article.title}
                      </h3>
                      <p className="text-sm text-[#51702c]">
                        By {article.author}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-2 w-fit rounded-lg border-[#3e979f] cursor-pointer text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] transition"
                        onClick={() => router.push(`/articles/${article.id}`)}
                      >
                        See More
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Regular Articles */}
          <section>
            <h2 className="text-2xl font-bold text-[#1c5461] mb-6">
              More Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedRegular.map((article) => (
                <Card
                  key={article.id}
                  className="group p-0 overflow-hidden rounded-2xl shadow border border-[#e6f7fa] hover:shadow-md transition bg-white flex flex-col"
                >
                  {article.thumbnail_url && (
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h4 className="font-semibold text-lg text-[#1c5461] line-clamp-2 group-hover:text-[#3e979f] transition">
                      {article.title}
                    </h4>
                    <p className="text-sm text-[#51702c]">
                      By {article.author}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 w-fit rounded-full border-[#3e979f] text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] transition"
                      onClick={() => router.push(`/articles/${article.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-10 gap-4">
              {page > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full border-[#3e979f] text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] transition"
                >
                  Previous
                </Button>
              )}
              {hasMore && (
                <Button
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full bg-[#3e979f] text-white hover:bg-[#1c5461] transition"
                >
                  Load More
                </Button>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
