"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Article } from "@/app/static/article/useArticleSchema";
import Image from "next/image";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";

export default function ArticleDetailPage() {
  const { id } = useParams();

  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
  }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}articles/${id}`
        );
        if (!res.ok) throw new Error("Article not found");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError("Error Occured: " + err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error || !article)
    return (
      <p className="text-center py-10 text-red-500">
        {error || "Article not found."}
      </p>
    );

  return (
    <>
      <Header />
      <div className="min-h-screen ">
        <main className="max-w-5xl mx-auto px-4 pt-32 pb-16">
          {/* Title over image if present */}
          {article.images &&
          article.images.length > 0 &&
          article.images[0].image_url ? (
            <div className="relative w-full h-64 flex items-center justify-center mb-8">
              <Image
                width={800}
                height={400}
                src={article.images[0].image_url}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white text-center bg-black/40 rounded-lg px-4">
                {article.title}
              </h1>
            </div>
          ) : (
            <h1 className="text-4xl font-extrabold text-[#1c5461] text-center mb-8">
              {article.title}
            </h1>
          )}

          {/* --- All Images Gallery --- */}
          {article.images && article.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 auto-rows-[160px]">
              {article.images.map(
                (img, idx) =>
                  img.image_url && (
                    <div
                      key={idx}
                      className={
                        // Example: make the first image span 2 columns and 2 rows on md+
                        idx === 0
                          ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2"
                          : // Example: make every 5th image span 2 rows
                          idx % 5 === 0
                          ? "row-span-2"
                          : ""
                      }
                    >
                      <Image
                        src={img.image_url}
                        alt={`Article image ${idx + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover rounded-lg border"
                        style={{ aspectRatio: "1 / 1" }}
                      />
                    </div>
                  )
              )}
            </div>
          )}

          {/* Author and tags */}
          <div className="mb-6">
            <p className="text-md text-[#1c5461] mb-2">
              Posted By:{" "}
              <span className="font-bold">{toTitleCase(article.author)}</span>
              <span className="text-gray-500">
                {" | " +
                  new Date(article.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </span>
            </p>
            {article.tags && (
              <div className="flex flex-wrap gap-2">
                {article.tags.split(",").map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[#e6f7fa] bg-[#1c5461] text-xs font-medium px-3 py-1 rounded-full capitalize"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <section className="mb-8">
            <div className=" text-gray-800 text-lg leading-relaxed  text-justify ">
              {toTitleCase(article.content)}
            </div>
          </section>
          {/* Video */}
          {article.video_url && (
            <div className="mb-8">
              <div className="w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    article.video_url
                  )}`}
                  title={article.title}
                  allowFullScreen
                  className="w-full aspect-video rounded-lg shadow"
                ></iframe>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
}
