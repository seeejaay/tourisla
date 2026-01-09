import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ArticlesSectionProps } from "@/types/ArticleTypes";
import { toTitleCase, toSentenceCase } from "@/lib/utils/stringUtils";
export default function ArticlesPageSection({
  articles,
}: ArticlesSectionProps) {
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

  const getRandomFeaturedArticle = () => {
    const featuredArticles = articles.filter(
      (article) => article.is_featured == true
    );

    if (featuredArticles.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * featuredArticles.length);
    return featuredArticles[randomIndex];
  };

  const featuredArticle = getRandomFeaturedArticle();

  return (
    <section className="bg-gradient-to-b from-[#000000]/5 to-[#ffffff] w-full py-20">
      <div className="container mx-auto px-4 py-0 my-0">
        <div className="bg-white shadow-xs rounded-lg">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 pt-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800">
              Featured
            </h2>
          </header>

          <div className="px-6 sm:px-8 pb-8  ">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
              <div className="lg:col-span-3">
                {featuredArticle ? (
                  <Link href={`/articles/${featuredArticle.id}`}>
                    <Card
                      className="flex flex-col h-full p-0 bg-white shadow-none hover:border border-none"
                      key={featuredArticle.id}
                    >
                      <CardHeader className="p-0">
                        <h2 className="font-extrabold text-neutral-900 lg:text-2xl text-lg ">
                          {toTitleCase(featuredArticle.title)}
                        </h2>
                        <h4 className=" text-gray-500 font-medium ">
                          Posted By: {toTitleCase(featuredArticle.author)}{" "}
                          <span className="hidden sm:inline">•</span>{" "}
                          {new Date(
                            featuredArticle.created_at
                          ).toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </h4>
                      </CardHeader>
                      <CardContent className="p-0 ">
                        {featuredArticle.images &&
                        featuredArticle.images.length > 0 ? (
                          <div className="max-w-full overflow-hidden rounded-lg group">
                            <Image
                              src={featuredArticle.images[0].image_url}
                              alt={featuredArticle.title}
                              className="object-cover w-full lg:h-[32.30rem] h-36 object-center transition-transform duration-300 group-hover:scale-105"
                              width={1000}
                              height={1000}
                              sizes="100vw"
                              priority
                            />
                          </div>
                        ) : (
                          <div className="max-w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center w-full h-64 mb-4">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <p>No featured articles available.</p>
                )}
              </div>
              <aside className="lg:col-span-2">
                <div className="flex flex-col gap-[30px]">
                  {articles
                    .filter((article) => article.id !== featuredArticle?.id)
                    .slice(0, 4)
                    .map((article) => (
                      <Link href={`/articles/${article.id}`} key={article.id}>
                        <Card className="flex flex-row hover:shadow-lg transition-shadow  shadow-none border-none duration-300 cursor-pointer p-0">
                          {article.images && article.images.length > 0 ? (
                            <div className="w-1/3 rounded-l-lg overflow-hidden h-32 relative">
                              <Image
                                src={article.images[0].image_url}
                                alt={article.title}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                fill
                                sizes="100vw"
                              />
                            </div>
                          ) : (
                            <div className="w-1/3 rounded-l-lg overflow-hidden h-26 bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                          <CardContent className="w-2/3 px-4 flex flex-col h-full">
                            <h4 className="font-bold text-sm lg:text-base mb-2 text-neutral-800 line-clamp-2 leading-tight">
                              {toTitleCase(article.title)}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-4">
                              {toSentenceCase(
                                article.content?.substring(0, 100)
                              )}
                              ...
                            </p>
                            <Badge className="px-3 bg-teal-100 text-teal-800 rounded-full text-xs font-medium mt-auto">
                              {article.type
                                ? toTitleCase(article.type)
                                : "General"}
                            </Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
