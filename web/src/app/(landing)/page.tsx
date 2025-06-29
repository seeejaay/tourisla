"use client";

import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MapPage from "@/components/custom/map";
import { Umbrella, MapPin, Leaf, Users, ArrowRight } from "lucide-react";
import { useArticleManager } from "@/hooks/useArticleManager";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const touristSpots = [
  {
    image: "/images/nature/sea.jpg",
  },
  {
    image: "/images/nature/sun.jpg",
  },
  {
    image: "/images/nature/sand.jpg",
  },
  {
    image: "/images/camp_sawi.webp",
  },
];

const faqs = [
  {
    question: "What is Tourisla?",
    answer:
      "Tourisla is a tourism platform for Bantayan Island, Cebu. It provides information about tourist spots, accommodations, local services, and helps you plan your perfect island getaway.",
  },
  {
    question: "How do I book accommodations on Bantayan Island?",
    answer:
      "You can browse available accommodations on Tourisla and contact them directly through the provided contact details. Some listings may also offer online booking links.",
  },
  {
    question: "Is there internet connection on Bantayan Island?",
    answer:
      "Internet connectivity is available in most towns and major resorts on Bantayan Island. However, connection may be limited or slower in remote areas and some beaches.",
  },
  {
    question: "How do I report issues or give feedback about Tourisla?",
    answer:
      "You can report issues or send feedback through the Contact section of the app or by emailing support@tourisla.com. We value your input to improve your experience.",
  },
  {
    question: "What activities can I do on Bantayan Island?",
    answer:
      "Bantayan Island offers a variety of activities including island hopping, swimming, snorkeling, biking, exploring historical sites, and enjoying local cuisine.",
  },
];

