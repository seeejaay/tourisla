"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Article } from "@/app/static/article/useArticleSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        ← Back
      </Button>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">
            {article.title}
          </CardTitle>
          <p className="text-sm text-gray-600">By {article.author}</p>
        </CardHeader>

        <CardContent className="space-y-6 pb-6">
          {article.thumbnail_url && (
            <div>
              <img
                src={article.thumbnail_url}
                alt={article.title}
                className="w-full max-h-[400px] object-contain rounded shadow"
              />
            </div>
          )}

          {article.video_url && (
            <div>
              <Label className="text-muted-foreground">Video</Label>
              <div className="mt-2">
                {article.video_url.includes("youtube.com") ||
                article.video_url.includes("youtu.be") ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(
                      article.video_url
                    )}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full max-w-[560px] h-[315px] rounded shadow"
                  />
                ) : (
                  <a
                    href={article.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Watch Video
                  </a>
                )}
              </div>
            </div>
          )}

          {article.tags && (
            <div>
              <Label className="text-muted-foreground">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {article.tags.split(",").map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label className="text-muted-foreground">Content</Label>
            <div className="whitespace-pre-line text-gray-800 text-base leading-relaxed">
              {article.body}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
}
