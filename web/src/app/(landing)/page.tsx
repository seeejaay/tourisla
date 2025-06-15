"use client";

import Header from "@/components/custom/header";
import Image from "next/image";
import { useRouter } from "next/navigation";
const destinations = [
  {
    title: "Sea",
    description: "Relax on pristine beaches and swim in crystal-clear waters.",
    image: "/images/nature/sea.jpg",
    alt: "Beach",
  },
  {
    title: "Sun",
    description: "Enjoy breathtaking views and warm, sunny adventures.",
    image: "/images/nature/sun.jpg",
    alt: "Mountain",
  },
  {
    title: "Sand",
    description: "Discover tranquil spots and nature's hidden treasures.",
    image: "/images/nature/sand.jpg",
    alt: "Waterfall",
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Header />
      <div className="relative flex w-full min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100">
        <main className="flex-1 transition-opacity duration-300 ">
          <div className="flex flex-col items-center justify-center w-full">
            <section className="text-center max-w-xl px-4 py-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400 mb-4 tracking-tight">
                TourIsla
              </h1>
              <p className="text-lg text-gray-500 mb-10 font-light">
                Discover the beauty of the islands. Plan your next adventure
                with us!
              </p>
              <a
                onClick={() => router.push("/listings")}
                className="inline-block px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow transition"
              >
                Explore Now
              </a>
            </section>

            <section
              id="explore"
              className="w-full max-w-6xl px-4 flex flex-col items-center pb-12"
            >
              <h2 className="text-2xl font-semibold text-blue-700 mb-8 tracking-tight">
                Featured Destinations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
                {destinations.map((dest) => (
                  <div
                    key={dest.title}
                    className="bg-white/90 backdrop-blur rounded-3xl shadow-lg p-8 flex flex-col items-center border border-blue-100 hover:shadow-2xl hover:-translate-y-2 transition-all group"
                  >
                    <div className="relative mb-5">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 via-blue-200 to-yellow-200 blur-lg opacity-60 scale-110 group-hover:opacity-90 group-hover:scale-125 transition-all z-0" />
                      <Image
                        width={128}
                        height={128}
                        src={dest.image}
                        alt={dest.alt}
                        className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl relative z-10 group-hover:scale-105 group-hover:shadow-2xl transition-all"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-blue-800 drop-shadow">
                      {dest.title}
                    </h3>
                    <p className="text-gray-600 text-center text-base font-light">
                      {dest.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
