import Image from "next/image";
import Header from "@/components/custom/header";
import { fetchTripadvisorHotels } from "@/lib/api/tripadvisor";
import Footer from "@/components/custom/footer";

export default async function Listings() {
  let hotels = [];
  let error: string | null = null;

  try {
    hotels = await fetchTripadvisorHotels();
  } catch (err) {
    error = err + "Failed to load hotels.";
  }

  const hotelList = Array.isArray(hotels) ? hotels : [];

  return (
    <>
      <Header />
      <main className="w-full pt-20 min-h-screen bg-[#f1f1f1] pb-20">
        {/* Hero Section */}
        <section className="relative h-64 flex items-center justify-center overflow-hidden mb-10 rounded-b-3xl shadow-lg">
          <Image
            src="/images/bg_hero.webp"
            alt="Hotel Listings Hero"
            fill
            className="object-cover object-center brightness-[50%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c5461]/80 via-[#1c5461]/40 to-transparent z-10" />
          <div className="relative z-20 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl mb-3 tracking-tight">
              Hotel Listings
            </h1>
            <p className="text-lg md:text-xl text-[#e6f7fa] drop-shadow-md max-w-2xl mx-auto">
              Find the best places to stay in Bantayan Island
            </p>
          </div>
        </section>

        <section className="w-full max-w-7xl mx-auto px-4">
          {error ? (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-200 shadow">
              Error: {error}
            </div>
          ) : hotelList.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-white/80 rounded-xl shadow">
              No hotels found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotelList.map((hotel) => {
                const imageUrl =
                  hotel.photos && hotel.photos.length > 0
                    ? hotel.photos[0].images.large.url
                    : "/placeholder.jpg";
                return (
                  <div
                    key={hotel.location_id}
                    className="group bg-white/90 border border-[#e6f7fa] rounded-3xl shadow-lg hover:shadow-2xl hover:border-[#0da6ae] transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={imageUrl}
                        alt={hotel.name}
                        fill
                        className="object-cover rounded-t-3xl bg-[#a2c8d3] group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {/* Pill with hotel name */}
                      <div className="absolute left-4 bottom-4 z-10">
                        <span className="bg-[#e8babc] text-[#1c5461] font-semibold px-4 py-1 rounded-full shadow text-base">
                          {hotel.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div className="flex-1 flex flex-col items-start">
                        <div className="text-[#1c5461] text-base mb-2 font-semibold">
                          {hotel.address_obj?.address_string}
                        </div>
                        {hotel.rating && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[#0da6ae] font-bold">
                              {hotel.rating}
                            </span>
                            <span className="text-xs text-[#2eb1ab]">/ 5</span>
                          </div>
                        )}
                      </div>
                      <a
                        href={`https://www.tripadvisor.com.ph/Hotel_Review-d${hotel.location_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0da6ae] hover:bg-[#2eb1ab] text-white rounded-full font-semibold shadow transition text-center text-base"
                        tabIndex={0}
                      >
                        View on Tripadvisor
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
