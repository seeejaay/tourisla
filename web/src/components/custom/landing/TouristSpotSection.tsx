import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { MapPin } from "lucide-react";

interface TouristSpotImage {
  id: number;
  tourist_spot_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface TouristSpot {
  id: number;
  name: string;
  description: string;
  location: string;
  type: string;
  municipality: string;
  province: string;
  images?: TouristSpotImage[];
  created_at: string;
  opening_time?: string;
  closing_time?: string;
  entrance_fee?: string;
  days_open?: string;
}

interface TouristSpotSectionProps {
  touristSpots: TouristSpot[];
}

export default function TouristSpotSection({
  touristSpots,
}: TouristSpotSectionProps) {
  if (!touristSpots || touristSpots.length === 0) {
    return (
      <section className="bg-white w-full py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gray-50 shadow-lg rounded-lg">
            <header className="text-center p-8">
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                Discover Amazing Tourist Spots
              </h2>
              <p className="text-gray-600">
                No tourist spots available at the moment.
              </p>
            </header>
          </div>
        </div>
      </section>
    );
  }

  // Get varied categories to ensure diversity
  const getVariedSpots = (spots: TouristSpot[]) => {
    if (spots.length <= 4) {
      return [...spots].sort(() => Math.random() - 0.5);
    }

    // Create a daily seed for consistent randomization
    const today = new Date();
    const dailySeed =
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate();

    // Seeded random function
    let seed = dailySeed;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const selectedSpots: TouristSpot[] = [];
    const availableSpots = [...spots];

    // Shuffle available spots with seeded random
    for (let i = availableSpots.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [availableSpots[i], availableSpots[j]] = [
        availableSpots[j],
        availableSpots[i],
      ];
    }

    // Get variety by categories
    const categories = [...new Set(spots.map((spot) => spot.type))];

    // Shuffle categories with seeded random
    for (let i = categories.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [categories[i], categories[j]] = [categories[j], categories[i]];
    }

    // Try to get one spot from each category
    categories.forEach((category) => {
      if (selectedSpots.length < 4) {
        const spotInCategory = availableSpots.find(
          (spot) => spot.type === category
        );

        if (spotInCategory) {
          selectedSpots.push(spotInCategory);
          const index = availableSpots.indexOf(spotInCategory);
          availableSpots.splice(index, 1);
        }
      }
    });

    // Fill remaining slots
    while (selectedSpots.length < 4 && availableSpots.length > 0) {
      selectedSpots.push(availableSpots.shift()!);
    }

    return selectedSpots;
  };

  // Get 4 varied spots
  const displaySpots = getVariedSpots(touristSpots);

  // Helper function to get the first image URL
  const getFirstImageUrl = (images?: TouristSpotImage[]): string | null => {
    if (!images || images.length === 0) return null;
    return images[0].image_url;
  };

  const titleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <section className="bg-gray-50 w-full lg:py-20 py-4">
      <div className="container mx-auto px-4">
        {/* Tourist Spots Grid - Changed to 4 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displaySpots.map((spot) => {
            const imageUrl = getFirstImageUrl(spot.images);

            return (
              <Link href={`/tourist-spots/${spot.id}`} key={spot.id}>
                <Card className="h-full transition-all duration-300  group overflow-hidden bg-gray-50  shadow-none p-0 border-none rounded-none ">
                  {/* Image - Fixed 500x250 dimensions */}
                  {imageUrl ? (
                    <CardHeader className="p-0 m-0  cursor-default">
                      <div className="w-full lg:h-[250px] h-[200px] overflow-hidden rounded-lg">
                        <Image
                          src={imageUrl}
                          alt={spot.name}
                          width={500}
                          height={250}
                          className="w-full h-full object-cover transition-transform duration-500"
                          priority={false}
                        />
                      </div>
                    </CardHeader>
                  ) : (
                    // Fallback when no image is available
                    <CardHeader className="p-0 m-0">
                      <div className="w-full h-[250px] bg-gray-200 flex  items-center justify-center rounded-lg">
                        <span className="text-gray-400 text-sm">
                          No Image Available
                        </span>
                      </div>
                    </CardHeader>
                  )}

                  <CardContent className="p-0  cursor-default">
                    {/* Title */}
                    <h3 className="font-semibold text-start text-sm lg:text-lg  text-neutral-800 line-clamp-1">
                      {titleCase(spot.name)}
                    </h3>

                    {/* Location */}
                    <div className=" text-gray-500">
                      <span className="text-sm truncate">
                        {spot.municipality === "SANTA_FE"
                          ? "Santa Fe"
                          : titleCase(spot.municipality)}
                        , {titleCase(spot.province)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
