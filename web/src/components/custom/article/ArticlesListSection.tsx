"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { ArticlesSectionProps } from "@/types/ArticleTypes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toTitleCase, toSentenceCase } from "@/lib/utils/stringUtils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ARTICLES_PER_PAGE = 8;

export default function ArticlesListSection({
  articles,
}: ArticlesSectionProps) {
  const [page, setPage] = useState(1);

  if (!articles || articles.length === 0) {
    return (
      <section className="bg-gradient-to-b from-[#000000]/5 to-[#ffffff] w-full py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-lg rounded-lg">
            <header className="text-center p-8">
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                Explore the Rich Heritage of Bantayan Island
              </h2>
              <p className="text-gray-600">
                No articles available at the moment.
              </p>
            </header>
          </div>
        </div>
      </section>
    );
  }

  const regularArticles = articles
    .filter((article) => article.is_featured !== true)
    .sort((a, b) => a.title.localeCompare(b.title));

  const totalPages = Math.ceil(regularArticles.length / ARTICLES_PER_PAGE);

  const paginatedArticles = regularArticles.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE
  );

  return (
    <section className="bg-gradient-to-t from-[#000000]/5 to-[#ffffff] w-full py-20">
      <div className="container mx-auto px-4 py-0 my-0">
        <div className="bg-white shadow-xs rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-8 pt-8 pb-8">
            {paginatedArticles.map((article) => (
              <Link href={`/articles/${article.id}`} key={article.id}>
                <Card className="hover:shadow-lg transition-shadow shadow-none border-none duration-300 cursor-pointer p-0 flex flex-col h-full">
                  <CardHeader className="p-0">
                    {article.images && article.images.length > 0 && (
                      <div className="rounded-t-lg overflow-hidden h-48 relative">
                        <Image
                          src={article.images[0].image_url}
                          alt={article.title}
                          fill
                          className="object-cover w-full h-full"
                          sizes="100vw"
                        />
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="px-4 pb-4 flex flex-col flex-1">
                    <h4 className="font-bold text-base mb-2 text-neutral-800 line-clamp-2 leading-tight">
                      {toTitleCase(article.title)}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-4 flex-1">
                      {toSentenceCase(article.content?.substring(0, 120))}...
                    </p>
                    <Badge className="px-3 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                      {article.type ? toTitleCase(article.type) : "General"}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination className="pb-3">
              <PaginationContent>
                <PaginationItem>
                  {page > 1 ? (
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page - 1);
                      }}
                    />
                  ) : (
                    <span className="px-4 py-2 text-gray-400 cursor-not-allowed">
                      Previous
                    </span>
                  )}
                </PaginationItem>
                {[...Array(totalPages)].map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href="#"
                      isActive={page === idx + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(idx + 1);
                      }}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  {page < totalPages ? (
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page + 1);
                      }}
                    />
                  ) : (
                    <span className="px-4 py-2 text-gray-400 cursor-not-allowed">
                      Next
                    </span>
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </section>
  );
}
