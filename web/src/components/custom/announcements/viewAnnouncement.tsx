import { Announcement } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ViewAnnouncement({
  announcement,
}: {
  announcement: Announcement;
}) {
  if (!announcement) return null;
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Announcement Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Title
          </Label>
          <span className="text-2xl font-bold">{announcement.title}</span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Description
          </Label>
          <span className="text-base break-words">
            {announcement.description}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Date Posted
          </Label>
          <span>{announcement.date_posted}</span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Location
          </Label>
          <span>
            {announcement.location || (
              <span className="italic text-muted-foreground">N/A</span>
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
            Category
          </Label>
          <span>
            {announcement.category || (
              <span className="italic text-muted-foreground">N/A</span>
            )}
          </span>
        </div>
        {announcement.image_url && (
          <div className="flex flex-col gap-1">
            <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
              Image
            </Label>
            <img
              src={announcement.image_url}
              width={500}
              height={300}
              alt="Announcement"
              className="rounded-lg max-h-64 object-contain border"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
