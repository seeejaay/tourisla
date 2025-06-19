import { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
export default function ViewTouristSpot({
  touristSpot,
}: {
  touristSpot: TouristSpot;
}) {
  if (!touristSpot) return null;
  return (
    <Card className="w-full">
      <CardContent className="space-y-6">
        {/* Name (full width) */}
        <div className="flex flex-col gap-1">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Name
          </Label>
          <span className="text-3xl font-bold text-blue-800">
            {touristSpot.name}
          </span>
        </div>

        {/* Three-column layout for most fields on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Type
              </Label>
              <span className="font-medium">
                {touristSpot.type || (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Opening Hours
              </Label>
              <span>
                {touristSpot.opening_time || (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Closing Hours
              </Label>
              <span>
                {touristSpot.closing_time || (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Entrance Fee
              </Label>
              <span>
                {touristSpot.entrance_fee || (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Contact Number
              </Label>
              <span>
                {touristSpot.contact_number || (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Other Fees
              </Label>
              <span>
                {touristSpot.other_fees || (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </span>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Address
              </Label>
              <span>
                {[
                  touristSpot.barangay,
                  touristSpot.municipality,
                  touristSpot.province,
                ]
                  .filter(Boolean)
                  .join(", ") || (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Location
              </Label>
              <span>
                {touristSpot.location ? (
                  <a
                    href={touristSpot.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on map
                  </a>
                ) : (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Facebook Page
              </Label>
              {touristSpot.facebook_page ? (
                <a
                  href={touristSpot.facebook_page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {touristSpot.facebook_page}
                </a>
              ) : (
                <span className="italic text-muted-foreground">N/A</span>
              )}
            </div>
          </div>
        </div>

        {/* Full-width fields below the columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Description
            </Label>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-base text-gray-700 whitespace-pre-line">
                {touristSpot.description || (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Rules
            </Label>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-base text-gray-700 whitespace-pre-line">
                {touristSpot.rules || (
                  <span className="italic text-muted-foreground">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Images Section */}
        {touristSpot.images && touristSpot.images.length > 0 && (
          <div className="mt-6">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground block mb-4">
              Images
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {touristSpot.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={image.image_url.replace(/\s/g, "")}
                    alt={`Tourist Spot Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
