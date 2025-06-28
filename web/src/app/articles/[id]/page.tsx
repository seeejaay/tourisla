"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Article } from "@/app/static/article/useArticleSchema";
import Image from "next/image";
import Header from "@/components/custom/header";

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
      <div className="min-h-screen bg-gradient-to-b to-[#b6e0e4] via-[#f0f0f0] from-[#e6f7fa]">
        <main className="max-w-5xl mx-auto px-4 pt-32 pb-16">
          {/* Title over image if present */}
          {article.thumbnail_url ? (
            <div className="relative w-full h-64 flex items-center justify-center mb-8">
              <Image
                width={800}
                height={400}
                src={article.thumbnail_url}
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

          {/* Author and tags */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-[#1c5461] mb-2">
              {article.title}
            </h5>
            <p className="text-sm text-[#1c5461] mb-2">
              BY:{" "}
              <span className="font-bold">{toTitleCase(article.author)}</span>
            </p>
            {article.tags && (
              <div className="flex flex-wrap gap-2">
                {article.tags.split(",").map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#e6f7fa] text-[#3e979f] text-xs font-medium px-3 py-1 rounded-full capitalize"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

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

          {/* Content */}
          <section>
            <div className="whitespace-pre-line text-gray-800 text-lg leading-relaxed bg-[#f1f1f1] rounded-xl p-6 shadow-inner">
              {article.body}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
}
