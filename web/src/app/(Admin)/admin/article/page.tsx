// page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useArticleManager } from "@/hooks/useArticleManager";
import { Article } from "@/app/static/article/useArticleSchema";

import AddArticle from "@/components/custom/article/addArticle";
import EditArticle from "@/components/custom/article/editArticle";
import ViewArticle from "@/components/custom/article/viewArticle";
import DeleteArticle from "@/components/custom/article/deleteArticle";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ArticleAdminPage() {
  const router = useRouter();

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editDialogArticle, setEditDialogArticle] = useState<Article | null>(null);
  const [deleteDialogArticle, setDeleteDialogArticle] = useState<Article | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { loggedInUser } = useAuth();
  const {
    articles,
    fetchArticles,
    add,
    edit,
    remove,
    loading,
    error,
  } = useArticleManager();

  const refreshArticles = async () => {
    await fetchArticles();
  };

  useEffect(() => {
    const init = async () => {
      try {
        const user = await loggedInUser(router);
        if (!user || user.data.user.role !== "Admin") {
          router.replace("/");
          return;
        }
        await fetchArticles();
      } catch (err) {
        console.error("Failed to fetch user or articles", err);
        router.replace("/");
      }
    };
    init();
  }, [router, loggedInUser]);

  return (
    <main className="flex flex-col items-center justify-start min-h-screen gap-8 w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 pb-20">
      <div className="flex flex-col w-full max-w-6xl gap-4 pt-8">
        <h1 className="text-4xl font-bold text-center text-blue-700">
          Articles
        </h1>
        <p className="text-center text-gray-600">
          Manage informational articles and announcements.
        </p>

        <div className="flex justify-end">
          <Button onClick={() => setAddDialogOpen(true)}>Add Article</Button>
        </div>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Display as cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="p-4 space-y-2 shadow-md border">
              <h2 className="font-semibold text-xl">{article.title}</h2>
              <p className="text-sm text-gray-600">By {article.author}</p>
              <div className="flex gap-2 mt-4 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedArticle(article)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={() => setEditDialogArticle(article)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteDialogArticle(article)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Article</DialogTitle>
            <DialogDescription>
              Fill in the form to publish a new article.
            </DialogDescription>
          </DialogHeader>
          <AddArticle
            currentUser={"admin"}
            onSuccess={() => {
              refreshArticles();
              setAddDialogOpen(false);
            }}
            onCancel={() => setAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-3xl flex flex-col">
          <DialogHeader>
            <DialogTitle>View Article</DialogTitle>
            <DialogDescription>Article details</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            {selectedArticle && <ViewArticle article={selectedArticle} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialogArticle} onOpenChange={() => setEditDialogArticle(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>Modify the article content</DialogDescription>
          </DialogHeader>
          {editDialogArticle && (
            <EditArticle
              article={editDialogArticle}
              onSave={async (updated) => {
                await edit(updated.id!, updated);
                await refreshArticles();
                setEditDialogArticle(null);
              }}
              onCancel={() => setEditDialogArticle(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialogArticle} onOpenChange={() => setDeleteDialogArticle(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteDialogArticle && (
            <DeleteArticle
              article={deleteDialogArticle}
              onDelete={async (id) => {
                await remove(id);
                await refreshArticles();
                setDeleteDialogArticle(null);
              }}
              onCancel={() => setDeleteDialogArticle(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
