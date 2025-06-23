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
    <Card className="max-w-lg mx-auto">
      <CardContent className="space-y-6">
        {accommodationFields.map((field) => (
          <div className="flex flex-col gap-1" key={field.name}>
            <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
              {field.label}
            </Label>
            <span>
              {(() => {
                const value = accommodation[field.name as keyof Accommodation];
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
      </CardContent>
    </Card>
  );
}
