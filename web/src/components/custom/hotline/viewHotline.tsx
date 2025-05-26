import { Hotline } from "@/app/static/hotline/useHotlineManagerSchema";
import { hotlineFields } from "@/app/static/hotline/hotline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ViewHotline({ hotline }: { hotline: Hotline }) {
  if (!hotline) return null;

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Hotline Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {hotlineFields.map((field) => (
          <div className="flex flex-col gap-1" key={field.name}>
            <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
              {field.label}
            </Label>
            <span>
              {(() => {
                const value = hotline[field.name as keyof Hotline];
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
                return (
                  value || (
                    <span className="italic text-muted-foreground">N/A</span>
                  )
                );
              })()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
