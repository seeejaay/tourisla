import { Hotline } from "@/app/static/hotline/useHotlineManagerSchema";
import { hotlineFields } from "@/app/static/hotline/hotline";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ViewHotline({ hotline }: { hotline: Hotline }) {
  if (!hotline) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-xl border-none shadow-none">
        <CardContent className="space-y-5 py-2">
          {hotlineFields.map((field) => (
            <div key={field.name}>
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                {field.label}
              </Label>
              <div className="text-base text-[#1c5461] break-words">
                {(() => {
                  const value = hotline[field.name as keyof Hotline];
                  if (field.type === "select" && typeof value === "string") {
                    const opt = field.options?.find((o) => o.value === value);
                    return opt ? opt.label : value.replace(/_/g, " ");
                  }
                  if (typeof value === "string" && value.trim() === "") {
                    return <span className="italic text-gray-400">N/A</span>;
                  }
                  return (
                    value || <span className="italic text-gray-400">N/A</span>
                  );
                })()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
