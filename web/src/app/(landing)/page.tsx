"use client";

import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MapPage from "@/components/custom/map";
import { Umbrella, MapPin, Leaf, TreePalm, ArrowRight } from "lucide-react";
import { useArticleManager } from "@/hooks/useArticleManager";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { useTripAdvisor } from "@/hooks/useTripAdvisor";
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
import { useEffect } from "react";

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
      "You can report issues or send feedback by emailing tour.isla2025@gmail.com We value your input to improve your experience.",
  },
  {
    question: "What activities can I do on Bantayan Island?",
    answer:
      "Bantayan Island offers a variety of activities including island hopping, swimming, snorkeling, biking, exploring historical sites, and enjoying local cuisine.",
  },
  {
    question: "What are the Rules and Regulations for Tourists?",
    answer: (
      <>
        Tourists are expected to respect local customs and the environment.
        Please follow guidelines for waste disposal, noise levels, and
        interactions with wildlife. For detailed rules, refer to our{" "}
        <a
          href="/rules-and-regulations"
          className="text-[#3e979f] underline hover:text-[#1c5461]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rules and Regulations
        </a>
        .
      </>
    ),
  },
  {
    question: "How do you handle user data and privacy?",
    answer: (
      <>
        We take user privacy seriously. Tourisla collects only necessary data to
        provide services and improve user experience. For more details, please
        refer to our{" "}
        <a
          href="/privacy-policy"
          className="text-[#3e979f] underline hover:text-[#1c5461]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        .
      </>
    ),
  },
];

