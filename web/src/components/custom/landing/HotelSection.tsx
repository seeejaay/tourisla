import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Hotel } from "@/types/HotelType";
import { toTitleCase } from "@/lib/utils/stringUtils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface HotelsSectionProps {
  hotels: Hotel[];
}

export default function HotelsSection({ hotels }: HotelsSectionProps) {
  if (!hotels || hotels.length === 0) {
    return (
      <section className="bg-gray-50 w-full py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-lg rounded-lg">
            <header className="text-center p-8">
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                Recommended Hotels
              </h2>
              <p className="text-gray-600">
                No hotels available at the moment.
              </p>
            </header>
          </div>
        </div>
      </section>
    );
  }

  const displayHotels = (() => {
    const today = new Date();
    const seed =
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate();

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const indices = Array.from({ length: hotels.length }, (_, i) => i);

    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i) * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    return indices.slice(0, 4).map((index) => hotels[index]);
  })();

  return (
    <section className="bg-gray-50  w-full lg:py-20 p-4 ">
      <div className="container mx-auto lg:border lg:shadow-[0_0_20px_2px_rgba(0,0,0,0.1)] lg:rounded-lg lg:p-8 p-4">
        <header className="text-left ">
          <h2 className="text-xl lg:text-3xl font-bold text-neutral-800 mb-4">
            Recommended Hotels
          </h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 ">
          {displayHotels.map((hotel) => {
            return (
              <Card
                key={hotel.location_id}
                className="h-full  border-none  shadow-none hover:shadow-none cursor-pointer bg-gray-50 group overflow-hidden p-0"
              >
                {hotel.photos &&
                Array.isArray(hotel.photos) &&
                hotel.photos.length > 0 &&
                hotel.photos[0]?.images?.large?.url ? (
                  <CardHeader className="p-0 m-0 hover:shadow-none hover:border-none">
                    <div className="w-full h-[200px] sm:h-[220px] lg:h-[350px] overflow-hidden rounded-lg">
                      <Image
                        src={hotel.photos[0].images.large.url}
                        alt={hotel.photos[0].caption || hotel.name}
                        width={500}
                        height={350}
                        className="w-full h-full object-cover hover:shadow-none hover:border-none "
                        priority={false}
                      />
                    </div>
                  </CardHeader>
                ) : (
                  <CardHeader className="p-0">
                    <div className="w-full h-[200px] sm:h-[100px] lg:h-[300px] bg-gray-200 flex items-center justify-center rounded-t-lg">
                      <span className="text-gray-400 text-sm">
                        No Image Available
                      </span>
                    </div>
                  </CardHeader>
                )}

                <CardContent className="p-0 m-0">
                  <h3 className="font-semibold text-md lg:text-lg mb-2 text-neutral-800 line-clamp-1">
                    {toTitleCase(hotel.name)}
                  </h3>

                  {hotel.address_obj?.address_string && (
                    <div className="flex items-center gap-1 mb-3 text-gray-500">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">
                        {hotel.address_obj.address_string}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View More Button */}
        {/* {hotels.length > 4 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-teal-500 text-teal-600 hover:bg-teal-50 px-8 py-3"
            >
              View All Hotels ({hotels.length - 4} more)
            </Button>
          </div>
        )} */}
      </div>
    </section>
  );
}
