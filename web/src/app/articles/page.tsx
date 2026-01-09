import { fetchArticlesSSR } from "@/lib/api/articles";
import Header from "@/components/custom/Header";
import BannerHeader from "@/components/custom/BannerHeader";
import ArticlesPageSection from "@/components/custom/article/ArticlesPageSection";
import ArticlesListSection from "@/components/custom/article/ArticlesListSection";

export default async function Articles() {
  const articles = await fetchArticlesSSR();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f1f1f1]">
        <BannerHeader
          imageSrc="/images/nature/1.jpg"
          imageAlt="Articles Banner"
          title="Explore Our Articles"
          subtitle="Discover the latest news and stories"
        />

        <section className="w-full flex items-center justify-center">
          <ArticlesPageSection articles={articles} />
        </section>

        <section className="w-full flex items-center justify-center">
          <ArticlesListSection articles={articles} />
        </section>

        <footer>
          <p className="text-center text-sm text-gray-500">
            {`Fetched ${articles.length} articles (SSR)`}
          </p>
        </footer>
      </main>
    </>
  );
}
