"use client";

import { Article } from "@/app/static/article/useArticleSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ViewArticle({ article }: { article: Article }) {
  if (!article) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          {article.title}
        </CardTitle>
        <p className="text-sm text-gray-600">By {article.author}</p>
      </CardHeader>

      <CardContent className="space-y-6 pb-6">
        {article.thumbnail_url && (
          <div>
            <Label className="text-muted-foreground">Thumbnail</Label>
            <div className="mt-2">
              <img
                src={article.thumbnail_url}
                alt="Thumbnail"
                className="w-full max-w-[500px] max-h-[400px] rounded shadow object-contain"
              />
            </div>
          </div>
        )}

        {article.video_url && (
          <div>
            <Label className="text-muted-foreground">Video</Label>
            <a
              href={article.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Watch Video
            </a>
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
          <Label className="text-muted-foreground">Status</Label>
          <p className="capitalize">{article.status}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Featured</Label>
          <p>{article.is_featured ? "Yes" : "No"}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Content</Label>
          <div className="whitespace-pre-line text-gray-800">{article.body}</div>
        </div>
      </CardContent>
    </Card>
  );
}
