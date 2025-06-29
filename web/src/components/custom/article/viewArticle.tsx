"use client";

import { Article } from "@/app/static/article/useArticleSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
}

export default function ViewArticle({ article }: { article: Article }) {
  if (!article) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-[#1c5461] text-center">
            {article.title}
          </CardTitle>
          <p className="text-sm text-[#3e979f] text-center">
            By {article.author}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 py-2">
          {article.thumbnail_url && (
            <div>
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                Thumbnail
              </Label>
              <div className="mt-2 flex justify-center">
                <img
                  src={article.thumbnail_url}
                  alt="Thumbnail"
                  className="rounded-lg max-h-64 object-contain border"
                />
              </div>
            </div>
          )}

          {article.video_url && (
            <div>
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                Video
              </Label>
              <div className="mt-2 flex justify-center">
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
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                Tags
              </Label>
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
            <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
              Status
            </Label>
            <p className="capitalize text-[#1c5461]">{article.status}</p>
          </div>

          <div>
            <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
              Featured
            </Label>
            <p className="text-[#1c5461]">
              {article.is_featured ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
              Content
            </Label>
            <div className="whitespace-pre-line text-[#1c5461]">
              {article.body}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
