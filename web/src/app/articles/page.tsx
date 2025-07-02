"use client";

import { useEffect, useState } from "react";
import { useArticleManager } from "@/hooks/useArticleManager";
import { Article } from "@/app/static/article/useArticleSchema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
const ARTICLES_PER_PAGE = 20;
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function PublicArticlesPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("all");
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
    };
    load();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Filter only published articles
    const published = articles.filter((a) => a.is_published);

    setFeatured(published.filter((a) => a.is_featured));
    setRegular(published.filter((a) => !a.is_featured));
  }, [articles]);

  // Helper to get the best image for an article
  const getArticleImage = (article: Article) => {
    if (article.images && article.images.length > 0) {
      return article.images[0].image_url;
    }
    return article.thumbnail_url || "/images/article_image.webp";
  };

  // All unique types for filter buttons
  const allTypes = Array.from(
    new Set(regular.map((article) => article.type).filter(Boolean))
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#f1f1f1]">
        <div className="relative pt-24 w-full h-[400px] overflow-hidden ">
          <Image
            src="/images/article_image.webp"
            alt="Featured Icon"
            fill
            className="object-cover object-center"
          />
          {/* Dimming overlay */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          {/* Centered text */}
          <div className="absolute top-20 inset-0 flex items-center justify-center z-20 flex-col space-y-4">
            <h2 className="text-5xl font-extrabold text-white text-center drop-shadow-lg">
              Kakyop, Sara Kag Bwas
            </h2>
            <p className="text-xl text-white text-center font-semibold drop-shadow-lg">
              Yesterday, Today, and Tomorrow
            </p>
          </div>
        </div>
        <main className="px-4 py-10 max-w-[1500px] mx-auto space-y-5">
          {/* Featured Articles Carousel */}
          <h2 className="text-4xl font-extrabold text-[#1c5461] text-start ">
            Featured
          </h2>
          {featured.length > 0 && (
            <section>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full mx-auto"
              >
                <CarouselContent>
                  {featured.map((article) => (
                    <CarouselItem key={article.id} className="basis-full">
                      <Card className="group relative p-0 overflow-hidden rounded-2xl shadow border border-[#e6f7fa] hover:shadow-md transition bg-white flex flex-col h-[32rem]">
                        <Image
                          src={getArticleImage(article)}
                          alt={article.title}
                          fill
                          className="object-cover w-full h-full"
                          style={{ zIndex: 0 }}
                        />
                        {/* Overlay for dimming */}
                        <div className="absolute inset-0 bg-black/40 z-10 transition group-hover:bg-black/50" />
                        {/* Details on top of image */}
                        <div className="absolute inset-0 z-20 flex flex-col justify-end p-10">
                          <h3 className="text-3xl font-extrabold text-white line-clamp-2 group-hover:text-[#f8d56b] transition drop-shadow mb-2">
                            {article.title}
                          </h3>
                          <p className="text-lg text-[#e6f7fa] drop-shadow mb-4">
                            By {article.author}
                          </p>
                          <Button
                            variant="ghost"
                            className="mt-2 w-fit rounded-lg hover:bg-[#1c5461] cursor-pointer bg-[#3e979f] hover:text-[#e6f7fa]/80 text-lg text-[#e6f7fa] transition-all ease-in-out "
                            onClick={() =>
                              router.push(`/articles/${article.id}`)
                            }
                          >
                            Read More
                          </Button>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-y-1/2 top-1/2" />
                <CarouselNext className="right-0 -translate-y-1/2 top-1/2" />
              </Carousel>
            </section>
          )}

          <section>
            <h2 className="text-4xl text-center font-bold text-[#1c5461] mb-6">
              Local Culture and History
            </h2>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                className={`rounded-full border-[#3e979f] text-[#1c5461] cursor-pointer hover:bg-[#e6f7fa] hover:text-[#3e979f] transition px-5}
                  ${
                    selectedType === "all"
                      ? "bg-[#3e979f] text-white hover:bg-[#1c5461] hover:text-white"
                      : ""
                  }`}
                onClick={() => setSelectedType("all")}
              >
                All
              </Button>
              {allTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  className={
                    `rounded-full border-[#3e979f] transition px-5 cursor-pointer ` +
                    (selectedType === type
                      ? " bg-[#3e979f] text-white hover:bg-[#1c5461] hover:text-white "
                      : " text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] ")
                  }
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-8 justify-center">
              {paginatedRegular
                .filter(
                  (article) =>
                    selectedType === "all" || article.type === selectedType
                )
                .map((article) => (
                  <Card
                    key={article.id}
                    className="group flex flex-col flex-grow min-w-[280px] max-w-[400px] basis-[320px] p-0 overflow-hidden rounded-2xl shadow border border-[#e6f7fa] hover:shadow-md transition bg-white"
                  >
                    <Image
                      src={getArticleImage(article)}
                      alt={article.title}
                      width={400}
                      height={200}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <h4 className="font-semibold text-lg text-[#1c5461] line-clamp-2 group-hover:text-[#3e979f] transition">
                        {article.title}
                      </h4>
                      <p className="text-sm text-[#51702c]">
                        By {article.author}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1 mb-2">
                        {Array.isArray(article.tags) &&
                          article.tags
                            .flatMap((tag) =>
                              tag
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean)
                            )
                            .map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-[#e6f7fa] text-[#3e979f] rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                      </div>
                      <Button
                        variant="outline"
                        className="mt-auto w-fit rounded-lg border-[#3e979f] text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] transition"
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
      <Footer />
    </>
  );
}
