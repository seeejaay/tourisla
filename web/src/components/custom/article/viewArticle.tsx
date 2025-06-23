"use client";

import { Article } from "@/app/static/article/useArticleSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ViewArticle({ article }: { article: Article }) {
  if (!article) return null;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-muted-foreground">Author</Label>
          <p>{article.author}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Published</Label>
          <p>{article.published_date} at {article.published_at}</p>
        </div>

        {article.thumbnail_url && (
          <div>
            <Label className="text-muted-foreground">Thumbnail</Label>
            <img src={article.thumbnail_url} alt="thumbnail" className="max-w-sm rounded" />
          </div>
        )}

        {article.video_url && (
          <div>
            <Label className="text-muted-foreground">Video</Label>
            <a href={article.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Watch Video
            </a>
          </div>
        )}

        <div>
          <Label className="text-muted-foreground">Tags</Label>
          <p>{article.tags || <span className="italic text-muted-foreground">None</span>}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Status</Label>
          <p>{article.status}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Featured</Label>
          <p>{article.is_featured ? "Yes" : "No"}</p>
        </div>

        <div>
          <Label className="text-muted-foreground">Content</Label>
          <div className="whitespace-pre-line">{article.body}</div>
        </div>
      </CardContent>
    </Card>
  );
}
