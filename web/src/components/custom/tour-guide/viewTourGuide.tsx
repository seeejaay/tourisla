import { Label } from "@/components/ui/label";
import { TourGuide } from "./column";

export default function ViewTourGuide({ tourGuide }: { tourGuide: TourGuide }) {
  if (!tourGuide) return null;
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Profile Picture */}
      {tourGuide.profile_picture &&
        typeof tourGuide.profile_picture === "string" && (
          <div className="flex flex-col items-center mt-2">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow">
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
        <Label className="text-xs uppercase tracking-widest font-semibold text-[#3e979f]">
          Name
        </Label>
        <span className="text-2xl font-bold text-[#1c5461] text-center">
          {tourGuide.first_name} {tourGuide.last_name}
        </span>
      </div>

      {/* Two-column layout for most fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 py-4">
        {/* Column 1 */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-widest font-semibold text-[#3e979f]">
              Birth Date
            </Label>
            <span className="text-base text-[#17414a]">
              {tourGuide.birth_date ? (
                new Date(tourGuide.birth_date).toLocaleDateString()
              ) : (
                <span className="italic text-gray-400">N/A</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-widest font-semibold text-[#3e979f]">
              Sex
            </Label>
            <span className="text-base text-[#17414a]">
              {tourGuide.sex || (
                <span className="italic text-gray-400">N/A</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-widest font-semibold text-[#3e979f]">
              Mobile Number
            </Label>
            <span className="text-base text-[#17414a]">
              {tourGuide.mobile_number || (
                <span className="italic text-gray-400">N/A</span>
              )}
            </span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-widest font-semibold text-[#3e979f]">
              Email
            </Label>
            <span className="text-base text-[#17414a]">
              {tourGuide.email || (
                <span className="italic text-gray-400">N/A</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-widest font-semibold text-[#3e979f]">
              Reason for Applying
            </Label>
            <span className="text-base text-[#17414a]">
              {tourGuide.reason_for_applying || (
                <span className="italic text-gray-400">N/A</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
