import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ArticlesSectionProps, ArticleImage } from "@/types/ArticleTypes";

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
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

  // Shuffle articles to make them random
  const shuffledArticles = [...articles].sort(() => Math.random() - 0.5);

  // Get featured article (first one from shuffled array)
  const featuredArticle = shuffledArticles[0];

  // Get remaining articles for the sidebar (up to 3)
  const sidebarArticles = shuffledArticles.slice(1, 4);

  // Helper function to get the first image URL
  const getFirstImageUrl = (images?: ArticleImage[]): string | null => {
    if (!images || images.length === 0) return null;
    return images[0].image_url;
  };

  const sentenceCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const titleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <section className="bg-gradient-to-b from-[#000000]/10 to-bg-gray-50 w-full py-20">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-xs rounded-lg">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 sm:p-8  gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800">
              Explore the Rich Heritage of Bantayan Island
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 ">See more of this</span>
              <Link href="/articles">
                <Button className="bg-teal-500 hover:bg-teal-600 cursor-pointer text-white px-6 py-2 rounded-lg">
                  View all
                </Button>
              </Link>
            </div>
          </header>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Featured Article (Left Side - Takes 2 columns on large screens) */}
              <div className="lg:col-span-2">
                <Link href={`/articles/${featuredArticle.id}`}>
                  <Card className="hover:shadow-lg transition-shadow  shadow-none border-none duration-300 cursor-pointer p-0">
                    {getFirstImageUrl(featuredArticle.images) && (
                      <CardHeader className="p-0">
                        <div className="rounded-t-lg overflow-hidden h-48 sm:h-64 lg:h-80 relative">
                          <Image
                            src={getFirstImageUrl(featuredArticle.images)!}
                            alt={featuredArticle.title}
                            className="object-cover w-full hover:scale-105 transition-transform duration-300"
                            priority
                            width={800}
                            height={400}
                            sizes="100vw"
                          />
                        </div>
                      </CardHeader>
                    )}

                    <CardContent className="p-4 sm:p-6">
                      {/* Title */}
                      <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-4 text-neutral-800 leading-tight">
                        {titleCase(featuredArticle.title)}
                      </h3>

                      {/* Author and Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-4 text-sm text-gray-500">
                        <span>
                          Posted By: {titleCase(featuredArticle.author)}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {new Date(
                            featuredArticle.created_at
                          ).toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Content Preview */}
                      <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                        {sentenceCase(
                          featuredArticle.content?.substring(0, 300)
                        )}
                        ...
                      </p>

                      {/* Tags/Categories - Optional */}
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                          {featuredArticle.type
                            ? titleCase(featuredArticle.type)
                            : "General"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Sidebar Articles (Right Side - 1 column) */}
              <div className="flex flex-col gap-6">
                {sidebarArticles.map((article) => (
                  <Link href={`/articles/${article.id}`} key={article.id}>
                    <Card className="hover:shadow-lg transition-shadow  shadow-none border-none duration-300 cursor-pointer p-0">
                      <CardContent className="p-0">
                        <div className="flex gap-4 ">
                          {/* Small Image */}
                          {getFirstImageUrl(article.images) && (
                            <div className="flex-shrink-0 ">
                              <div className="w-24 h-40 relative overflow-hidden rounded-s-lg object-cover">
                                <Image
                                  src={getFirstImageUrl(article.images)!}
                                  alt={article.title}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform duration-300"
                                  sizes="100vw"
                                />
                              </div>
                            </div>
                          )}
                          {/* Content */}
                          <div className="flex-1 min-w-0 py-4 px-2 ">
                            <h4 className="font-bold text-sm lg:text-base mb-2 text-neutral-800 line-clamp-2 leading-tight">
                              {titleCase(article.title)}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-4">
                              {sentenceCase(article.content?.substring(0, 200))}
                              ...
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

                {/* Show "View All" button at bottom of sidebar if there are more articles */}
                {articles.length > 4 && (
                  <div className="pt-4">
                    <Link href="/articles">
                      <Button
                        variant="outline"
                        className="w-full border-teal-500 text-teal-600 hover:bg-teal-50 cursor-pointer"
                      >
                        View All Articles
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
