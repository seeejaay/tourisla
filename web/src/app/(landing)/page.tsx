import Image from "next/image";
import Header from "@/components/custom/Header";
import cardData from "@/app/static/landing-card";
import { fetchArticlesSSR } from "@/lib/api/articles";
import HeroSection from "@/components/custom/HeroSection";
import { fetchTouristSpotsSSR } from "@/lib/api/touristSpot"; // Import the SSR function
import { fetchTripAdvisorHotelSSR } from "@/lib/api/tripadvisor";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import HotelsSection from "@/components/custom/landing/HotelSection";
import ArticlesSection from "@/components/custom/landing/ArticlesSection";
import TouristSpotSection from "@/components/custom/landing/TouristSpotSection";

export default async function Home() {
  const [articles, touristSpots, hotels] = await Promise.all([
    fetchArticlesSSR(),
    fetchTouristSpotsSSR(),
    fetchTripAdvisorHotelSSR(),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center w-full bg-gray-50">
        <div>
          <div className="container w-full lg:mt-10 mt-4 px-4 lg:py-16 py-8">
            <HeroSection />
            <section
              className="lg:py-44 lg:mt-20 py-4 mt-8"
              id="essence-section"
            >
              <header className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl text-neutral-800 font-bold mb-4">
                  Essence of Bantayan Island
                </h2>
                <p className="max-w-2xl text-gray-400 font-medium text-lg mx-auto leading-relaxed">
                  Turquoise seas, golden sun, and powdery sands await.
                  Experience Bantayan Island&apos;s vibrant culture and warm
                  hospitality.
                </p>
              </header>
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto lg:gap-20 gap-6">
                  {cardData.map((card, index) => (
                    <Card
                      key={index}
                      className="flex flex-col h-full pt-0 shadow-sm border-none bg-gray-50 hover:shadow-md transition-shadow duration-300"
                    >
                      <CardHeader className="p-4">
                        <div className="max-w-sm overflow-hidden rounded-lg">
                          <Image
                            src={card.img}
                            alt={card.title}
                            className="object-cover"
                            width={1000}
                            height={225}
                            priority
                          />
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-center text-xl mb-2">
                            {card.title}
                          </h4>
                          <p className="text-sm font-medium text-center text-gray-600 leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        <ArticlesSection articles={articles} />
        <TouristSpotSection touristSpots={touristSpots} />
        <HotelsSection hotels={hotels} />
      </main>
    </>
  );
}
