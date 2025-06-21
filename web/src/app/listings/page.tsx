import Image from "next/image";
import Header from "@/components/custom/header";
import { fetchTripadvisorHotels } from "@/lib/api/tripadvisor";

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
      <div>
        <h2 className="text-3xl font-extrabold mb-8 text-gray-800 text-center tracking-tight">
          Hotel Listings
        </h2>
        {error ? (
          <div className="text-center py-10 text-red-500">Error: {error}</div>
        ) : hotelList.length === 0 ? (
          <div className="text-center text-gray-500">No hotels found.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
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
                  className="group bg-white border border-gray-200 rounded-xl shadow-sm w-72 p-6 flex flex-col items-center hover:shadow-xl hover:border-green-400 transition-all duration-200"
                >
                  <Image
                    width={288}
                    height={160}
                    src={imageUrl}
                    alt={hotel.name}
                    className="w-full h-40 object-cover rounded-md mb-4 bg-gray-100"
                  />
                  <div className="font-bold text-lg text-center mb-2 group-hover:text-green-700 transition-colors">
                    {hotel.name}
                  </div>
                  <div className="text-gray-500 text-sm text-center mb-4">
                    {hotel.address_obj?.address_string}
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-green-700 text-xs font-semibold">
                      View on Tripadvisor
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
