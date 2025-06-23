"use client";

import { Article } from "@/app/static/article/useArticleSchema";
import { Button } from "@/components/ui/button";

export default function DeleteArticle({
  article,
  onDelete,
  onCancel,
}: {
  article: Article;
  onDelete: (id: number | string) => void | Promise<void>;
  onCancel: () => void;
}) {
  const handleDelete = () => {
    if (article?.id !== undefined) {
      onDelete(article.id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-lg font-semibold">Are you sure?</h2>
      <p className="text-sm text-gray-500 text-center mt-2">
        This will permanently delete the article titled:
        <span className="font-bold"> “{article.title}”</span>
      </p>
      <div className="flex gap-4 mt-6">
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
