import { fetchArticlesSSR } from "@/lib/api/articles";
import Image from "next/image";
import NewHeader from "@/components/custom/header";
import ArticlesPageSection from "@/components/custom/article/ArticlesPageSection";

export default async function Articles() {
  // Ensure you get the array, not an object
  const articles = await fetchArticlesSSR();

  return (
    <>
      <NewHeader />
      <main className="min-h-screen bg-[#f1f1f1]">
        <header className="relative">
          <Image
            src="/images/nature/1.jpg"
            alt="Articles Banner"
            width={1920}
            height={800}
            className="w-full h-96 object-cover object-center brightness-[55%]"
            sizes="100vw"
          />
          <div className="absolute top-5 inset-0 flex items-center justify-center flex-col space-y-4">
            <h1 className="lg:text-5xl text-3xl font-extrabold text-gray-50 text-center drop-shadow-2xl">
              Kakyop, Sara Kag Bwas
            </h1>
            <p className="lg:text-xl text-lg text-gray-50 text-center font-semibold drop-shadow-2xl">
              Yesterday, Today, and Tomorrow
            </p>
          </div>
        </header>

        <section
          className="w-full border-red-500 border
        flex items-center justify-center"
        >
          <ArticlesPageSection articles={articles} />
        </section>

        <section className="text-center py-20 text-2xl text-gray-400">
          SSR Articles Page (UI coming next step)
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
