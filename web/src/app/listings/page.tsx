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
      <main className="w-full pt-20 min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#fffff1] to-[#b6e0e4] pb-20">
        {/* Hero Section */}
        <section className="relative h-64 flex items-center justify-center overflow-hidden mb-10">
          <Image
            src="/images/bg_hero.webp"
            alt="Hotel Listings Hero"
            fill
            className="object-cover object-center brightness-[40%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c5461]/80 via-[#1c5461]/40 to-transparent z-10" />
          <div className="relative z-20 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-xl mb-3">
              Hotel Listings
            </h1>
            <p className="text-lg md:text-xl text-[#e6f7fa] drop-shadow-md max-w-2xl mx-auto">
              Find the best places to stay in Bantayan Island, curated from
              Tripadvisor.
            </p>
          </div>
        </section>

        <section className="w-full max-w-6xl mx-auto px-4">
          {error ? (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl border border-red-200">
              Error: {error}
            </div>
          ) : hotelList.length === 0 ? (
            <div className="text-center text-gray-500 py-12 bg-white/80 rounded-xl shadow">
              No hotels found.
            </div>
          ) : (
            <div className="flex flex-wrap gap-8 justify-center">
              {hotelList.map((hotel) => {
                const imageUrl =
                  hotel.photos && hotel.photos.length > 0
                    ? hotel.photos[0].images.large.url
                    : "/placeholder.jpg";
                return (
                  <a
                    key={hotel.location_id}
                    href={`https://www.tripadvisor.com.ph/Hotel_Review-d${hotel.location_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white/90 border border-[#e6f7fa] rounded-2xl shadow-md w-full sm:w-[48%] lg:w-[31%] min-w-[260px] max-w-xs p-0 flex flex-col items-center hover:shadow-2xl hover:border-green-400 transition-all duration-200 overflow-hidden"
                  >
                    <div className="relative w-full h-40">
                      <Image
                        src={imageUrl}
                        alt={hotel.name}
                        fill
                        className="object-cover rounded-t-2xl bg-gray-100"
                      />
                    </div>
                    <div className="p-6 flex flex-col items-center w-full">
                      <div className="font-bold text-lg text-center mb-2 group-hover:text-green-700 transition-colors">
                        {hotel.name}
                      </div>
                      <div className="text-gray-500 text-sm text-center mb-4">
                        {hotel.address_obj?.address_string}
                      </div>
                      <a
                        href={`https://www.tripadvisor.com.ph/Hotel_Review-d${hotel.location_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block px-4 py-2 bg-[#3e979f] hover:bg-[#1c5461] text-white rounded-lg font-semibold shadow transition text-center"
                        tabIndex={0}
                      >
                        View on Tripadvisor
                      </a>
                    </div>
                  </a>
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
