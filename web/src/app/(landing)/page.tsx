"use client";

import { useEffect } from "react";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import Image from "next/image";
import { MapPin, Waves, Sun, TreePalm } from "lucide-react";
import { motion } from "framer-motion";
import useTripAdvisor from "@/hooks/useTripAdvisor";
import MapPage from "@/components/custom/map";
import AutoPlay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";

const images = [
  "/images/hero-carousel/1.jpg",
  "/images/hero-carousel/2.jpg",
  "/images/hero-carousel/3.jpg",
  "/images/hero-carousel/5.jpg",
  "/images/hero-carousel/11.webp",
  "/images/hero-carousel/13.jpg",
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
    bg: "bg-[#bbe1d0]",
    text: "text-[#04807e]",
  },
  {
    title: "Sun",
    description:
      "Bask in the golden sun on Bantayan's beautiful beaches, where relaxation meets adventure.",
    img: "/images/article_image.webp",
    icon: <Sun className="w-5 h-5 mr-2" />,
    cta: "Breathtaking Sunsets",
    href: "#sun",
    bg: "bg-[#ffece5]",
    text: "text-[#ae5b7d]",
  },
  {
    title: "Sand",
    description:
      "Feel the soft, powdery sand between your toes as you stroll along Bantayan's stunning beaches.",
    img: "/images/nature/DJI_0738.JPG",
    icon: <TreePalm className="w-5 h-5 mr-2" />,
    cta: "Powdery Shores",
    href: "#sand",
    bg: "bg-[#ce5f27]",
    text: "text-[#ffece5]",
  },
];

export default function Home() {
  const { hotels, loading, error } = useTripAdvisor();
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
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <Header />
      <main className="w-full min-h-screen bg-[#f1f1f1] text-[#1c5461] ">
        <section
          id="hero"
          className="min-h-screen flex flex-col justify-center items-center px-4 pt-24"
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
                        className="object-cover"
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
                  className="hidden md:block items-center bg-[#e6f7fa] text-[#1c5461] font-semibold rounded-full transition-colors duration-300 text-base md:text-lg lg:text-xl  px-4 md:px-6 py-3 md:py-4  inset-shadow-sm w-96 md:w-80 max-w-72 inset-shadow-gray-700"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPin className="inline w-5 h-5 mr-2" />
                  Explore Tourist Spots
                </motion.a>
              </div>
            </div>
          </div>
        </section>
        <section id="about-bantayan" className="pt-24">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
              <span className="text-[#04807e]">Sea</span>, <span> </span>
              <span className="text-[#ce5f27]">Sun</span>, and{" "}
              <span className="text-[#eba843]">Sand</span>: The Essence of
              Bantayan Island
            </h2>
            <div className="bg-[#1c5461] border-2 border-[#1c5461] w-24 mb-8" />
            <p className="text-lg text-center max-w-3xl mx-auto">
              Turquoise seas, golden sun, and powdery sands await. Experience
              Bantayan Island’s vibrant culture and warm hospitality.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 w-full">
              {/* Shared card style */}
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
        <section id="hotels" className="pt-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Recommended Hotels
            </h2>
            <div className="bg-[#1c5461] border-2 border-[#1c5461] w-24 mb-8 mx-auto" />
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
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
                        <Image
                          src={
                            hotel.photos?.[0]?.images.large.url ||
                            "/images/placeholder_hotel.jpg"
                          }
                          alt={hotel.name}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-xl font-semibold">
                            {hotel.name}
                          </h3>
                          <p className="text-gray-600 mt-2 flex-1">
                            {hotel.address_obj?.address_string}
                          </p>
                          <a
                            href={hotel.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-block bg-[#00aeac] text-white w-44 cursor-pointer rounded-full px-4 py-2 hover:brightness-110"
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

        {/* Bento Grid Section */}
        <section id="bento" className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Island Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-4">
              <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden shadow-lg h-[380px]">
                <Image
                  src={images[0]}
                  alt="Bento 1"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-lg h-[180px]">
                <Image
                  src={images[1]}
                  alt="Bento 2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden shadow-lg h-[380px]">
                <Image
                  src={images[2]}
                  alt="Bento 3"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-lg h-[180px]">
                <Image
                  src={images[3]}
                  alt="Bento 4"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-lg h-[180px]">
                <Image
                  src={images[4]}
                  alt="Bento 5"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden shadow-lg h-[180px]">
                <Image
                  src={images[5]}
                  alt="Bento 6"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="map" className="pt-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Explore Bantayan Island
            </h2>
            <div className="bg-[#1c5461] border-2 border-[#1c5461] w-24 mb-8 mx-auto" />
            <MapPage />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