export default function Home() {
  const router = useRouter();
  const { articles, loading: loadingArticles } = useArticleManager();
  const { hotels, loading: loadingTripAdvisor } = useTripAdvisor();
  // Tourist Spot Manager
  const {
    touristSpots,
    loading: loadingTouristSpots,
    fetchTouristSpots,
  } = useTouristSpotManager();

  useEffect(() => {
    fetchTouristSpots();
  }, [fetchTouristSpots]);

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
                onClick={() => {
                  const aboutSection =
                    document.getElementById("about-bantayan");
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-4 rounded-full bg-[#019375] hover:bg-[#017a60] text-white font-semibold shadow-lg hover:shadow-xl transition cursor-pointer"
              >
                <MapPin className="inline w-5 h-5 mr-2" /> About Bantayan
              </button>
              <button
                onClick={() => {
                  const aboutSection = document.getElementById("tourist-spots");
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-8 py-4 rounded-full bg-[#019375] hover:bg-[#017a60] text-white font-semibold shadow-lg hover:shadow-xl transition cursor-pointer"
              >
                <TreePalm className="inline w-5 h-5 mr-2" /> Explore Tourist
                Spots
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

        {/* About Bantayan Section */}
        <section className="py-20 bg-[#f1f1f1]" id="about-bantayan">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1c5461] mb-4 drop-shadow">
              About Bantayan Island
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#3e979f] to-[#1c5461] mx-auto mb-8 rounded-full" />
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <Image
                  src="/images/Bantayan_Map.webp"
                  alt="About Bantayan Island"
                  width={500}
                  height={400}
                  className="rounded-2xl shadow-lg object-cover w-full h-[600px]"
                />
              </div>
              <div className="flex-1 text-left md:text-lg text-[#51702c]">
                <p className="mb-4">
                  Bantayan Island is a tropical paradise located off the
                  northern coast of Cebu, Philippines. Known for its powdery
                  white sand beaches, crystal-clear waters, and laid-back
                  atmosphere, Bantayan is a favorite destination for both local
                  and international travelers.
                </p>
                <p className="mb-4">
                  The island is rich in history and culture, with vibrant
                  festivals, friendly locals, and a unique blend of Spanish and
                  Filipino heritage. Whether you’re seeking adventure,
                  relaxation, or a taste of island life, Bantayan offers
                  something for everyone.
                </p>
                <p className="mb-4">
                  Explore its charming towns, savor fresh seafood, and
                  experience unforgettable sunsets—Bantayan Island is truly a
                  gem waiting to be discovered.
                </p>
                <p className="mb-4">
                  Bantayan is composed of three municipalities: Bantayan,
                  Madridejos, and Santa Fe. Each offers its own unique
                  attractions, from historical churches and bustling markets to
                  serene beaches and vibrant marine sanctuaries.
                </p>
                <p>
                  With its welcoming community, eco-friendly initiatives, and
                  breathtaking natural beauty, Bantayan Island stands out as one
                  of the Philippines’ most beloved destinations. Whether you’re
                  traveling solo, as a couple, or with family and friends,
                  Bantayan promises memories that will last a lifetime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tourist Spots Showcase (Dynamic) */}
        <section className="py-20 bg-[#f1f1f1]" id="tourist-spots">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-4">
              Must-See Tourist Spots
            </h2>
            <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-8 rounded-full" />
            <p className="text-lg text-[#51702c] mb-12">
              Discover the natural wonders and iconic destinations of Bantayan
              Island.
            </p>
            <div className="flex flex-row justify-between items-center pb-5 ">
              <span className=" px-4 py-2 rounded-full bg-[#3e979f]/10 text-[#3e979f] font-bold text-sm  uppercase">
                Tourist Spots
              </span>
              <button
                onClick={() => (window.location.href = "/tourist-spots")}
                className="flex flex-row px-4 py-2 rounded-full bg-[#3e979f]/10 text-[#3e979f] font-bold text-sm  uppercase cursor-pointer hover:bg-[#3e979f]/20 transition-all"
              >
                See more tourist spots
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            {loadingTouristSpots ? (
              <div className="text-[#3e979f]">Loading tourist spots...</div>
            ) : (
              <Carousel
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full mx-auto"
              >
                <CarouselContent>
                  {touristSpots.length > 0 ? (
                    touristSpots.flatMap((spot, idx) =>
                      (spot.images && spot.images.length > 0
                        ? spot.images
                        : [null]
                      ).map((img, imgIdx) => (
                        <CarouselItem
                          key={`${spot.id}-${img?.id ?? imgIdx}`}
                          className="basis-full flex-shrink-0 w-full "
                        >
                          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e6f7fa] hover:shadow-2xl transition-all h-[500px] flex items-end group bg-[#e6f7fa]">
                            {img && img.image_url ? (
                              <Image
                                src={img.image_url}
                                alt={spot.name || `Tourist Spot`}
                                fill
                                className="object-cover w-full h-full group-hover:scale-105 hover:text-[#f8d56b] transition-transform duration-500"
                                style={{ zIndex: 0 }}
                                priority={idx === 0 && imgIdx === 0}
                              />
                            ) : (
                              <div className="absolute inset-0 h-full w-full bg-[#e6f7fa] flex items-center justify-center text-[#3e979f] z-0">
                                No Image
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                            <div className="absolute bottom-6 left-6 z-20 text-left">
                              <h3 className="text-2xl font-bold text-white drop-shadow  transition mb-2">
                                {spot.name}
                              </h3>
                              {spot.description && (
                                <p className="text-white/80 line-clamp-2 max-w-md">
                                  {spot.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CarouselItem>
                      ))
                    )
                  ) : (
                    <CarouselItem className="basis-full flex-shrink-0 w-full">
                      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e6f7fa] h-[500px] flex items-center justify-center bg-[#e6f7fa]">
                        <span className="text-[#3e979f] text-xl font-semibold">
                          No tourist spots available.
                        </span>
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-y-1/2 top-1/2" />
                <CarouselNext className="right-0 -translate-y-1/2 top-1/2" />
              </Carousel>
            )}
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

        {/* Accommodation Section */}
        <section className="py-20 bg-[#f1f1f1]">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1c5461] mb-4">
              Top-Rated Accommodations
            </h2>
            <div className="w-24 h-1 bg-[#3e979f] mx-auto mb-8 rounded-full" />
            <p className="text-lg text-[#51702c] mb-12">
              Find the best places to stay on Bantayan Island, as rated by
              travelers.
            </p>
            <div className="flex flex-row justify-between items-center pb-5">
              <span className="px-4 py-2 rounded-full bg-[#3e979f]/10 text-[#3e979f] font-bold text-sm uppercase">
                Accommodations
              </span>
              <button
                onClick={() => (window.location.href = "/listings")}
                className="flex flex-row px-4 py-2 rounded-full bg-[#3e979f]/10 text-[#3e979f] font-bold text-sm uppercase cursor-pointer hover:bg-[#3e979f]/20 transition-all"
              >
                See more accommodations
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            {loadingTripAdvisor ? (
              <div className="text-[#3e979f]">Loading accommodations...</div>
            ) : (
              <Carousel
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full mx-auto"
              >
                <CarouselContent>
                  {hotels.length > 0 ? (
                    hotels.map((hotel, idx) => (
                      <CarouselItem
                        key={hotel.location_id}
                        className="basis-full flex-shrink-0 w-full"
                      >
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e6f7fa] hover:shadow-2xl transition-all h-[500px] flex items-end group bg-[#e6f7fa]">
                          {hotel.photos &&
                          hotel.photos.length > 0 &&
                          hotel.photos[0].images.large.url ? (
                            <Image
                              src={hotel.photos[0].images.large.url}
                              alt={hotel.name}
                              fill
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                              style={{ zIndex: 0 }}
                              priority={idx === 0}
                            />
                          ) : (
                            <div className="absolute inset-0 h-full w-full bg-[#e6f7fa] flex items-center justify-center text-[#3e979f] z-0">
                              No Image
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                          <div className="absolute bottom-6 left-6 z-20 text-left">
                            <h3 className="text-2xl font-bold text-white drop-shadow mb-2">
                              {hotel.name}
                            </h3>
                            <p className="text-white/80 text-base mb-1">
                              {hotel.address_obj?.address_string}
                            </p>
                            <a
                              href={`https://www.tripadvisor.com.ph/Hotel_Review-d${hotel.location_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-2 px-4 py-2 rounded-full bg-[#3e979f] text-white font-semibold text-sm hover:bg-[#1c5461] transition cursor-pointer"
                            >
                              View on TripAdvisor
                            </a>
                          </div>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem className="basis-full flex-shrink-0 w-full">
                      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#e6f7fa] h-[500px] flex items-center justify-center bg-[#e6f7fa]">
                        <span className="text-[#3e979f] text-xl font-semibold">
                          No accommodations found.
                        </span>
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-y-1/2 top-1/2" />
                <CarouselNext className="right-0 -translate-y-1/2 top-1/2" />
              </Carousel>
            )}
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
