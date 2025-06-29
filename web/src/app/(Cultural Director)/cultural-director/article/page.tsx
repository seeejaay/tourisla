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
  const [editDialogArticle, setEditDialogArticle] = useState<Article | null>(
    null
  );
  const [deleteDialogArticle, setDeleteDialogArticle] =
    useState<Article | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { loggedInUser } = useAuth();
  const { articles, fetchArticles, edit, remove, loading, error } =
    useArticleManager();

  const refreshArticles = async () => {
    await fetchArticles();
  };

  useEffect(() => {
    const init = async () => {
      try {
        const user = await loggedInUser(router);
        if (!user || user.data.user.role !== "Cultural Director") {
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
  }, [router, loggedInUser, fetchArticles]);

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
            Articles
          </h1>
          <p className="text-lg text-[#51702c] text-center">
            Manage informational articles and announcements.
          </p>
        </div>
        <div className="w-full flex flex-col items-end">
          <Button
            className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow"
            onClick={() => setAddDialogOpen(true)}
          >
            Add Article
          </Button>
        </div>
        {loading && (
          <div className="flex items-center gap-2 py-4">
            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3e979f]"></span>
            <span className="text-[#3e979f] font-medium">Loading...</span>
          </div>
        )}
        {error && (
          <div className="text-[#c0392b] bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-center w-full max-w-lg">
            {error}
          </div>
        )}

        {/* Display as cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="p-6 space-y-2 shadow-xl border border-[#e6f7fa] rounded-2xl bg-white flex flex-col"
            >
              <h2 className="font-semibold text-xl text-[#1c5461]">
                {article.title}
              </h2>
              <p className="text-sm text-[#3e979f]">By {article.author}</p>
              <div className="flex gap-2 mt-4 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#e6f7fa] text-[#1c5461] font-semibold"
                  onClick={() => setSelectedArticle(article)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold"
                  onClick={() => setEditDialogArticle(article)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="font-semibold"
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-2xl border-[#e6f7fa]">
          <DialogHeader>
            <DialogTitle className="text-[#1c5461]">
              Add New Article
            </DialogTitle>
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
      <Dialog
        open={!!selectedArticle}
        onOpenChange={() => setSelectedArticle(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-3xl flex flex-col rounded-2xl border-[#e6f7fa]">
          <DialogHeader>
            <DialogTitle className="text-[#1c5461]">View Article</DialogTitle>
            <DialogDescription>Article details</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            {selectedArticle && <ViewArticle article={selectedArticle} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editDialogArticle}
        onOpenChange={() => setEditDialogArticle(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl rounded-2xl border-[#e6f7fa]">
          <DialogHeader>
            <DialogTitle className="text-[#1c5461]">Edit Article</DialogTitle>
            <DialogDescription>Modify the article content</DialogDescription>
          </DialogHeader>
          {editDialogArticle && (
            <EditArticle
              article={editDialogArticle}
              onSave={async (updated: Article) => {
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
      <Dialog
        open={!!deleteDialogArticle}
        onOpenChange={() => setDeleteDialogArticle(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl border-[#e6f7fa]">
          <DialogHeader>
            <DialogTitle className="text-[#c0392b]">Delete Article</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {deleteDialogArticle && (
            <DeleteArticle
              article={deleteDialogArticle}
              onDelete={async (id) => {
                await remove(Number(id));
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
