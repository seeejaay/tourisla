import { Announcement } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
export default function ViewAnnouncement({
  announcement,
}: {
  announcement: Announcement;
}) {
  if (!announcement) return null;
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-xl border-none shadow-none">
        <CardContent className="space-y-5 py-2">
          {/* Pinned status */}
          <div className="flex justify-end">
            {announcement.is_pinned && (
              <Badge className="bg-yellow-200 text-yellow-800 font-semibold px-3 py-1 rounded-full">
                📌 Pinned
              </Badge>
            )}
          </div>
          <div>
            <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
              Title
            </Label>
            <div className="text-xl font-bold text-[#1c5461]">
              {announcement.title}
            </div>
          </div>
          <div>
            <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
              Description
            </Label>
            <div className="text-base text-[#1c5461] break-words">
              {announcement.description}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                Date Posted
              </Label>
              <div className="text-[#1c5461]">{announcement.date_posted}</div>
            </div>
            <div className="flex-1">
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                Location
              </Label>
              <div className="text-[#1c5461]">
                {announcement.location || (
                  <span className="italic text-gray-400">N/A</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
              Category
            </Label>
            <div className="text-[#1c5461]">
              {announcement.category ? (
                announcement.category.replace(/_/g, " ")
              ) : (
                <span className="italic text-gray-400">N/A</span>
              )}
            </div>
          </div>
          {announcement.image_url && (
            <div>
              <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
                Image
              </Label>
              <img
                src={announcement.image_url}
                width={500}
                height={300}
                alt="Announcement"
                className="rounded-lg max-h-64 object-contain border mt-2"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
