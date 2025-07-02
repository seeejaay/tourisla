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
          {/* Show all images if present */}
          {article.images && article.images.length > 0 && (
            <div>
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                Images
              </Label>
              <div className="flex flex-wrap gap-4 mt-2 justify-center">
                {article.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.image_url}
                    alt={`Article image ${idx + 1}`}
                    className="rounded-lg max-h-64 object-contain border"
                  />
                ))}
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
            <p className="capitalize text-[#1c5461]">
              {article.is_published ? "Published" : "Draft"}
            </p>
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
              Type
            </Label>
            <p className="text-[#1c5461]">{article.type}</p>
          </div>

          {article.barangay && (
            <div>
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                Barangay
              </Label>
              <p className="text-[#1c5461]">{article.barangay}</p>
            </div>
          )}

          {article.summary && (
            <div>
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                Summary
              </Label>
              <p className="text-[#1c5461]">{article.summary}</p>
            </div>
          )}

          <div>
            <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
              Content
            </Label>
            <div className="whitespace-pre-line text-[#1c5461]">
              {article.content}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
