import Image from "next/image";
import Header from "@/components/custom/Header";
import Footer from "@/components/custom/footer";
import { notFound } from "next/navigation";
import { showArticle } from "@/lib/api/articles";
import type { Article } from "@/types/ArticleTypes";
import { toSentenceCase, toTitleCase } from "@/lib/utils/stringUtils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article: Article | null = await showArticle(id);

  if (!article) {
    notFound();
  }

  const extractYouTubeId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f1f1f1]">
        <section className="flex items-center justify-center">
          <section className="bg-gradient-to-b from-[#000000]/5 to-white w-full py-20">
            <div className="container mx-auto px-4 py-0 ">
              <Card className="p-0 ">
                <CardHeader className="p-0">
                  <Image
                    width={2000}
                    height={2000}
                    src={
                      article.images && article.images.length > 0
                        ? article.images[0].image_url
                        : "/images/default-article.jpg"
                    }
                    alt={article.title}
                    className="w-full lg:h-[30rem] h-96 object-cover rounded-t-lg object-center"
                    sizes="100vw"
                  />
                </CardHeader>
                <CardContent className="px-8 pb-8 ">
                  <div className="space-y-4">
                    <h1 className="lg:text-4xl text-2xl font-extrabold text-neutral-900">
                      {article.title}
                    </h1>
                    <div>
                      <p className="text-md text-gray-500 mb-2 font-semibold">
                        Posted By: {toTitleCase(article.author)}
                        <span>
                          {" | " +
                            new Date(article.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 lg:gap-8">
                    <div className="lg:col-span-4 text-justify ">
                      <p>{toSentenceCase(article.content)}</p>
                      {article.video_url && (
                        <div className="mt-6 w-full">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(
                              article.video_url
                            )}`}
                            title={article.title}
                            allowFullScreen
                            className="w-full aspect-video rounded-lg shadow"
                          ></iframe>
                        </div>
                      )}
                    </div>
                    <div className="lg:col-span-2">
                      {article.images && article.images.length > 0 && (
                        <div className="space-y-4">
                          {article.images.slice(0, 4).map((img, idx) =>
                            img.image_url ? (
                              <div key={idx} className="w-full">
                                <Image
                                  src={img.image_url}
                                  alt={`Article image ${idx + 1}`}
                                  width={500}
                                  height={500}
                                  className="w-full h-[9.88rem] object-cover rounded-lg border"
                                  style={{ aspectRatio: "1 / 1" }}
                                />
                              </div>
                            ) : null
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
