import { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ViewTouristSpot({
  touristSpot,
}: {
  touristSpot: TouristSpot;
}) {
  if (!touristSpot) return null;
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Tourist Spot Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Name
          </Label>
          <span className="text-2xl font-bold">{touristSpot.name}</span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Type
          </Label>
          <span>{touristSpot.type}</span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Description
          </Label>
          <span className="text-base break-words">
            {touristSpot.description}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Address
          </Label>
          <span>
            {[
              touristSpot.barangay,
              touristSpot.municipality,
              touristSpot.province,
            ]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Location (Lat, Long)
          </Label>
          <span>
            {touristSpot.latitude && touristSpot.longitude ? (
              `${touristSpot.latitude}, ${touristSpot.longitude}`
            ) : (
              <span className="italic text-muted-foreground">N/A</span>
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Opening Hours
          </Label>
          <span>
            {touristSpot.opening_hours || (
              <span className="italic text-muted-foreground">N/A</span>
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Closing Hours
          </Label>
          <span>
            {touristSpot.closing_hours || (
              <span className="italic text-muted-foreground">N/A</span>
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Contact Number
          </Label>
          <span>
            {touristSpot.contact_number || (
              <span className="italic text-muted-foreground">N/A</span>
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Facebook Page
          </Label>
          <span>
            {touristSpot.facebook_page ? (
              <a
                href={touristSpot.facebook_page}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {touristSpot.facebook_page}
              </a>
            ) : (
              <span className="italic text-muted-foreground">N/A</span>
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Rules
          </Label>
          <span>
            {touristSpot.rules || (
              <span className="italic text-muted-foreground">N/A</span>
            )}
          </span>
        </div>
        {touristSpot.images && touristSpot.images.length > 0 && (
          <div className="flex flex-col gap-1">
            <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
              Image
            </Label>
            <img
              src={touristSpot.images[0].image_url.replace(/\s/g, "")}
              width={500}
              height={300}
              alt="Tourist Spot"
              className="rounded-lg max-h-64 object-contain border"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
