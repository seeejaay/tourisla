import { Label } from "@/components/ui/label";
import { TourOperator } from "./column";

export default function ViewTourOperator({
  tourOperator,
}: {
  tourOperator: TourOperator;
}) {
  if (!tourOperator) return null;
  return (
    <div className="w-full space-y-6">
      {/* Name */}
      <div className="flex flex-col gap-1 items-center">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Name
        </Label>
        <span className="text-2xl font-bold text-blue-800 text-center">
          {tourOperator.operator_name}
        </span>
      </div>

      {/* Two-column layout for most fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <span>
              {tourOperator.email || (
                <span className="italic text-muted-foreground">N/A</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Contact Number
            </Label>
            <span>
              {tourOperator.mobile_number || (
                <span className="italic text-muted-foreground">N/A</span>
              )}
            </span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Address
            </Label>
            <span>
              {tourOperator.office_address || (
                <span className="italic text-muted-foreground">N/A</span>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Application Status
            </Label>
            <span className="capitalize">
              {tourOperator.application_status || (
                <span className="italic text-muted-foreground">Pending</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
