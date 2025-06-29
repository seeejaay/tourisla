import { Accommodation } from "@/app/static/accommodation/accommodationSchema";
import { accommodationFields } from "@/app/static/accommodation/accommodation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ViewAccommodation({
  accommodation,
}: {
  accommodation: Accommodation;
}) {
  if (!accommodation) return null;

  return (
    <Card className="max-w-lg mx-auto border-none shadow-none">
      <CardContent className="space-y-4  px-2">
        <h2 className="text-2xl font-bold text-[#1c5461] mb-4 text-center">
          {accommodation.name_of_establishment}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {accommodationFields.map((field) => (
            <div className="flex flex-col gap-1" key={field.name}>
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                {field.label}
              </Label>
              <span className="text-[#1c5461] text-base">
                {(() => {
                  const value =
                    accommodation[field.name as keyof Accommodation];
                  if (field.type === "select" && typeof value === "string") {
                    // Find the label for the selected option
                    const opt = field.options?.find((o) => o.value === value);
                    return opt ? opt.label : value.replace("_", " ");
                  }
                  if (typeof value === "string" && value.trim() === "") {
                    return (
                      <span className="italic text-muted-foreground">N/A</span>
                    );
                  }
                  if (value === undefined || value === null || value === "") {
                    return (
                      <span className="italic text-muted-foreground">N/A</span>
                    );
                  }
                  return value;
                })()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