export default function Home() {
  const router = useRouter();
  const { articles, loading: loadingArticles } = useArticleManager();

  return (
    <>
      <Header />
      <main className="w-full bg-[#fffff1]">
        {/* Hero Section */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          <Image
            src="/images/bg_hero.webp"
            alt="Bantayan Island Aerial View"
            fill
            className="object-cover object-center brightness-[25%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c5461]/90 via-[#1c5461]/50 to-transparent z-10" />
          <div className="relative z-20 text-center px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl mb-6">
              Discover <span className="text-[#f0be2a]">Bantayan</span> Island
            </h1>
            <p className="text-xl md:text-2xl text-[#ddddd1] drop-shadow-md max-w-3xl mx-auto mb-10">
              Where emerald jungles meet turquoise waters in perfect harmony
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.push("/listings")}
                className="px-8 py-4 rounded-full bg-[#019375] hover:bg-[#017a60] text-white font-semibold shadow-lg hover:shadow-xl transition"
              >
                <Users className="inline w-5 h-5 mr-2" /> Explore Accommodation
              </button>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-24 text-center bg-gradient-to-b from-[#e6f7fa] via-[#fffff1] to-[#fffff1]">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1c5461] mb-4 drop-shadow">
              Your Island Escape Awaits
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#3e979f] to-[#1c5461] mx-auto mb-8 rounded-full" />
            <p className="text-xl text-[#51702c] mb-10 leading-relaxed">
              Immerse yourself in the breathtaking beauty of Bantayan
              Island—where crystal-clear waters, lush jungles, and vibrant local
              culture create the perfect getaway. Whether you seek adventure,
              relaxation, or a taste of authentic island life, Bantayan offers
              something for every traveler.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-8 mt-10">
              <div className="flex-1 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-[#e6f7fa] hover:scale-105 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Leaf className="w-8 h-8 text-[#019375]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1c5461] mb-2">
                  Eco-Friendly Adventures
                </h3>
                <p className="text-[#51702c] text-base">
                  Explore pristine beaches, hidden lagoons, and scenic trails
                  while supporting sustainable tourism and local communities.
                </p>
              </div>
              <div className="flex-1 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-[#e6f7fa] hover:scale-105 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-[#3e979f]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1c5461] mb-2">
                  Rich Culture & Heritage
                </h3>
                <p className="text-[#51702c] text-base">
                  Experience the warmth of Bantayan’s people, savor local
                  delicacies, and discover the island’s unique traditions and
                  history.
                </p>
              </div>
              <div className="flex-1 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-8 border border-[#e6f7fa] hover:scale-105 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Umbrella className="w-8 h-8 text-[#f8d56b]" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1c5461] mb-2">
                  Unwind & Reconnect
                </h3>
                <p className="text-[#51702c] text-base">
                  Find your sanctuary in tranquil resorts, enjoy breathtaking
                  sunsets, and reconnect with nature and yourself.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Map */}
        <section className="py-20 bg-[#f1f1f1]">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-4">
              Explore Our Island
            </h2>
            <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-6" />
            <p className="text-lg text-[#51702c] mb-12">
              Find your perfect spot with our interactive island map
            </p>
            <div className="relative h-[600px] w-full rounded-b-2xl overflow-hidden">
              <MapPage />
              <div className="absolute bottom-4 left-4 bg-[#f1f1f1] px-4 py-2 rounded-full shadow-md flex items-center border border-[#7b9997]/20">
                <MapPin className="w-4 h-4 text-[#3e979f] mr-2" />
                <span className="text-[#1c5461] font-medium">
                  Island Locations
                </span>
              </div>
            </div>
          </div>
        </section>
        {/* Tourist Spots Showcase */}
        <section className="py-20  bg-[#f1f1f1]">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-4">
              Must-See Tourist Spots
            </h2>
            <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-8 rounded-full" />
            <p className="text-lg text-[#51702c] mb-12">
              Discover the natural wonders and iconic destinations of Bantayan
              Island.
            </p>
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full mx-auto"
            >
              <CarouselContent>
                {touristSpots.map((spot, idx) => (
                  <CarouselItem
                    key={idx}
                    className="basis-full flex-shrink-0 w-full"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e6f7fa] hover:shadow-2xl transition-all h-[500px] flex items-end group bg-[#e6f7fa]">
                      <Image
                        src={spot.image}
                        alt={`Tourist Spot ${idx + 1}`}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        style={{ zIndex: 0 }}
                        priority={idx === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                      {/* Optionally add spot name/description here if available */}
                      {/* <div className="absolute bottom-6 left-6 z-20 text-left">
                        <h3 className="text-2xl font-bold text-white drop-shadow">
                          {spot.name}
                        </h3>
                        <p className="text-white/80">{spot.description}</p>
                      </div> */}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 -translate-y-1/2 top-1/2" />
              <CarouselNext className="right-0 -translate-y-1/2 top-1/2" />
            </Carousel>
          </div>
        </section>

        {/* Featured Articles */}
        <section className=" bg-[#fffff1] py-20 bg-gradient-to-b to-[#e6f7fa] via-[#fffff1] from-[#fffff1]">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-4">
              Island Heritage
            </h2>
            <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-6" />
            <p className="text-lg text-[#51702c] mb-12">
              Read the history, culture, and stories that shape Bantayan Island
            </p>
            {loadingArticles ? (
              <div className="text-[#3e979f]">Loading articles...</div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full mx-auto"
              >
                <CarouselContent>
                  {articles
                    .filter(
                      (article) => article.status?.toLowerCase() === "published"
                    )
                    .slice(0, 6)
                    .map((article) => (
                      <CarouselItem
                        key={article.id}
                        className="md:basis-1/3 basis-full flex-shrink-0 w-full"
                      >
                        <div className="group relative rounded-2xl overflow-hidden shadow-lg border border-[#7b9997]/20 hover:shadow-2xl transition-all flex flex-col h-[26rem] bg-white">
                          {article.thumbnail_url ? (
                            <Image
                              src={article.thumbnail_url}
                              alt={article.title}
                              fill
                              className="object-cover w-full h-full group-hover:scale-105 brightness-75 transition-transform duration-500"
                              style={{ zIndex: 0 }}
                            />
                          ) : (
                            <div className="absolute inset-0 h-full w-full bg-[#e6f7fa] flex items-center justify-center text-[#3e979f] z-0">
                              No Image
                            </div>
                          )}
                          {/* Overlay for dimming */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 transition group-hover:from-black/80" />
                          {/* Details on top of image */}
                          <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                            <h3 className="text-xl font-extrabold text-left text-white line-clamp-2 group-hover:text-[#f8d56b] transition drop-shadow mb-2">
                              {article.title}
                            </h3>
                            <p className="text-left text-[#e6f7fa] drop-shadow mb-4 line-clamp-2">
                              {article.body.slice(0, 30) + "..."}
                            </p>
                            <button
                              onClick={() =>
                                router.push(`/articles/${article.id}`)
                              }
                              className="mt-2 w-fit rounded-lg bg-[#3e979f] hover:bg-[#1c5461] cursor-pointer text-base text-[#e6f7fa] hover:text-[#f8d56b] px-5 py-2 font-semibold transition-all"
                            >
                              Read more{" "}
                              <ArrowRight className="inline w-4 h-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-y-1/2 top-1/2" />
                <CarouselNext className="right-0 -translate-y-1/2 top-1/2" />
              </Carousel>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-[#e6f7fa]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-8 rounded-full" />
            <Accordion
              type="single"
              collapsible
              className="space-y-4 text-left"
            >
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.question}
                  value={faq.question}
                  className="border border-[#e6f7fa] rounded-lg bg-white shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#1c5461]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-[#51702c] text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
