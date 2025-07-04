"use client";

import { useEffect } from "react";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import Image from "next/image";
import { MapPin, Waves, Sun, TreePalm, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import useTripAdvisor from "@/hooks/useTripAdvisor";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import MapPage from "@/components/custom/map";
import AutoPlay from "embla-carousel-autoplay";
import { useArticleManager } from "@/hooks/useArticleManager";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";
import Link from "next/link";

const images = [
  "/images/hero-carousel/4.jpg",
  "/images/hero-carousel/1.jpg",
  "/images/hero-carousel/9.jpg",
  "/images/hero-carousel/3.jpg",
  "/images/hero-carousel/13.jpg",
  "/images/hero-carousel/5.jpg",
  "/images/hero-carousel/8.jpg",
  "/images/hero-carousel/7.jpg",
  "/images/hero-carousel/10.jpg",
  "/images/hero-carousel/11.webp",
];

const cardData = [
  {
    title: "Sea",
    description:
      "Experience the thrill of snorkeling, diving, and exploring the vibrant marine life of Bantayan's waters.",
    img: "/images/nature/DJI_1231.JPG",
    icon: <Waves className="w-5 h-5 mr-2" />,
    cta: "Crystal Clear Waters",
    href: "#sea",
    bg: "bg-[#00bdd0]",
    text: "text-[#1c5461]",
  },
  {
    title: "Sun",
    description:
      "Bask in the golden sun on Bantayan's beautiful beaches, where relaxation meets adventure.",
    img: "/images/article_image.webp",
    icon: <Sun className="w-5 h-5 mr-2" />,
    cta: "Breathtaking Sunsets",
    href: "#sun",
    bg: "bg-[#ffd0ca]",
    text: "text-[#ce5f27]",
  },
  {
    title: "Sand",
    description:
      "Feel the soft, powdery sand between your toes as you stroll along Bantayan's stunning beaches.",
    img: "/images/nature/DJI_0738.JPG",
    icon: <TreePalm className="w-5 h-5 mr-2" />,
    cta: "Powdery Shores",
    href: "#sand",
    bg: "bg-[#fecfa1]",
    text: "text-[#1c5461]",
  },
];

export default function Home() {
  const { hotels, loading, error } = useTripAdvisor();
  const { articles, loading: articlesLoading } = useArticleManager();
  const {
    touristSpots,
    loading: spotsLoading,
    error: spotsError,
    fetchTouristSpots,
  } = useTouristSpotManager();
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  const shuffledArticles = shuffleArray(articles).slice(0, 7);

  const gridClasses = [
    "col-span-2 row-span-2 h-[380px]",
    "col-span-1 row-span-1 h-[180px]",
    "col-span-1 row-span-2 h-[380px]",
    "col-span-1 row-span-1 h-[180px]",
    "col-span-1 row-span-1 h-[180px]",
    "col-span-2 row-span-1 h-[180px]",
    "col-span-1 row-span-1 h-[180px]",
  ];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Find the closest anchor in case an inner element is clicked
      const anchor = target.closest("a");
      if (anchor && anchor.getAttribute("href")?.startsWith("#")) {
        const id = anchor.getAttribute("href")!.slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    document.addEventListener("click", handleClick);
    fetchTouristSpots();
    return () => document.removeEventListener("click", handleClick);
  }, [fetchTouristSpots]);

  return (
    <>
      <Header />
      <main className="w-full min-h-screen bg-[#f1f1f1] text-[#1c5461]">
        {/* HERO SECTION */}
        <section
          id="hero"
          className="min-h-screen flex flex-col justify-center items-center px-4 pt-24 "
        >
          <div className="h-[80vh] w-full flex flex-col items-center justify-center mx-auto relative rounded-2xl overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                AutoPlay({
                  delay: 3000,
                  stopOnInteraction: false,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {images.map((src, index) => (
                  <CarouselItem key={index} className="basis-full">
                    <div className="relative min-h-screen w-full overflow-hidden rounded-xl shadow-lg">
                      <Image
                        src={src}
                        alt={`Scenery ${index + 1}`}
                        quality={100}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1) 70%, rgba(0,0,0,0))",
              }}
            />
            <div className="header absolute top-0 left-0 w-full h-full flex flex-col items-start justify-end space-y-4 md:space-y-6 text-white  md:p-8  md:pb-20 pb-6 lg:pb-16 px-4 md:px-12 lg:px-24">
              <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold text-left md:text-center italic">
                Bantayan Island
              </h1>
              <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 items-center justify-around md:items-start w-full">
                <div className="w-full ">
                  <p className="text-base md:text-2xl lg:text-3xl font-semibold max-w-2xl  text-left">
                    Discover the hidden gem of the Philippines with pristine
                    beaches, vibrant culture, and unforgettable adventures.
                  </p>
                </div>
                <motion.a
                  href="#about-bantayan"
                  className="hidden md:block items-center bg-[#1c8773] text-[#f1f1f1] font-semibold rounded-md transition-colors duration-300 text-base md:text-lg lg:text-xl  px-4 md:px-6 py-3 md:py-4   w-96 md:w-72 text-center max-w-72 "
                  whileHover={{ filter: "brightness(1.1)", scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPin className="inline w-5 h-5 mr-2" />
                  Explore Bantayan
                </motion.a>
              </div>
            </div>
          </div>
        </section>
        {/* ABOUT SECTION */}
        <section id="about-bantayan" className="pt-28 ">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
              <span className="text-[#00bdd0]">Sea</span>, <span> </span>
              <span className="text-[#ce5f27]">Sun</span>, and{" "}
              <span className="text-[#bda156]">Sand</span>: The Essence of
              Bantayan Island
            </h2>
            <div className="bg-[#1c8773] border-2 border-[#1c8773] w-24 mb-8" />
            <p className="text-lg text-center max-w-3xl mx-auto">
              Turquoise seas, golden sun, and powdery sands await. Experience
              Bantayan Island’s vibrant culture and warm hospitality.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 w-full">
              {cardData.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, rotate: 0.5 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="relative group rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] cursor-pointer bg-black"
                >
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex-col px-6 text-center">
                    <h3 className="text-white text-2xl font-bold drop-shadow-md">
                      {card.title}
                    </h3>
                    <p className="text-white mt-2 text-base drop-shadow-sm">
                      {card.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="absolute bottom-4 left-4">
                    <motion.a
                      href={card.href}
                      className={`inline-flex items-center ${card.bg} ${card.text} font-semibold rounded-full transition-all duration-300 text-base md:text-lg px-4 py-2 shadow-md hover:shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {card.icon}
                      {card.cta}
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Grid Section */}
        <section id="bento" className="py-28 ">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                Explore the Rich Heritage of Bantayan Island
              </h2>
              <div className="bg-[#1c8773] border-2 border-[#1c8773] w-24 mb-8" />
              <p className="text-lg text-center max-w-3xl mx-auto">
                Discover Bantayan Island&apos;s rich heritage through its
                vibrant culture, stunning landscapes, and warm hospitality. From
                pristine beaches to historical landmarks, every corner tells a
                story waiting to be explored.
              </p>
            </div>
            {articlesLoading ? (
              <div className="text-center text-[#1c5461]">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-4">
                {shuffledArticles.map((article, idx) => {
                  const imageUrl = article.images[0].image_url;
                  return (
                    <a
                      key={article.id}
                      href={`/articles/${article.id}`}
                      className={`relative rounded-2xl overflow-hidden shadow-lg group ${
                        gridClasses[idx] || "col-span-1 row-span-1 h-[180px]"
                      }`}
                    >
                      <Image
                        src={imageUrl || "/images/placeholder_hotel.png"}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {/* Pill with article title */}
                      <div className="absolute left-4 bottom-4 z-10">
                        <span className="bg-[#2a7b8d]  shadow-lg text-[#f1f1f1] font-semibold px-4 py-1 rounded-full  text-base">
                          {article.title.length > 20
                            ? article.title.slice(0, 20) + "…"
                            : article.title}
                        </span>
                      </div>
                      {/* Optional: Overlay on hover */}
                      <div className="absolute inset-0 bg-[#2a7b8d]/[20%] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <span className="bg-[#2a7b8d] shadow-lg text-white font-semibold rounded-full px-6 py-3 ">
                          View Article
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        {/* Tourist Spot Section */}
        <section id="touristspot" className="pt-24 ">
          <div className="max-w-7xl mx-auto px-4 flex flex-col  items-start">
            <div className="flex flex-row w-full  justify-between items-center mb-8">
              <h2 className="text-xl md:text-3xl font-bold text-left ">
                Recommended Tourist Spots
              </h2>
              <Link
                className="bg-[#0da6ae] text-[#f1f1f1] flex items-center justify-center font-semibold rounded-md text-center px-4 py-1 transition-all  duration-300 text-base hover:scale-105 hover:shadow-md"
                href="/tourist-spots"
              >
                View All
                <ChevronRight className="inline w-5 h-5 ml-2" />
              </Link>
            </div>

            <div className="bg-[#1c8773] border-2 border-[#1c8773] w-24 mb-8 " />
            {spotsLoading ? (
              <p className="text-center text-lg">Loading tourist spots...</p>
            ) : spotsError ? (
              <p className="text-red-500 text-center">{spotsError}</p>
            ) : touristSpots.length === 0 ? (
              <p className="text-center text-gray-500">
                No tourist spots found.
              </p>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[
                  AutoPlay({
                    delay: 4000,
                    stopOnInteraction: false,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent>
                  {touristSpots.map((spot) => (
                    <CarouselItem
                      key={spot.id}
                      className="md:basis-1/2 basis-full"
                    >
                      <div className="relative group rounded-lg shadow-lg overflow-hidden h-64 w-full">
                        <Image
                          src={
                            spot.images?.[0]?.image_url ||
                            "/images/placeholder_hotel.png"
                          }
                          alt={spot.name}
                          fill
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {/* Pill box with spot name */}
                        <div className="absolute left-4 bottom-4 z-10">
                          <span className="bg-[#e8babc] text-[#1c5461] font-semibold px-4 py-1 rounded-full shadow text-base">
                            {spot.name}
                          </span>
                        </div>
                        {/* Hover overlay with View button */}
                        <div className="absolute inset-0 bg-[#a2c8d3]/[20%] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                          <a
                            href={`/tourist-spots/${spot.id}`}
                            className="bg-[#2eb1ab] text-white font-semibold rounded-full px-6 py-3 shadow-lg hover:brightness-110 transition"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}
          </div>
        </section>

        {/* HOTELS SECTION */}
        <section id="hotels" className="pt-24 ">
          <div className="max-w-7xl mx-auto px-4 flex flex-col  items-start">
            <div className="flex flex-row w-full  justify-between items-center mb-8">
              <h2 className="text-xl md:text-3xl font-bold text-left ">
                Recommended Hotels
              </h2>
              <Link
                className="bg-[#0da6ae] text-[#f1f1f1] flex items-center justify-center font-semibold rounded-md text-center px-4 py-1 transition-all  duration-300 text-base hover:scale-105 hover:shadow-md"
                href="/listings"
              >
                View All
                <ChevronRight className="inline w-5 h-5 ml-2" />
              </Link>
            </div>

            <div className="bg-[#1c8773] border-2 border-[#1c8773] w-24 mb-8 " />
            {loading ? (
              <p className="text-center text-lg">Loading hotels...</p>
            ) : error ? (
              <p className="text-red-500 text-center">{error.message}</p>
            ) : hotels.length === 0 ? (
              <p className="text-center text-gray-500">No hotels found.</p>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                plugins={[
                  AutoPlay({
                    delay: 4000,
                    stopOnInteraction: false,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent>
                  {hotels.map((hotel) => (
                    <CarouselItem
                      key={hotel.location_id}
                      className="md:basis-1/3 basis-full"
                    >
                      <div className="relative group rounded-lg shadow-lg overflow-hidden h-64 w-full">
                        <Image
                          src={
                            hotel.photos?.[0]?.images.large.url ||
                            "/images/placeholder_hotel.png"
                          }
                          alt={hotel.name}
                          fill
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {/* Pill box with hotel name */}
                        <div className="absolute left-4 bottom-4 z-10">
                          <span className="bg-[#e8babc] text-[#1c5461] font-semibold px-4 py-1 rounded-full shadow text-base">
                            {hotel.name}
                          </span>
                        </div>
                        {/* Hover overlay with Tripadvisor button */}
                        <div className="absolute inset-0 bg-[#a2c8d3]/[20%] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                          <a
                            href={`https://www.tripadvisor.com.ph/Hotel_Review-d${hotel.location_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#2eb1ab] text-white font-semibold rounded-full px-6 py-3 shadow-lg hover:brightness-110 transition"
                          >
                            View on Tripadvisor
                          </a>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            )}
          </div>
        </section>

        {/* MAP SECTION */}
        <section id="map" className="pt-24 ">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4 text-[#1c5461]">
              Explore Bantayan Island
            </h2>
            <div className="bg-[#1c8773] border-2 border-[#1c8773] w-24 mb-8 mx-auto" />
            <MapPage />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
