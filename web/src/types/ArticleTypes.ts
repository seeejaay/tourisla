interface ArticleImage {
  id: number;
  image_url: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  images?: ArticleImage[];
  author: string;
  is_featured?: boolean;
  created_at: string;
  type?: string;
}

interface ArticlesSectionProps {
  articles: Article[];
}
export type { Article, ArticleImage, ArticlesSectionProps };
