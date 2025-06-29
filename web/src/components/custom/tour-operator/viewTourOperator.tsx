import { Label } from "@/components/ui/label";
import { TourOperator } from "./column";

export default function ViewTourOperator({
  tourOperator,
}: {
  tourOperator: TourOperator;
}) {
  if (!tourOperator) return null;
  return (
    <div className="w-full space-y-8">
      {/* Name */}
      <div className="flex flex-col gap-1 items-center">
        <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
          Name
        </Label>
        <span className="text-3xl font-extrabold text-[#1c5461] text-center">
          {tourOperator.operator_name}
        </span>
      </div>

      {/* Two-column layout for most fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1 */}
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
              Email
            </Label>
            <span className="text-base text-[#17414a]">
              {tourOperator.email || (
                <span className="italic text-gray-400">N/A</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
              Contact Number
            </Label>
            <span className="text-base text-[#17414a]">
              {tourOperator.mobile_number || (
                <span className="italic text-gray-400">N/A</span>
              )}
            </span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
              Address
            </Label>
            <span className="text-base text-[#17414a]">
              {tourOperator.office_address || (
                <span className="italic text-gray-400">N/A</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-[#3e979f]">
              Application Status
            </Label>
            <span
              className={`capitalize font-semibold ${
                tourOperator.application_status === "approved"
                  ? "text-green-600"
                  : tourOperator.application_status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {tourOperator.application_status || (
                <span className="italic text-gray-400">Pending</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
