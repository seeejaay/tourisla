import { Label } from "@/components/ui/label";
import { TourGuide } from "./column";

export default function ViewTourGuide({ tourGuide }: { tourGuide: TourGuide }) {
  if (!tourGuide) return null;
  return (
    <div className="w-full space-y-6">
      {/* Profile Picture */}
      {tourGuide.profile_picture &&
        typeof tourGuide.profile_picture === "string" && (
          <div className="flex flex-col items-center mt-2">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={tourGuide.profile_picture}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}

      {/* Name */}
      <div className="flex flex-col gap-1 items-center">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Name
        </Label>
        <span className="text-2xl font-bold text-blue-800 text-center">
          {tourGuide.first_name} {tourGuide.last_name}
        </span>
      </div>

      {/* Two-column layout for most fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Birth Date
            </Label>
            <span>
              {tourGuide.birth_date ? (
                new Date(tourGuide.birth_date).toLocaleDateString()
              ) : (
                <span className="italic text-muted-foreground">N/A</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Sex
            </Label>
            <span>
              {tourGuide.sex || (
                <span className="italic text-muted-foreground">N/A</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Mobile Number
            </Label>
            <span>
              {tourGuide.mobile_number || (
                <span className="italic text-muted-foreground">N/A</span>
              )}
            </span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <span>
              {tourGuide.email || (
                <span className="italic text-muted-foreground">N/A</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Reason for Applying
            </Label>
            <span>
              {tourGuide.reason_for_applying || (
                <span className="italic text-muted-foreground">N/A</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
